const { formatInTimeZone } = require("date-fns-tz");

const common = require("@fyle-ops/common");
const { billing_data } = require("@fyle-ops/billing");
const { buildFSAccount } = require('./buildFSAccount');
const { getUserMetrics } = require('./freshsuccessMetrics');

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


async function fetchFreshsuccessData
({
  host,
  api_key_orig,
  path,
  current_page = 0,
  include_inactive = true,
  order_by = "",
  include = ""
}) 
{
  const url = new URL(`https://${host}/api/v2/${path}`);

  url.searchParams.append("api_key", api_key_orig);
  url.searchParams.append("page", String(current_page));
  url.searchParams.append("include_inactive", String(include_inactive));
  if (order_by) url.searchParams.append("order_by", order_by);
  if (include) url.searchParams.append("include", include);

  console.log("Url =", url.toString());

  // IMPORTANT: return / await this
  return common.withRetry(async () => {
    const res = await fetch(url.toString(), { method: "GET" });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Freshsuccess ${res.status}: ${body}`);
    }
    const json = await res.json();
    return json; // parsed JSON body
  });
}


async function _getAccounts(account)
{
    console.log("in _getAccounts !!!");

    var api_key_orig = process.env.FRESHSUCCESS_API_KEY;
    var this_host = process.env.FRESHSUCCESS_HOST;
    var path = "accounts";
    var include_inactive = "true";
    var order_by = "name";
    var include = "assigned_csms,custom_label_dimensions,custom_value_dimensions,custom_event_dimensions";

    // Initialize loop counters 
    var i = 0, j = 0;  

    // Initialize the page and record count
    var max_page_size = 0;
    var current_page = 0;
    var records_on_current_page = 0;


    do
    {
        const data = await fetchFreshsuccessData({
            host: this_host,
            api_key_orig: api_key_orig,
            path: "accounts",
            current_page: current_page,
            include_inactive: "true",
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

            const account_info = buildFSAccount({this_account: data.results[i]});

            // Push this data instance to the account list
            account.account_list.push(account_info);

            // Increment counter
            account.num_accounts++;
        };

        // If records on the current page were greater than the max page size, then increment the page number
        if(records_on_current_page >= max_page_size) current_page++;

    }while(records_on_current_page >= max_page_size);
        
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
    var i = 0;

    // Get period markers for the last 3 months
    var last3MonthsDateMarkers = common.returnPrevious3MonthsPeriodMarkers();
    
    // Get billing data for current month - 1
    var billingM1 = new billing_data();
    await billingM1.getBillingLinks();
    await billingM1.getBillingData(last3MonthsDateMarkers["m_1_start"]["date"]);

    // Get billing data for current month - 2
    var billingM2 = new billing_data();
    await billingM2.getBillingLinks();
    await billingM2.getBillingData(last3MonthsDateMarkers["m_2_start"]["date"]);

    // Get billing data for current month - 3
    var billingM3 = new billing_data();
    await billingM3.getBillingLinks();
    await billingM3.getBillingData(last3MonthsDateMarkers["m_3_start"]["date"]);


    // Map the billing data to the respective accounts
    for(i = 0; i < account.num_accounts; i++)
    {
        var org_id = account.account_list[i].id["org_id"];

        var billing_details_M1 = billingM1.getBillingDetailsForOrg(org_id);
        var billing_details_M2 = billingM2.getBillingDetailsForOrg(org_id);
        var billing_details_M3 = billingM3.getBillingDetailsForOrg(org_id);

        account.account_list[i].metrics["m_3"]["m3_num_expenses"] = billing_details_M3.num_expenses;
        account.account_list[i].metrics["m_3"]["m3_num_reports"] = billing_details_M3.num_reports;
        account.account_list[i].metrics["m_3"]["m3_active_users"] = billing_details_M3.active_users;

        account.account_list[i].metrics["m_2"]["m2_num_expenses"] = billing_details_M2.num_expenses;
        account.account_list[i].metrics["m_2"]["m2_num_reports"] = billing_details_M2.num_reports;
        account.account_list[i].metrics["m_2"]["m2_active_users"] = billing_details_M2.active_users;

        account.account_list[i].metrics["m_1"]["m1_num_expenses"] = billing_details_M1.num_expenses;
        account.account_list[i].metrics["m_1"]["m1_num_reports"] = billing_details_M1.num_reports;
        account.account_list[i].metrics["m_1"]["m1_active_users"] = billing_details_M1.active_users;
    }

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


// EXPORTS
module.exports = 
{
  fs_account
};