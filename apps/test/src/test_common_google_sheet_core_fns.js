const { formatInTimeZone } = require("date-fns-tz");
const path = require("path");
const { google } = require('googleapis');
const common = require("@fyle-ops/common");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_createGoogleSpreadsheet()
{    
    const file_name = "Test Create Spreadsheet";
    const folder_id = "1RQWnc1dSkRnUDxkO4Tm_tjBjyyL1qpr-";  // "Test Folder" under "Customer Success Shared Drive"

    var spreadsheet_id = await common.GoogleSheet_createGoogleSpreadsheet(folder_id, file_name);
    console.log("Spreadsheet created with ID: ", spreadsheet_id);
}

async function test_GoogleSheet_getNumberOfSheetsInGoogleSpreadsheet()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheet_id = "1F3Dwi0VPf7IQtKxLQgGwrrMLFnCdE9XoMAnrx8cyhGY"; // "Test Spreadsheet" in "Test Folder" under "Customer Success Shared Drive"
    var num_sheets = await common.GoogleSheet_getNumberOfSheetsInGoogleSpreadsheet(sheets, spreadsheet_id);
    console.log("Number of sheets in spreadsheet: ", num_sheets);
}

async function test_GoogleSheet_findSheetByNameInGoogleSpreadsheet()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheet_id = "1F3Dwi0VPf7IQtKxLQgGwrrMLFnCdE9XoMAnrx8cyhGY"; // "Test Spreadsheet" in "Test Folder" under "Customer Success Shared Drive"
    
    const sheet1_name = "README";
    const sheet1 = await common.GoogleSheet_findSheetByNameInGoogleSpreadsheet(sheets, spreadsheet_id, sheet1_name);
    if(sheet1) console.log("Found sheet with name: ", sheet1.properties.title);
    else console.log("Sheet with name " + sheet1_name + " not found in spreadsheet");

    const sheet2_name = "Non Existent Sheet";
    const sheet2 = await common.GoogleSheet_findSheetByNameInGoogleSpreadsheet(sheets, spreadsheet_id, sheet2_name);
    if(sheet2) console.log("Found sheet with name: ", sheet2.properties.title);
    else console.log("Sheet with name " + sheet2_name + " not found in spreadsheet");
}

async function test_GoogleSheet_deleteSheetInGoogleSpreadsheet()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheet_id = "1F3Dwi0VPf7IQtKxLQgGwrrMLFnCdE9XoMAnrx8cyhGY"; // "Test Spreadsheet" in "Test Folder" under "Customer Success Shared Drive"
    const sheet_name = "ToDelete";

    const del_res = await common.GoogleSheet_findSheetByNameInGoogleSpreadsheet(sheets, spreadsheet_id, sheet_name);
    if(del_res)
    {
        const  sheet_id = del_res.properties.sheetId;
        const del_status = await common.GoogleSheet_deleteSheetInGoogleSpreadsheet(sheets, spreadsheet_id, sheet_id);
        if(del_status >= 0) console.log("Sheet with name " + sheet_name + " deleted successfully");
        else console.log("Failed to delete sheet with name " + sheet_name);
    }
    else
    {
        console.log("Sheet with name " + sheet_name + " not found in spreadsheet, cannot delete");
    }
}

async function test_GoogleSheet_renameSheetInGoogleSpreadsheet()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheet_id = "1F3Dwi0VPf7IQtKxLQgGwrrMLFnCdE9XoMAnrx8cyhGY"; // "Test Spreadsheet" in "Test Folder" under "Customer Success Shared Drive"
    const old_sheet_name = "README";
    const new_sheet_name = "README_Renamed";

    const rename_res = await common.GoogleSheet_findSheetByNameInGoogleSpreadsheet(sheets, spreadsheet_id, old_sheet_name);
    if(rename_res)
    {
        const  sheet_id = rename_res.properties.sheetId;
        const rename_status = await common.GoogleSheet_renameSheetInGoogleSpreadsheet(sheets, spreadsheet_id, sheet_id, new_sheet_name);
        if(rename_status >= 0) console.log("Sheet with name " + old_sheet_name + " renamed to " + new_sheet_name + " successfully");
        else console.log("Failed to rename sheet with name " + old_sheet_name);
    }
    else
    {
        console.log("Sheet with name " + old_sheet_name + " not found in spreadsheet, cannot rename");
    }
}

async function test_GoogleSheet_createSheetInGoogleSpreadsheet()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheet_id = "1F3Dwi0VPf7IQtKxLQgGwrrMLFnCdE9XoMAnrx8cyhGY"; // "Test Spreadsheet" in "Test Folder" under "Customer Success Shared Drive"
    const sheet_name = "New Sheet";
    const created_sheet_id = await common.GoogleSheet_createSheetInGoogleSpreadsheet(sheets, spreadsheet_id, sheet_name);
    if(created_sheet_id >= 0) console.log("Sheet with name " + sheet_name + " & id: " + created_sheet_id + " created successfully in spreadsheet");
    else console.log("Failed to create sheet with name " + sheet_name + " in spreadsheet");
}

