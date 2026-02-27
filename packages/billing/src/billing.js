const { google } = require('googleapis');
const common = require("@fyle-ops/common");
const { account_mapping } = require("@fyle-ops/account_mapping");


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Billing class to read and process billing data from the billing files
class billing_data
{
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////// CLASS VARIABLES ///////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // Array to store the billing links and associated data
    billing_links = [];

    // Number of billing links
    num_billing_links = 0;

    // Index of selected billing period
    selected_period = -1;

    // Raw billing data from the billing file
    raw_billing_entries =
    {
        // Initialize an array to store the raw billing entries
        raw_billing_entry_list: [],

        // Initialize number of raw billing entries
        num_raw_billing_entries: 0,
    };

    // Billing data consolidated by org
    billing_by_org =
    {
        // Initialize an array to store the billing data by org
        billing_by_org_list: [],

        // Initialize number of billing entries by org
        num_org_billing_entries: 0,
    };

    // Billing data consolidated by account
    billing_by_account = 
    {
        // Initialize an array to store the billing data by account
        billing_by_account_list: [],

        // Initialize number of billing entries by org
        num_account_billing_entries: 0,
    };

    // List of active users
    active_users = 
    {
        // Initialize an array to store the active user list
        active_user_list: [],

        // Initialize number of active users
        num_active_users: 0,
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////// CLASS FUNCTIONS ///////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    constructor()
    {
      _initBilling(this);
    }

    async getBillingLinks()
    {
        return await _getBillingLinks(this);
    }

    async getBillingData(period)
    {
        return await _getBillingData(this, period);
    }

    getBillingDetailsForOrg(org_id)
    {
        return _getBillingDetailsForOrg(this, org_id);
    }
}


/* 
Function: _initBilling
Purpose: Initializes the billing functionality
Inputs: billing instance
Output: 0 on success, -1 on failure
*/
function _initBilling(billing)
{
    // Get the function name for logging purposes
    const fn = _initBilling.name;

    // Nothing else to do, return success
    return 0;
}



/* 
Function: _getBillingLinks
Purpose: Gets the list of all billing links from the Billing Links file
Inputs: billing instance
Output: List of billing links in billing.billing_links[]. Returns 0 on success, -1 on failure
*/
async function _getBillingLinks(billing)
{
    // Get the function name for logging purposes
    const fn = _getBillingLinks.name;
    
    // Get authentication and sheets instance
    const auth = common.createGoogleAuth();
    const sheets = google.sheets({ version: "v4", auth });

    // Billing Links file located at https://docs.google.com/spreadsheets/d/1SnZqQaON6j11a6MuQC0jEm5Lpeu4qqkWuBtMaRZ9i2M/
    //const sheet_id = "1SnZqQaON6j11a6MuQC0jEm5Lpeu4qqkWuBtMaRZ9i2M";
    const sheet_id = process.env.BILLING_LINKS_SHEET_ID;

    // Sheet in Billing Links file that has the list of all billing files for each month
    //const sheet_name = "Enterprise Billing Sheet";
    const sheet_name = process.env.BILLING_LINKS_SHEET_NAME;

    // Get all values from the sheet
    const res = await sheets.spreadsheets.values.get
    ({
        spreadsheetId: sheet_id,
        range: `${sheet_name}`,
    });


    // Initialize variables to read the billing links sheet
    const start_row = 1;
    const start_col = 1;
    const {lastRow: num_rows, lastColumn: num_cols} = common.getLastRowAndCol(res.data.values);

    const billing_links_month_col = 1;
    const billing_links_file_col = 2;

    // Loop through the list of months and add them to the billing links structure and to the months array; skip the header
    for(var i = start_row; i < num_rows; i++)
    {
        // Get the billing period and link for this row
        var period = res.data.values[i][billing_links_month_col-1];
        var link = res.data.values[i][billing_links_file_col-1];

        // Basic checks to ensure we have valid values for period and link; if not, break out of the loop
        period = (period ?? "").toString().trim();
        link = (link   ?? "").toString().trim();
        if(!period || !link) break;

        // Get the start and end date for this billing period based on the month value
        var thisPeriodObj = new Date(period);
        var thisPeriodMarkers = common.getMonthMarkers(thisPeriodObj);
        var startOfPeriodDate = thisPeriodMarkers["m_start"]["date"];
        var endOfPeriodDate = thisPeriodMarkers["m_end"]["date"];

        var billing_link = 
        {
            // Link to billing period start
            billing_period_start: startOfPeriodDate,

            // Link to billing period end
            billing_period_end: endOfPeriodDate,

            // Link to the billing file
            billing_link: link,

            // ID of the billing file
            billing_file_id: common.getIdFromUrl(link),
        };

        // Also push this to the months array
        billing.billing_links.push(billing_link);

        // Increment counter
        billing.num_billing_links++;
    }

    common.statusMessage(fn, "Finished processing billing links sheet: " , billing.num_billing_links , " billing entries processed.");

    return 0;
}


/* 
Function: _getBillingData
Purpose: Gets the billing entries based on the period selected
Inputs: Billing instance, period (date string)
Output: Billing entries in billing.billing_links[].raw_billing_entries[], billing_by_org[], billing_by_account_list[]. Returns 0 on success, -1 on failure
*/
async function _getBillingData(billing, period)
{
    // Get the function name for logging purposes
    const fn = _getBillingData.name;
    
    // Initialize variables to read the billing links sheet
    var i = 0, j = 0;
    var period_time = new Date(period).getTime();
    var selected_billing_entry = -1;

    // Locate the correct billing entry for this period
    for(var i = 0; i < billing.num_billing_links; i++)
    {
        // Get the billing period start and end time for this billing entry
        var billing_period_start_time = new Date(billing.billing_links[i].billing_period_start).getTime();
        var billing_period_end_time = new Date(billing.billing_links[i].billing_period_end).getTime();

        // Check if the period passed in falls within this billing period
        if((period_time >= billing_period_start_time) && (period_time <= billing_period_end_time))
        {
            selected_billing_entry = i;
            break;
        }
    }

    // Check if we were able to get the billing entry
    if(selected_billing_entry < 0)
    {
        common.statusMessage(fn, "Failed to get the correct billing entry corresponding to period: " , period);
        return -1;
    }

    // Store the index of the billing period
    billing.selected_period = selected_billing_entry;

    common.statusMessage(fn, "Billing entry index corresponding to period: " , period , " = " , selected_billing_entry);
    common.statusMessage(fn, "Billing Period start: " , billing.billing_links[selected_billing_entry].billing_period_start);
    common.statusMessage(fn, "Billing Period end: " , billing.billing_links[selected_billing_entry].billing_period_end);
    common.statusMessage(fn, "Billing File Link: " , billing.billing_links[selected_billing_entry].billing_link);
    common.statusMessage(fn, "Billing File ID: " , billing.billing_links[selected_billing_entry].billing_file_id);

    // Get authentication and sheets instance
    const auth = common.createGoogleAuth();
    const sheets = google.sheets({ version: "v4", auth });

    // Billing file id
    const sheet_id = billing.billing_links[selected_billing_entry].billing_file_id; 

    // Sheet that has the usage data
    //const sheet_name = "usage";
    const sheet_name = process.env.BILLING_DATA_SHEET_NAME;

    // Get all values from the sheet
    const res = await sheets.spreadsheets.values.get
    ({
        spreadsheetId: sheet_id,
        range: `${sheet_name}`,
    });
    
    // Add a new column at the end to track if a row has been processed or not
    const rows = res.data.values || [];
    for (const row of rows)
    {
        row.push(""); 
    }

    // Initialize variables to read the billing entries
    const start_row = 1;
    const start_col = 1;
    const {lastRow: num_rows, lastColumn: num_cols} = common.getLastRowAndCol(res.data.values);

    // Locate the columns in the billing sheet that we are interested in
    var billing_usage_cols = 
    {
        "month": -1,
        "org_id": -1,
        "org_name": -1,
        "org_created_at": -1,
        "org_owner_email": -1,
        "employee_id": -1,
        "num_expenses": -1,
        "num_reports": -1,
    };

    // Locate the columns that we are interested in
    for(var key in billing_usage_cols)
    {
        for(i = 0; i < num_cols; i++)
        {
            if(res.data.values[0][i] == key) billing_usage_cols[key] = i;
        }
    }

    // Check if we have been able to get all required columns
    for(key in billing_usage_cols)
    {
        // "org_name" is the only optional key
        if((billing_usage_cols[key] == -1) && (key != "org_name"))
        {
            common.statusMessage(fn, "Failed to locate column for key: " , key);
            return -1;
        }
    }

    // Next read in the account mapping sheet in preparation for mapping the AU model
    const account_map = new account_mapping();
    await account_map.getAccountMappingData();

    // If we are here, then we have been able to get required columns. Read through the billing file and process usage information
    for(i = start_row; i < num_rows; i++)
    {
        var month = res.data.values[i][billing_usage_cols["month"]];
        var org_id = res.data.values[i][billing_usage_cols["org_id"]];
        var org_num_expenses = 0;
        var org_num_reports = 0;
        var org_num_active_users = 0;
        var org_num_active_users_normalized = 0;

        // Basic checks to ensure we have valid values for month and org_id; if not, break out of the loop
        month = (month ?? "").toString().trim();
        org_id = (org_id   ?? "").toString().trim();
        if(!month || !org_id) break;

        // If this row has been processed, skip
        var processed = res.data.values[i][num_cols-1];
        if(processed == "y") continue;

        // Get the Org name for this org (based on org_id)
        var org_name = (billing_usage_cols.org_name > 0)? res.data.values[i][billing_usage_cols["org_name"]] : account_map.getOrgName(org_id);

        // Get the Parent org for this org (based on org_id)
        var parent_org_id = account_map.getParentForOrg(org_id);

        // Get the AU model for this org (based on org_id)
        var au_model = account_map.getAUModel(org_id);

        // Get the org_created_at info
        var org_created_at = res.data.values[i][billing_usage_cols["org_created_at"]];

        // Get the org_owner info
        var org_owner_email = res.data.values[i][billing_usage_cols["org_owner_email"]];

        // Get the Customer name for this org (based on org_id)
        var customer_name = account_map.getCustomerAccountName(org_id);
        // Default to the org name if we don't have a match
        if(customer_name == "") customer_name = org_name;

        // Get the Enterprise Billing ID for the org
        var enterprise_org_id = account_map.getEnterpriseBillingOrgId(org_id);


        // Loop through and try to locate other entries from the same org
        for(j = 0; j < num_rows; j++)
        {
            var this_org_id = res.data.values[j][billing_usage_cols["org_id"]];

            // Process this row only if the org_id is the same
            if(this_org_id != org_id) continue;

            var raw_billing_data = 
            {
                "month": month,
                "org_id": this_org_id,
                "customer_name": customer_name,
                "org_name": org_name,
                "parent_org_id" : parent_org_id,
                "org_created_at": org_created_at,
                "org_owner_email": org_owner_email,
                "au_model": au_model,
                "enterprise_org_id": enterprise_org_id,
                "employee_id": res.data.values[j][billing_usage_cols["employee_id"]],
                "num_expenses": Number(res.data.values[j][billing_usage_cols["num_expenses"]]),
                "num_reports": Number(res.data.values[j][billing_usage_cols["num_reports"]]),
                "active_user": false,
                "normalized_active_user": false,
            };

            // Add the expenses and reports at org level
            org_num_expenses += raw_billing_data.num_expenses;
            org_num_reports += raw_billing_data.num_reports;

            // Determine if this is an active user or not
            if(au_model == "report_0")
            {
                if(raw_billing_data.num_reports > 0) raw_billing_data.active_user = true;
            }
            else if(au_model == "expense_1")
            {
                if((raw_billing_data.num_expenses >=1) || (raw_billing_data.num_reports > 0)) raw_billing_data.active_user = true;
            }
            else if(au_model == "expense_2")
            {
                if(raw_billing_data.num_expenses > 2) raw_billing_data.active_user = true;
            }
            else if(au_model == "expense_3")
            {
                if(raw_billing_data.num_expenses > 3) raw_billing_data.active_user = true;
            }

            if(raw_billing_data.active_user == true) org_num_active_users++;

            // Check if the user has submitted atleast one expense or report to be considered in the normalized active user count
            if((raw_billing_data.num_expenses >=1) || (raw_billing_data.num_reports > 0))
            {
                raw_billing_data.normalized_active_user = true;
                org_num_active_users_normalized ++;
            }

            // Mark this row as processed
            res.data.values[j][num_cols-1] = "y";

            // Add this row to the raw billing entry list
            billing.raw_billing_entries.raw_billing_entry_list.push(raw_billing_data);

            // Increment the raw billing entry counter
            billing.raw_billing_entries.num_raw_billing_entries++;

        }

        // At this point, we have also aggregated data at org level
        var billing_by_org = 
        {
            "month": month,
            "org_id": org_id,
            "customer_name": customer_name,
            "org_name": org_name,
            "parent_org_id": parent_org_id,
            "au_model": au_model,
            "enterprise_org_id": enterprise_org_id,
            "org_created_at": org_created_at,
            "org_owner_email": org_owner_email,
            "num_expenses": org_num_expenses,
            "num_reports": org_num_reports,
            "active_users": org_num_active_users,
            "normalized_active_users": org_num_active_users_normalized,

        };

        // Load this to billing_by_org_list
        billing.billing_by_org.billing_by_org_list.push(billing_by_org);

        // Increment the org billing entry count
        billing.billing_by_org.num_org_billing_entries++;


        if((i % 1000) == 0)
        {
            common.statusMessage(fn, "Processing billing entry: " , i , ", total entries: " , billing.raw_billing_entries.num_raw_billing_entries);
        }
    }


    // Let's also aggregate by parent org / account
    var num_org_billing_entries = billing.billing_by_org.num_org_billing_entries;

    for(i = 0; i < num_org_billing_entries; i++)
    {
        const month = billing.billing_by_org.billing_by_org_list[i].month;
        const org_id = billing.billing_by_org.billing_by_org_list[i].org_id;
        const customer_name = billing.billing_by_org.billing_by_org_list[i].customer_name;
        const parent_org_id = billing.billing_by_org.billing_by_org_list[i].parent_org_id;
        const au_model = billing.billing_by_org.billing_by_org_list[i].au_model;

        var account_num_expenses = 0;
        var account_num_reports = 0;
        var account_num_active_users = 0;
        var account_num_normalized_active_users = 0;

        var this_processed = false;

        // Check if this has been processed yet
        for(j = 0; j < billing.billing_by_account.num_account_billing_entries; j++)
        {
            if(parent_org_id == billing.billing_by_account.billing_by_account_list[j].parent_org_id)
            {
                // We have already processed this entry
                this_processed = true;
                break;
            }
        }

        // If we've processed this, skip this
        if(this_processed == true) continue;

        // Loop through adding all lines that correspond to this parent ID
        for(j = i; j < num_org_billing_entries; j++)
        {
            var this_parent_org_id = billing.billing_by_org.billing_by_org_list[j].parent_org_id;

            // Process this item only if the parent ID is the same
            if(parent_org_id != this_parent_org_id) continue;

            // Add the expenses and reports at account level
            account_num_expenses += Number(billing.billing_by_org.billing_by_org_list[j].num_expenses);
            account_num_reports += Number(billing.billing_by_org.billing_by_org_list[j].num_reports);
            account_num_active_users += Number(billing.billing_by_org.billing_by_org_list[j].active_users);
            account_num_normalized_active_users += Number(billing.billing_by_org.billing_by_org_list[j].normalized_active_users);
        }

        // At this point, we have also aggregated data at account level
        var billing_by_account = 
        {
            "month": month,
            "org_id": parent_org_id,
            "customer_name": customer_name,
            "parent_org_id": parent_org_id,
            "au_model": au_model,
            "enterprise_org_id": enterprise_org_id,
            "num_expenses": account_num_expenses,
            "num_reports": account_num_reports,
            "active_users": account_num_active_users,
            "normalized_active_users": account_num_normalized_active_users,
        };

        // Load this to billing_by_account_list
        billing.billing_by_account.billing_by_account_list.push(billing_by_account);

        // Increment the account billing entry count
        billing.billing_by_account.num_account_billing_entries++;

    }


    common.statusMessage(fn, "Processed " , billing.raw_billing_entries.num_raw_billing_entries , " raw billing entries from usage file");
    common.statusMessage(fn, "Processed " , billing.billing_by_org.num_org_billing_entries , " org billing entries from usage file");
    common.statusMessage(fn, "Processed " , billing.billing_by_account.num_account_billing_entries , " account billing entries from usage file");

    return 0;

}



/* 
Function: getBillingDetailsForOrg
Purpose: Gets the billing details (num_expenses, num_reports, active_users) for the org passed in. getBillngData () to be invoked prior
Inputs: Billing instance
Output: Billing details for org (0 for the values if not found)
*/
function _getBillingDetailsForOrg(billing, org_id)
{
    // Get the function name for logging purposes
    const fn = _getBillingDetailsForOrg.name;
    
    // Initialize the billing details to be returned
    var i = 0;
    var billing_details = {"num_expenses": 0, "num_reports": 0, "active_users": 0}

    // Sanity checks to ensure we have valid org_id and billing data structure
    if(org_id.toString().trim() == "")
    {
        common.statusMessage(fn, "Blank / invalid org id");
        return billing_details;
    }

    if(!billing || !billing.billing_by_org || !billing.billing_by_org.billing_by_org_list || !billing.billing_by_org.num_org_billing_entries)
    {
        common.statusMessage(fn, "Invalid billing structure");
        return billing_details;
    }

    // For this to run, we should have invoked getBillingData() for a specific period
    if(billing.billing_by_org.num_org_billing_entries <= 0)
    {
        common.statusMessage(fn, "No billing data, check if getBillingData() has been run prior to this");
        return billing_details;
    }

    // Loop through the billing array and locate the org passed in
    for(i = 0; i < billing.billing_by_org.num_org_billing_entries; i++)
    {
        var this_org_id = billing.billing_by_org.billing_by_org_list[i].org_id;
        if(this_org_id == org_id)
        {
            billing_details.num_expenses = billing.billing_by_org.billing_by_org_list[i].num_expenses;
            billing_details.num_reports = billing.billing_by_org.billing_by_org_list[i].num_reports;
            billing_details.active_users = billing.billing_by_org.billing_by_org_list[i].active_users;
            break;
        }
    }

    return billing_details;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// EXPORTS /////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Export the billing_data class
module.exports = 
{ 
    billing_data,
};