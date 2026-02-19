const { google } = require('googleapis');
const common = require("@fyle-ops/common");



/* 
Function: readAccountMapDataFromFile
Purpose: Reads accounts information from the Account Mapping sheet
Inputs: Account Mapping instance
Output: 0 on success, -1 on failure
*/
async function readAccountMapDataFromFile(account_map)
{
    // Read the Account Mapping sheet
    try
    {        
        // Authenticate with Google Sheets API
        const auth = common.createGoogleAuth();
        const sheets = google.sheets({ version: "v4", auth });

        // Account Mapping sheet located at: My Drive -> Tooling -> Account Mapping Sheet
        // URL: https://docs.google.com/spreadsheets/d/18LzUzM0qVzQ6vQ8wz05ihmGBE0J704w5eWG5m8I8cI8/edit?usp=sharing
        //const sheet_id = "18LzUzM0qVzQ6vQ8wz05ihmGBE0J704w5eWG5m8I8cI8"; 
        const sheet_id = process.env.ACCOUNT_MAPPING_SHEET_ID;

        // Sheet in Account Mapping file that has the account mapping information
        //const sheet_name = "Account Mapping";
        const sheet_name = process.env.ACCOUNT_MAPPING_SHEET_NAME;

        // Get all values from the sheet
        const res = await sheets.spreadsheets.values.get
        ({
            spreadsheetId: sheet_id,
            range: `${sheet_name}`,
        });

        // Store the data read from the sheet in account_map.data
        account_map.data = res.data.values;
    }
    catch (e)
    {
        common.statusMessage(arguments.callee.name, "Error getting account mapping data: " + e.message);
        return -1;
    }

    return 0;
}


/* 
Function: flushAccountMapDataToFile
Purpose: Flushes accounts information in account_map to the Account Mapping sheet
Inputs: Account Mapping instance
Output: 0 on success, -1 on failure
*/
async function flushAccountMapDataToFile(account_map)
{
    try
    {
        // Authenticate with Google Sheets API
        const auth = common.createGoogleAuth();
        const sheets = google.sheets({ version: "v4", auth });

        // Account Mapping sheet located at: My Drive -> Tooling -> Account Mapping Sheet
        // URL: https://docs.google.com/spreadsheets/d/18LzUzM0qVzQ6vQ8wz05ihmGBE0J704w5eWG5m8I8cI8/edit?usp=sharing
        //const sheet_id = "18LzUzM0qVzQ6vQ8wz05ihmGBE0J704w5eWG5m8I8cI8"; 
        const sheet_id = process.env.ACCOUNT_MAPPING_SHEET_ID;

        // Sheet in Account Mapping file that has the account mapping information
        //const sheet_name = "Account Mapping";
        const sheet_name = process.env.ACCOUNT_MAPPING_SHEET_NAME;

        await sheets.spreadsheets.values.update
        ({
            spreadsheetId: sheet_id,
            range: `${sheet_name}`,   // just give entire sheet
            valueInputOption: "USER_ENTERED",
            requestBody: 
            {
                values: account_map.data
            }
        });
    }
    catch(e)
    {
        common.statusMessage(arguments.callee.name, "Error flushing account map data to the account mapping sheet: " + e.message);
        return -1;
    }

    return 0;
}


// Exporting functions to be used in other files
module.exports = 
{
    readAccountMapDataFromFile,
    flushAccountMapDataToFile,
};