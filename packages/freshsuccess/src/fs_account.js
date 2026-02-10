const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");

const { fetchFreshsuccessData } = require('./fs_common');
const { buildFSAccount } = require('./fs_build_account');
const { getUserMetrics } = require('./fs_metrics');
const { readLast3MonthsBillingData } = require('./fs_billing');


// Freshsuccess Account Class
class fs_account 
{
    constructor() 
    {
        _initAccounts(this);
    }

    getAccounts()
    {
        return _getAccounts(this);
    }

    getBillingData()
    {
        return _getBillingData(this);
    }

    getInvitedUsersMetrics()
    {
        return _getInvitedUsersMetrics(this);
    }

    getVerifiedUsersMetrics()
    {
        return _getVerifiedUsersMetrics(this);
    }
}


/* 
Function: _initAccounts
Purpose: Initializes the 'accounts' object
Inputs: account instance
Output: 0 on success, -1 on failure
*/
function _initAccounts(account) 
{

  // Initialize an array to store the account list
  account.account_list = [];

  // Initialize number of accounts
  account.num_accounts = 0;

  // Initialize array for metrics
  account.metrics = [];
  account.num_metrics = 0;

  // Initialize array for contacts
  account.contact_list = [];

  // Initialize number of contacts
  account.num_contacts = 0;

  // Nothing else to do, return success
  return 0;
}


/* 
Function: _getAccounts
Purpose: Gets the list of all accounts from Freshsuccess
Inputs: account instance
Output: List of accounts stored in account.account_list[]. Returns 0 on success, -1 on failure
*/
async function _getAccounts(account)
{
    // API endpoint and query params
    var path = "accounts";
    var include_inactive = "true";
    var order_by = "name";
    var include = "assigned_csms,custom_label_dimensions,custom_value_dimensions,custom_event_dimensions";

    // Initialize loop counters 
    var i = 0, j = 0;  

    // Initialize the page and record count
    var max_page_size = process.env.FRESHSUCCESS_MAX_ACCOUNTS_PER_PAGE || 1000;
    var current_page = process.env.FRESHSUCCESS_START_PAGE || 0;
    var records_on_current_page = 0;

    do
    {
        try
        {
            // Fetch data for the current page
            const data = await fetchFreshsuccessData
            ({
                path: path,
                current_page: current_page,
                include_inactive: include_inactive,
                order_by: order_by,
                include: include
            });

            current_page = data.current_page;
            max_page_size = data.max_page_size;
            records_on_current_page = data.results.length;

            // Load all accounts received in this response to the account_list []
            for(i = 0; i < data.results.length; i++)
            {
                var org_id = data.results[i]["account_id"];
                var account_churn = false;

                // If we dont't have a valid org ID, skip
                if(org_id == "") continue;

                if(data.results[i]["is_churned"] == true)
                {
                    account_churn = true;
                }

                // Build the account info in the required format
                const account_info = buildFSAccount({this_account: data.results[i]});

                // Push this data instance to the account list
                account.account_list.push(account_info);

                // Increment counter
                account.num_accounts++;
            };

            // If records on the current page were greater than the max page size, then increment the page number
            if(records_on_current_page >= max_page_size) current_page++;

            // set a sleep here for 100 ms so that we don't exceed the throttle
            common.sleep(100);
        }
        catch(e)
        {
            common.statusMessage(arguments.callee.name, "Error fetching accounts data from Freshsuccess: " + e.message);
            return -1;
        }
            
    }while(records_on_current_page >= max_page_size);

    common.statusMessage(arguments.callee.name, "Successfully fetched total accounts: " + account.num_accounts);
        
    return 0;
}



/* 
Function: _getBillingData
Purpose: Gets the billing data for the last 3 months. Pre-requisite: getAccounts() to be invoked prior
Inputs: account instance
Output: Billing data. Returns 0 on success, -1 on failure
*/
async function _getBillingData(account)
{
    await readLast3MonthsBillingData(account);
    return 0;
}



/* 
Function: _getInvitedUsersMetrics
Purpose: Gets the list of metric values for metric name: "product_db.num_invited_users". Pre-requisite: getAccounts() to be invoked prior
Inputs: account instance
Output: List of metrics for "product_db.num_invited_users". Returns 0 on success, -1 on failure
*/
function _getInvitedUsersMetrics(account)
{
    // Metric name
    const metric_name = "product_db.num_invited_users";
    return getUserMetrics(account, metric_name);
}


/* 
Function: _getVerifiedUsersMetrics
Purpose: Gets the list of metric values for metric name: "product_db.num_verified_users". Pre-requisite: getAccounts() to be invoked prior
Inputs: account instance
Output: List of metrics for "product_db.num_verified_users". Returns 0 on success, -1 on failure
*/
function _getVerifiedUsersMetrics(account)
{
    // Metric name
    const metric_name = "product_db.num_verified_users";
    return getUserMetrics(account, metric_name);
}


// Exporting the class
module.exports = 
{
    fs_account
};