const { google } = require('googleapis');
const common = require("@fyle-ops/common");

/* 
Function: initializeAccountMapCols
Purpose: Initializes the columns in the Account Mapping sheet that we are interested in
Inputs: Account Mapping instance
Output: 0 if successful, -1 if any required column is not found
*/
function initializeAccountMapCols(account_map)
{
    const fn = initializeAccountMapCols.name;

    // Initialize variables
    var i = 0, j = 0;

    // Columns in the Account Mapping sheet that we are interested in
    const account_map_lookup_cols = 
    [
        {sheet_key: "Org ID", map_key: "org_id"},
        {sheet_key: "Customer", map_key: "customer"},
        {sheet_key: "Entity", map_key: "org"},
        {sheet_key: "Primary Org (Parent) / Secondary Org (Child)", map_key: "hierarchy"},
        {sheet_key: "Parent Entity ID", map_key: "parent_org_id"},
        {sheet_key: "Country", map_key: "country"},
        {sheet_key: "Region", map_key: "region"},
        {sheet_key: "Currency", map_key: "currency"},
        {sheet_key: "ou_org_id", map_key: "ou_org_id"},
        {sheet_key: "active_user_definition", map_key: "au_model"},
        {sheet_key: "enterprise_billing_org_id", map_key: "enterprise_billing_org_id"}
    ];

    // Locate the columns that we are interested in
    for(i = 0; i < account_map.num_cols; i++)
    {
        for(j = 0; j < account_map_lookup_cols.length; j++)
        {
            if(account_map.data[0][i].toString().trim().toLowerCase() == account_map_lookup_cols[j].sheet_key.toString().trim().toLowerCase())
            {
                account_map.cols[account_map_lookup_cols[j].map_key] = i;
                break;
            }
        }
    }

    // Check if we were able to locate all required columns
    for(let key in account_map.cols)
    {
        if(account_map.cols[key] == -1)
        {
            common.statusMessage(fn, "Failed to locate column for key: " + key);
            return -1;
        }
    }

    return 0;

}



/* 
Function: getOrgOffset
Purpose: Gets the offset in the Account Mapping Sheet for the org_id passed in. getAccountMappingData() needs to be called prior
Inputs: Account Mapping instance, Org ID
Output: Offset (number). -1 returned if not found
*/
function getOrgOffset(account_map, org_id)
{
    const fn = getOrgOffset.name;
    var ret = -1;

    // Sanity check

    if(account_map.num_maps == 0)
    {
        common.statusMessage(fn, "No Account Map entries, possibly getAccountMappingData() needs to be invoked");
        return ret;
    }

    // Loop through the account mapping list and find the offset for the org_id passed in
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




/* 
Function: getFieldValueFromAccountMap
Purpose: Retrieves the field value for the org_id passed in. getAccountMappingData() needs to be called prior
Inputs: Account Mapping instance, Org ID, field name for which the value needs to be retrieved
Output: Field value (string), "" is returned as the default if a match is not found
*/
function getFieldValueFromAccountMap(account_map, org_id, field_name)
{
    const fn = getFieldValueFromAccountMap.name;
    var ret = "";

    // Sanity check
    if(account_map.num_maps == 0)
    {
        common.statusMessage(fn, "No Account Map entries, possibly getAccountMappingData() needs to be invoked");
        return ret;
    }

    // Loop through the account mapping list and find the field value for the org_id passed in
    for(var i = 0; i < account_map.num_maps; i++)
    {
        if(account_map.map_list[i].org_id == org_id)
        {
            ret = account_map.map_list[i][`${field_name}`];
            break;
        }
    }

    return ret;
}



/* 
Function: updateAccountMap
Purpose: Updates the account_map.map_list [] and account_map.data [] with the new values for the accounts to be edited. 
This is a helper function for _editExistingAccounts and _changeAccountNames
Inputs: Array of following structures
[{
  org_id,
  key_to_update (for example, customer for account names change),
},]
Output: 0 on success, -1 on failure
*/
function updateAccountMap(account_map, account_data, key_to_update)
{
    const fn = updateAccountMap.name;

    // Initialize variables
    var i = 0; 

    // Number of accounts that we will be editing in the account mapping sheet
    var num_accounts_to_edit = 0;

    // Sanity check
    if(account_map.num_maps == 0)
    {
        common.statusMessage(fn, "No Account Map entries, possibly getAccountMappingData() needs to be invoked");
        return 0;
    }

    // Loop through the accounts and change the account names in account_map.data [] and account_map.map_list []
    for(i = 0; i < account_data.length; i++)
    {
        var org_id = account_data[i].org_id;
        // Sanity check
        if(org_id.toString().trim() == "")
        {
            common.statusMessage(fn, "Invalid org ID");
            continue;
        }

        var val_to_update = account_data[i][key_to_update];
        if(val_to_update.toString().trim() == "")
        {
            common.statusMessage(fn, "Invalid value for " + key_to_update);
            continue;
        }

        var offset = -1;
        
        // Check if the org exists
        if((offset = account_map.getOrgOffset(org_id)) < 0)
        {
            common.statusMessage(fn, "Failed to locate org with ID: " + org_id + ", will not be changing account name");
            continue;
        }

        common.statusMessage(fn, "[" + (i+1) + "]. Updating value: " + val_to_update + " for org ID: " + org_id + " at row: " + (offset + 2));
        
        // Load the required field into the data []
        // Add 1 to the offset to factor in the header row
        account_map.data[offset+1][account_map.cols[key_to_update]] = val_to_update;

        // Update this in account_map.map_list
        account_map.map_list[offset][key_to_update] = val_to_update;

        // Increment the number of accounts to be edited
        num_accounts_to_edit++;
    }

    return num_accounts_to_edit;
}



// Exporting the functions in this file to be used in other files
module.exports =
{
    initializeAccountMapCols,
    getOrgOffset,
    getFieldValueFromAccountMap,
    updateAccountMap
};