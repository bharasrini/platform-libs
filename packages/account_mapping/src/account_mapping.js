const common = require("@fyle-ops/common");
const { google } = require('googleapis');

class account_mapping
{
    constructor()
    {
      _initAccountMapping(this);
    }

    getAccountMappingData()
    {
        return _getAccountMappingData(this);
    }

        getCustomerAccountName(org_id)
    {
        return _getCustomerAccountName(this, org_id);
    }

    getOrgName(org_id)
    {
        return _getOrgName(this, org_id);
    }

    getHierarchyForOrg(org_id)
    {
        return _getHierarchyForOrg(this, org_id);
    }

    getParentForOrg(org_id)
    {
        return _getParentForOrg(this, org_id);
    }

    getOrgCountry(org_id)
    {
        return _getOrgCountry(this, org_id);
    }

    getOrgRegion(org_id)
    {
        return _getOrgRegion(this, org_id);
    }

    getOrgCurrency(org_id)
    {
        return _getOrgCurrency(this, org_id);
    }

    getAUModel(org_id)
    {
        return _getAUModel(this, org_id);
    }

    getEnterpriseBillingOrgId(org_id)
    {
        return _getEnterpriseBillingOrgId(this, org_id);
    }

    getOrgOffset(org_id)
    {
        return _getOrgOffset(this, org_id);
    }
}


/* 
Function: _initAccountMapping
Purpose: Initializes the account mapping functionality
Inputs: account mapping instance
Output: 0 on success, -1 on failure
*/
function _initAccountMapping(account_mapping)
{
    // Initialize array to store the account mapping information
    account_mapping.map_list = [];

    // Initialize number of account rows
    account_mapping.num_maps = 0;

    // Initialize columns
    account_mapping.cols = {
        "org_id": -1,
        "customer": -1,
        "org": -1,
        "hierarchy": -1,
        "parent_org_id": -1,
        "country": -1,
        "region": -1,
        "currency": -1,
        "ou_org_id": -1,
        "au_model": -1,
        "enterprise_billing_org_id": -1,
    };

    // Save file and sheet data
    account_mapping.file = null;
    account_mapping.sheet = null;
    account_mapping.range = null;
    account_mapping.data = [[]];

    // Nothing else to do, return success
    return 0;
}



/* 
Function: _getAccountMappingData
Purpose: Gets the Account Mapping information from file
Inputs: Account Mapping instance
Output: Account Mapping entries in account_map.map_list[]. Returns 0 on success, -1 on failure
*/
async function _getAccountMappingData(account_map)
{
    var i = 0; j = 0;

    // Check - if the function has already been invoked, just return success
    if(account_map.num_maps > 0)
    {
        common.statusMessage(arguments.callee.name, "Already invoked, we have " + account_map.num_maps + " entries in the account map, returning success from here");
        return 0;
    }

    const auth = common.createSheetsAuth();
    const sheets = google.sheets({ version: "v4", auth });

    // Account Mapping sheet located at: My Drive -> Tooling -> Account Mapping Sheet
    // URL: https://docs.google.com/spreadsheets/d/18LzUzM0qVzQ6vQ8wz05ihmGBE0J704w5eWG5m8I8cI8/edit?usp=sharing
    //const sheet_id = "18LzUzM0qVzQ6vQ8wz05ihmGBE0J704w5eWG5m8I8cI8"; 
    const sheet_id = process.env.ACCOUNT_MAPPING_SHEET_ID;

    // Sheet in Account Mapping file that has the account mapping information
    //const sheet_name = "Account Mapping";
    const sheet_name = process.env.ACCOUNT_MAPPING_SHEET_NAME;

    // Get all values from the sheet
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: sheet_id,
        range: `${sheet_name}`,
    });

    // Initialize variables to read the account mapping sheet
    const start_row = 1;
    const start_col = 1;    
    const {lastRow: num_rows, lastColumn: num_cols} = common.getLastRowAndCol(res.data);

    // Locate the columns that we are interested in
    for(i = 0; i < num_cols; i++)
    {
        if((res.data.values[0][i]).toString().trim().toLowerCase() == ("Org ID").toString().trim().toLowerCase()) account_map.cols["org_id"] = i;
        else if((res.data.values[0][i]).toString().trim().toLowerCase() == ("Customer").toString().trim().toLowerCase()) account_map.cols["customer"] = i;
        else if((res.data.values[0][i]).toString().trim().toLowerCase() == ("Entity").toString().trim().toLowerCase()) account_map.cols["org"] = i;
        else if((res.data.values[0][i]).toString().trim().toLowerCase() == ("Primary Org (Parent) / Secondary Org (Child)").toString().trim().toLowerCase()) account_map.cols["hierarchy"] = i;
        else if((res.data.values[0][i]).toString().trim().toLowerCase() == ("Parent Entity ID").toString().trim().toLowerCase()) account_map.cols["parent_org_id"] = i;
        else if((res.data.values[0][i]).toString().trim().toLowerCase() == ("Country").toString().trim().toLowerCase()) account_map.cols["country"] = i;
        else if((res.data.values[0][i]).toString().trim().toLowerCase() == ("Region").toString().trim().toLowerCase()) account_map.cols["region"] = i;
        else if((res.data.values[0][i]).toString().trim().toLowerCase() == ("Currency").toString().trim().toLowerCase()) account_map.cols["currency"] = i;
        else if((res.data.values[0][i]).toString().trim().toLowerCase() == ("ou_org_id").toString().trim().toLowerCase()) account_map.cols["ou_org_id"] = i;
        else if((res.data.values[0][i]).toString().trim().toLowerCase() == ("active_user_definition").toString().trim().toLowerCase()) account_map.cols["au_model"] = i;
        else if((res.data.values[0][i]).toString().trim().toLowerCase() == ("enterprise_billing_org_id").toString().trim().toLowerCase()) account_map.cols["enterprise_billing_org_id"] = i;
    }

    for(key in account_map.cols)
    {
        if(account_map.cols[key] == -1)
        {
            common.statusMessage(arguments.callee.name, "Failed to locate column for key: " + account_map.cols[key]);
            return -1;
        }
    }


    // If we are here, then we have been able to get required columns. Read through the account mapping file
    for(i = start_row; i < num_rows; i++)
    {
        var account_mapping_info = 
        {
            "org_id": res.data.values[i][account_map.cols["org_id"]],
            "customer": res.data.values[i][account_map.cols["customer"]],
            "org": res.data.values[i][account_map.cols["org"]],
            "hierarchy": res.data.values[i][account_map.cols["hierarchy"]],
            "parent_org_id": res.data.values[i][account_map.cols["parent_org_id"]] != "" ? res.data.values[i][account_map.cols["parent_org_id"]] : res.data.values[i][account_map.cols["org_id"]],
            "country": res.data.values[i][account_map.cols["country"]],
            "region": res.data.values[i][account_map.cols["region"]],
            "currency": res.data.values[i][account_map.cols["currency"]],
            "ou_org_id": res.data.values[i][account_map.cols["ou_org_id"]],
            "au_model": res.data.values[i][account_map.cols["au_model"]],
            "enterprise_billing_org_id": res.data.values[i][account_map.cols["enterprise_billing_org_id"]],
        };

        // Add this to the account map list
        account_map.map_list.push(account_mapping_info);

        // Increment the number of account maps
        account_map.num_maps++;

    }

    common.statusMessage(arguments.callee.name, "Processed " + account_map.num_maps + " account mapping entries from file");

    return 0;

}