async function test_GoogleSheet_writeValuesToGoogleSheet()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheet_id = "1F3Dwi0VPf7IQtKxLQgGwrrMLFnCdE9XoMAnrx8cyhGY"; // "Test Spreadsheet" in "Test Folder" under "Customer Success Shared Drive"
    const data_array = 
    [
        {
            id: 101,
            name: "Bharadwaj",
            contact: 
            {
                email: "bharadwaj.srinivasan@fyle.in",
                phone: "99999"
            },
            tags: ["cs", "india"],
            addresses: 
            [
                { type: "home", city: "Bangalore", pin: 560001 },
                { type: "office", city: "ECity", pin: 560100 }
            ],
            active: true
        },
        {
            id: 102,
            name: "John Doe",
            contact: 
            {
                email: "john.doe@example.com",
                phone: null       // tests null handling
            },
            tags: ["cs", "usa"],
            addresses: [],
            active: false
        }
    ];
    const sheet_name = "New Sheet";
    const [headers, ...rows] = common.convertNestedDatato2DArray(data_array);
    const write_status = await common.GoogleSheet_writeValuesToGoogleSheet(sheets, spreadsheet_id, sheet_name, "A1", [headers, ...rows]);
    if(write_status >= 0) console.log("Data array written successfully to sheet with name " + sheet_name);
    else console.log("Failed to write data array to sheet with name " + sheet_name);
}

async function test_GoogleSheet_freezeNRowsInGoogleSheet()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheet_id = "1F3Dwi0VPf7IQtKxLQgGwrrMLFnCdE9XoMAnrx8cyhGY"; // "Test Spreadsheet" in "Test Folder" under "Customer Success Shared Drive"
    const sheet_name = "New Sheet";
    const rows_to_freeze = 2;
    const res = await common.GoogleSheet_findSheetByNameInGoogleSpreadsheet(sheets, spreadsheet_id, sheet_name);
    if(res)
    {
        const  sheet_id = res.properties.sheetId;
        const status = await common.GoogleSheet_freezeNRowsInGoogleSheet(sheets, spreadsheet_id, sheet_id, rows_to_freeze); // Freezing the first row
        if(status >= 0) console.log("Sheet with name " + sheet_name + " frozen successfully at row: " + rows_to_freeze);
        else console.log("Failed to freeze sheet with name " + sheet_name);
    }
    else
    {
        console.log("Sheet with name " + sheet_name + " not found in spreadsheet, cannot freeze rows");
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_common_google_sheet_core_fns()
{
    if (process.env.RUN_TEST_COMMON_GOOGLE_SHEET_CORE_FNS_CREATE_GOOGLE_SPREADSHEET === "true") await test_createGoogleSpreadsheet();
    if (process.env.RUN_TEST_COMMON_GOOGLE_SHEET_CORE_FNS_GET_NUMBER_OF_SHEETS_IN_GOOGLE_SPREADSHEET === "true") await test_GoogleSheet_getNumberOfSheetsInGoogleSpreadsheet();
    if (process.env.RUN_TEST_COMMON_GOOGLE_SHEET_CORE_FNS_FIND_SHEET_BY_NAME_IN_GOOGLE_SPREADSHEET === "true") await test_GoogleSheet_findSheetByNameInGoogleSpreadsheet();
    if (process.env.RUN_TEST_COMMON_GOOGLE_SHEET_CORE_FNS_DELETE_SHEET_IN_GOOGLE_SPREADSHEET === "true") await test_GoogleSheet_deleteSheetInGoogleSpreadsheet();
    if (process.env.RUN_TEST_COMMON_GOOGLE_SHEET_CORE_FNS_RENAME_SHEET_IN_GOOGLE_SPREADSHEET === "true") await test_GoogleSheet_renameSheetInGoogleSpreadsheet();
    if (process.env.RUN_TEST_COMMON_GOOGLE_SHEET_CORE_FNS_CREATE_SHEET_IN_GOOGLE_SPREADSHEET === "true") await test_GoogleSheet_createSheetInGoogleSpreadsheet();
    if (process.env.RUN_TEST_COMMON_GOOGLE_SHEET_CORE_FNS_WRITE_VALUES_TO_GOOGLE_SHEET === "true") await test_GoogleSheet_writeValuesToGoogleSheet();
    if (process.env.RUN_TEST_COMMON_GOOGLE_SHEET_CORE_FNS_FREEZE_N_ROWS_IN_GOOGLE_SHEET === "true") await test_GoogleSheet_freezeNRowsInGoogleSheet();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = 
{
    test_common_google_sheet_core_fns
};
