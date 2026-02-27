const { google } = require('googleapis');
const { createGoogleAuth } = require("./google_auth");
const { statusMessage } = require("./logs");
const { GoogleDrive_getFolder } = require("./google_drive_core_fns");
const { GoogleDrive_createFile } = require("./google_drive_core_fns"); 


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
Function: GoogleSheet_createGoogleSpreadsheet
Purpose: Creates a new spreadsheet in the given folder with the provided file name
Inputs: folder_id, file name
Output: spreadsheet handle on success, null otherwise
*/
async function GoogleSheet_createGoogleSpreadsheet(folder_id, file_name)
{
    // Get the function name for logging purposes
    const fn = GoogleSheet_createGoogleSpreadsheet.name;
    
    // Get authentication and drive / sheets instance
    const auth = createGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    // Get a handle on the destination folder
    const dest_res = await GoogleDrive_getFolder(drive, folder_id);
    if (!dest_res)
    {
        statusMessage(fn, "Failed to get destination folder with ID: " , folder_id);
        return null;
    }

    const file_res = await GoogleDrive_createFile(drive, file_name, folder_id, "application/vnd.google-apps.spreadsheet");
    if(!file_res)
    {
        statusMessage(fn, "Failed to create spreadsheet: " , file_name , " in folder with ID: " , folder_id);
        return null;
    }

    const spreadsheet_id = file_res.data.id;
    statusMessage(fn, "Successfully created spreadsheet: " , file_name , " with ID: " , spreadsheet_id , " in folder with ID: " , folder_id);    
    return spreadsheet_id;

}


/*
Function: GoogleSheet_getNumberOfSheetsInGoogleSpreadsheet
Purpose: Returns the number of sheets in the given Google Spreadsheet
Inputs: sheets - Google Sheets API instance, spreadsheet_id - ID of the spreadsheet
Output: Number of sheets on success, -1 otherwise
*/
async function GoogleSheet_getNumberOfSheetsInGoogleSpreadsheet(sheets, spreadsheet_id)
{
    // Get the function name for logging purposes
    const fn = GoogleSheet_getNumberOfSheetsInGoogleSpreadsheet.name;
    
    try
    {
        const res = await sheets.spreadsheets.get
        ({
            spreadsheetId: spreadsheet_id,
            fields: "sheets.properties",
        });
        return res.data.sheets.length;
    }
    catch(e)
    {
        statusMessage(fn, "Failed to get number of sheets for spreadsheet with ID: " , spreadsheet_id , ". Error: " , e.message);
        return -1;
    }
}


/*
Function: GoogleSheet_findSheetByNameInGoogleSpreadsheet
Purpose: Finds a sheet by its name in the given Google Spreadsheet
Inputs: sheets - Google Sheets API instance, spreadsheet_id - ID of the spreadsheet, sheet_name - name of the sheet to find
Output: Sheet object on success, null otherwise
*/
async function GoogleSheet_findSheetByNameInGoogleSpreadsheet(sheets, spreadsheet_id, sheet_name)
{
    // Get the function name for logging purposes
    const fn = GoogleSheet_findSheetByNameInGoogleSpreadsheet.name;

    var i = 0;
    try
    {    
        const res = await sheets.spreadsheets.get
        ({
            spreadsheetId: spreadsheet_id,
            fields: "sheets.properties",
        });
        
        for (i = 0; i < res.data.sheets.length; i++)
        {
            const sheet = res.data.sheets[i];
            if (sheet.properties.title === sheet_name)
            {
                return sheet; // contains sheetId, title, properties
            }
        }
    }
    catch(e)
    {
        statusMessage(fn, "Failed to get sheets for spreadsheet with ID: " , spreadsheet_id , ". Error: " , e.message);
        return null;
     }
}

/*
Function: GoogleSheet_deleteSheetInGoogleSpreadsheet
Purpose: Deletes a sheet in the denoted spreadsheet
Inputs: sheets - Google Sheets API instance, spreadsheet_id - ID of the spreadsheet, sheet_id - ID of the sheet to delete
Output: 0 on success, -1 otherwise
*/
async function GoogleSheet_deleteSheetInGoogleSpreadsheet(sheets, spreadsheet_id, sheet_id)
{
    // Get the function name for logging purposes
    const fn = GoogleSheet_deleteSheetInGoogleSpreadsheet.name;
    
    var i = 0;
    try
    {
        const res = await sheets.spreadsheets.batchUpdate
        ({
            spreadsheetId: spreadsheet_id,
            requestBody: 
            {
                requests: 
                [
                    {
                        deleteSheet:
                        {
                            sheetId: sheet_id
                        }
                    }
                ]
            }
        });

        // deleteSheet does not return any response body, so if we got here without an exception, we can assume that the sheet was deleted successfully
        return 0;
    }
    catch(e)
    {
        statusMessage(fn, "Failed to delete sheet with ID: " , sheet_id , " in spreadsheet with ID: " , spreadsheet_id , ". Error: " , e.message);
        return -1;
     }
}