/* 
Function: _getCustomerAccountName
Purpose: Retrieves the Customer / Account name for the org_id passed in. getAccountMappingData() needs to be called prior
Inputs: Account Mapping instance, Org ID
Output: Customer Account (string), "" is returned as the default if a match is not found
*/
function _getCustomerAccountName(account_map, org_id)
{
    var ret = "";

    // Sanity check
    if(account_map.num_maps == 0)
    {
        common.statusMessage(arguments.callee.name, "No Account Map entries, possibly getAccountMappingData() needs to be invoked");
        return ret;
    }

    for(var i = 0; i < account_map.num_maps; i++)
    {
        if(account_map.map_list[i].org_id == org_id)
        {
            ret = account_map.map_list[i].customer;
            break;
        }
    }

    return ret;
}



/* 
Function: _getOrgName
Purpose: Retrieves the Org name for the org_id passed in. getAccountMappingData() needs to be called prior
Inputs: Account Mapping instance, Org ID
Output: Org Name (string), "" is returned as the default if a match is not found
*/
function _getOrgName(account_map, org_id)
{
    var ret = "";

    // Sanity check
    if(account_map.num_maps == 0)
    {
        common.statusMessage(arguments.callee.name, "No Account Map entries, possibly getAccountMappingData() needs to be invoked");
        return ret;
    }

    for(var i = 0; i < account_map.num_maps; i++)
    {
        if(account_map.map_list[i].org_id == org_id)
        {
            ret = account_map.map_list[i].org;
            break;
        }
    }

    return ret;
}



/* 
Function: _getHierarchyForOrg
Purpose: Retrieves the hierarchy for the org_id passed in. getAccountMappingData() needs to be called prior
Inputs: Account Mapping instance, Org ID
Output: Hierarchy is returned as the default if a match is not found
*/
function _getHierarchyForOrg(account_map, org_id)
{
    var ret = "Primary";

    // Sanity check
    if(account_map.num_maps == 0)
    {
        common.statusMessage(arguments.callee.name, "No Account Map entries, possibly getAccountMappingData() needs to be invoked");
        return ret;
    }

    for(var i = 0; i < account_map.num_maps; i++)
    {
        if(account_map.map_list[i].org_id == org_id)
        {
            ret = account_map.map_list[i].hierarchy;
            break;
        }
    }

    return ret;
}



