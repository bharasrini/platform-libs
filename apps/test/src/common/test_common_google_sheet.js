const common = require("@fyle-ops/common");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_writeDataArrayToGoogleSheet()
{
    // Get function name for logging
    const fn = test_writeDataArrayToGoogleSheet.name;

    common.start_test(fn);

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
    const folder_id = "1RQWnc1dSkRnUDxkO4Tm_tjBjyyL1qpr-";  // "Test Folder" under "Customer Success Shared Drive"
    const file_name = "Test Spreadsheet";
    
    const sheet_name = "CreateAndWriteSheet";
    const res = await common.writeDataArrayToGoogleSheet(data_array, folder_id, file_name, sheet_name, true, true);
    if(res >= 0) common.statusMessage(fn, "Data array written successfully to sheet with name " + sheet_name + " in spreadsheet with name " + file_name);
    else common.statusMessage(fn, "Failed to write data array to sheet with name " + sheet_name + " in spreadsheet with name " + file_name);

    // Write once again without the header
    const sheet_name2 = "CreateAndWriteSheet2";
    const res2 = await common.writeDataArrayToGoogleSheet(data_array, folder_id, file_name, sheet_name2, false, false);
    if(res2 >= 0) common.statusMessage(fn, "Data array written successfully to sheet with name " + sheet_name2 + " in spreadsheet with name " + file_name);
    else common.statusMessage(fn, "Failed to write data array to sheet with name " + sheet_name2 + " in spreadsheet with name " + file_name);

    common.end_test(fn);

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_common_google_sheet()
{
    // Get function name for logging
    const fn = test_common_google_sheet.name;

    common.start_test_suite("Google Sheet");
    
    if(process.env.RUN_TEST_COMMON_GOOGLE_SHEET_WRITE_DATA_ARRAY_TO_SHEET === "true") await test_writeDataArrayToGoogleSheet();

    common.end_test_suite("Google Sheet");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports =
{
    test_common_google_sheet,
};