/*
Function: GoogleSheet_renameSheetInGoogleSpreadsheet
Purpose: Renames a sheet in the denoted spreadsheet
Inputs: sheets - Google Sheets API instance, spreadsheet_id - ID of the spreadsheet, sheet_id - ID of the sheet to rename, new_sheet_name - new name for the sheet
Output: 0 on success, -1 otherwise
*/
async function GoogleSheet_renameSheetInGoogleSpreadsheet(sheets, spreadsheet_id, sheet_id, new_sheet_name)
{
    // Get the function name for logging purposes
    const fn = GoogleSheet_renameSheetInGoogleSpreadsheet.name;
    
    var i = 0;
    try
    {
        const res = await sheets.spreadsheets.batchUpdate
        ({
            spreadsheetId: spreadsheet_id,
            requestBody: 
            {
                requests: 
                [{ 
                    updateSheetProperties: 
                    {
                        properties: 
                        {
                            sheetId: sheet_id,
                            title: new_sheet_name
                        }, 
                        fields: "title" 
                    } 
                }]
            }
        });

        // We dont get any valid response body from the API, so we will just check if we got here without an exception and assume that the sheet was renamed successfully.
        return 0;
    }
    catch(e)
    {
        statusMessage(fn, "Failed to rename sheet with ID: " , sheet_id , " in spreadsheet with ID: " , spreadsheet_id , ". Error: " , e.message);
        return -1;
     }
}



/*
Function: GoogleSheet_createSheetInGoogleSpreadsheet
Purpose: Creates a new sheet in the denoted spreadsheet
Inputs: sheets - Google Sheets API instance, spreadsheet_id - ID of the spreadsheet, sheet_name - name of the sheet to create
Output: sheet_id on success, -1 otherwise
*/
async function GoogleSheet_createSheetInGoogleSpreadsheet(sheets, spreadsheet_id, sheet_name)
{
    // Get the function name for logging purposes
    const fn = GoogleSheet_createSheetInGoogleSpreadsheet.name;

    var i = 0;
    try
    {
        const res = await sheets.spreadsheets.batchUpdate
        ({
            spreadsheetId: spreadsheet_id,
            requestBody: 
            {
                requests: 
                [{
                    addSheet:
                    {
                        properties:
                        {
                            title: sheet_name
                        }
                    },                    
                }]
            },
            fields: "*"
        });

        const resp = res.data.replies[0];
        if(!resp || !resp.addSheet || !resp.addSheet.properties || !resp.addSheet.properties.title || resp.addSheet.properties.title != sheet_name)
        {
            statusMessage(fn, "Failed to create sheet with name: " , sheet_name , " in spreadsheet with ID: " , spreadsheet_id , ". Unexpected response: " , JSON.stringify(res.data));
            return -1;
        }

        const sheet_id = res.data.replies[0].addSheet.properties.sheetId;
        statusMessage(fn, "Successfully created sheet with name: " , sheet_name , " and ID: " , sheet_id , " in spreadsheet with ID: " , spreadsheet_id);
        return sheet_id;
    }
    catch(e)
    {
        statusMessage(fn, "Failed to create sheet with name: " , sheet_name , " in spreadsheet with ID: " , spreadsheet_id , ". Error: " , e.message);
        return -1;
     }
}


/*
Function: GoogleSheet_writeValuesToGoogleSheet
Purpose: Writes the values passed in to the output_sheet in the denoted spreadsheet starting at the given coordinates
Inputs: Google Sheets API instance, spreadsheet ID, sheet name, coordinates, values
Output: 0 on success, -1 otherwise
*/
async function GoogleSheet_writeValuesToGoogleSheet(sheets, spreadsheet_id, sheet_name, coordinates, values)
{
    // Get the function name for logging purposes
    const fn = GoogleSheet_writeValuesToGoogleSheet.name;
    
    try
    {
        await sheets.spreadsheets.values.update
        ({
            spreadsheetId: spreadsheet_id,
            range: `${sheet_name}!${coordinates}`,
            valueInputOption: "USER_ENTERED",
            requestBody: 
            {
                values: values
            }
        });
    }
    catch(e)
    {
        statusMessage(fn, "Failed to write values to sheet with name: " , sheet_name , " in spreadsheet with ID: " , spreadsheet_id , ". Error: " , e.message);
        return -1;
    }

    return 0;
}


/*
Function: GoogleSheet_freezeNRowsInGoogleSheet
Purpose: Freezes the top N rows in the denoted sheet
Inputs: sheets - Google Sheets API instance, spreadsheet ID, sheet ID, number of rows to freeze
Output: 0 on success, -1 otherwise
*/
async function GoogleSheet_freezeNRowsInGoogleSheet(sheets, spreadsheet_id, sheet_id, num_rows_to_freeze)
{
    // Get the function name for logging purposes
    const fn = GoogleSheet_freezeNRowsInGoogleSheet.name;
    
    try
    {
        const res = await sheets.spreadsheets.batchUpdate
        ({
            spreadsheetId: spreadsheet_id,
            requestBody:
            {
                requests:
                [{
                    updateSheetProperties: 
                    {
                        properties:
                        {
                            sheetId: sheet_id,
                            gridProperties:
                            {
                                frozenRowCount: num_rows_to_freeze
                            }
                        },
                        fields: "gridProperties.frozenRowCount"
                    }
                }]
            }
        });

        // We dont get any valid response body from the API, so we will just check if we got here without an exception and assume that the rows were frozen successfully.        
    }
    catch(e)
    {
        statusMessage(fn, "Failed to freeze top " , num_rows_to_freeze , " rows in sheet with ID: " , sheet_id , " in spreadsheet with ID: " , spreadsheet_id , ". Error: " , e.message);
        return -1;
     }

     return 0;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// EXPORTS /////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports =
{
    GoogleSheet_createGoogleSpreadsheet,
    GoogleSheet_getNumberOfSheetsInGoogleSpreadsheet,
    GoogleSheet_findSheetByNameInGoogleSpreadsheet,
    GoogleSheet_deleteSheetInGoogleSpreadsheet,
    GoogleSheet_renameSheetInGoogleSpreadsheet,
    GoogleSheet_createSheetInGoogleSpreadsheet,
    GoogleSheet_writeValuesToGoogleSheet,
    GoogleSheet_freezeNRowsInGoogleSheet,
};