/* 
Function: _getParentForOrg
Purpose: Retrieves the Parent Org ID for the org_id passed in. getAccountMappingData() needs to be called prior
Inputs: Account Mapping instance, Org ID
Output: Parent Org ID (string), org_id (same ID) is returned as the default if a match is not found
*/
function _getParentForOrg(account_map, org_id)
{
    var ret = org_id;

    // Sanity check
    if(account_map.num_maps == 0)
    {
        common.statusMessage(arguments.callee.name, "No Account Map entries, possibly getAccountMappingData() needs to be invoked");
        return ret;
    }

    for(var i = 0; i < account_map.num_maps; i++)
    {
        if(account_map.map_list[i].org_id == org_id)
        {
            ret = account_map.map_list[i].parent_org_id;
            break;
        }
    }

    return ret;
}



/* 
Function: _getOrgCountry
Purpose: Retrieves the Country for the org_id passed in. getAccountMappingData() needs to be called prior
Inputs: Account Mapping instance, Org ID
Output: Country Name (string), "" is returned as the default if a match is not found
*/
function _getOrgCountry(account_map, org_id)
{
    var ret = "";

    // Sanity check
    if(account_map.num_maps == 0)
    {
        common.statusMessage(arguments.callee.name, "No Account Map entries, possibly getAccountMappingData() needs to be invoked");
        return ret;
    }

    for(var i = 0; i < account_map.num_maps; i++)
    {
        if(account_map.map_list[i].org_id == org_id)
        {
            ret = account_map.map_list[i].country;
            break;
        }
    }

    return ret;
}



/* 
Function: _getOrgRegion
Purpose: Retrieves the Region for the org_id passed in. getAccountMappingData() needs to be called prior
Inputs: Account Mapping instance, Org ID
Output: Region Name (string), "" is returned as the default if a match is not found
*/
function _getOrgRegion(account_map, org_id)
{
    var ret = "";

    // Sanity check
    if(account_map.num_maps == 0)
    {
        common.statusMessage(arguments.callee.name, "No Account Map entries, possibly getAccountMappingData() needs to be invoked");
        return ret;
    }

    for(var i = 0; i < account_map.num_maps; i++)
    {
        if(account_map.map_list[i].org_id == org_id)
        {
            ret = account_map.map_list[i].region;
            break;
        }
    }

    return ret;
}



/* 
Function: _getOrgCurrency
Purpose: Retrieves the Currency for the org_id passed in. getAccountMappingData() needs to be called prior
Inputs: Account Mapping instance, Org ID
Output: Currency (string), "" is returned as the default if a match is not found
*/
function _getOrgCurrency(account_map, org_id)
{
    var ret = "";

    // Sanity check
    if(account_map.num_maps == 0)
    {
        common.statusMessage(arguments.callee.name, "No Account Map entries, possibly getAccountMappingData() needs to be invoked");
        return ret;
    }

    for(var i = 0; i < account_map.num_maps; i++)
    {
        if(account_map.map_list[i].org_id == org_id)
        {
            ret = account_map.map_list[i].currency;
            break;
        }
    }

    return ret;
}


/* 
Function: _getAUModel
Purpose: Retrieves the Active user model for the org_id passed in. getAccountMappingData() needs to be called prior
Inputs: Account Mapping instance, Org ID
Output: AU Model (string), "report_0" is the default if nothing found
*/
function _getAUModel(account_map, org_id)
{
    var ret = "expense_1";

    // Sanity check
    if(account_map.num_maps == 0)
    {
        common.statusMessage(arguments.callee.name, "No Account Map entries, possibly getAccountMappingData() needs to be invoked");
        return ret;
    }

    for(var i = 0; i < account_map.num_maps; i++)
    {
        if(account_map.map_list[i].org_id == org_id)
        {
            ret = account_map.map_list[i].au_model;
            break;
        }
    }

    return ret;
}



/* 
Function: _getEnterpriseBillingOrgId
Purpose: Retrieves the Enterprise Billing Org ID for the org_id passed in. getAccountMappingData() needs to be called prior
Inputs: Account Mapping instance, Org ID
Output: Enterprise Billing Org ID (string), org_id is the default if nothing found
*/
function _getEnterpriseBillingOrgId(account_map, org_id)
{
    var ret = org_id;

    // Sanity check
    if(account_map.num_maps == 0)
    {
        common.statusMessage(arguments.callee.name, "No Account Map entries, possibly getAccountMappingData() needs to be invoked");
        return ret;
    }

    for(var i = 0; i < account_map.num_maps; i++)
    {
        if(account_map.map_list[i].org_id == org_id)
        {
            ret = account_map.map_list[i].enterprise_billing_org_id;
            break;
        }
    }

    return ret;
}


/* 
Function: _getOrgOffset
Purpose: Gets the offset in the Account Mapping Sheet for the org_id passed in. getAccountMappingData() needs to be called prior
Inputs: Account Mapping instance, Org ID
Output: Offset (number). -1 returned if not found
*/
function _getOrgOffset(account_map, org_id)
{
    var ret = -1;

    // Sanity check
    if(account_map.num_maps == 0)
    {
        common.statusMessage(arguments.callee.name, "No Account Map entries, possibly getAccountMappingData() needs to be invoked");
        return ret;
    }

    for(var i = 0; i < account_map.num_maps; i++)
    {
        if(account_map.map_list[i].org_id == org_id)
        {
            ret = i;
            break;
        }
    }

    return ret;
}



module.exports = { 
    account_mapping
};
