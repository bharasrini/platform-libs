const { formatInTimeZone } = require("date-fns-tz");
const path = require("path");
const common = require("@fyle-ops/common");






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_exportToExcelFile()
{
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

    const file_name = "test.xlsx";
    const sheet_name = "README";

    await common.exportToExcelFile(data_array, process.env.DOWNLOADS_FOLDER, file_name, sheet_name);
    console.log("Exported data to Excel file: ", file_name);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_common()
{
    // Spreadsheet functions
    if(process.env.RUN_TEST_COMMON_EXPORT_TO_EXCEL_FILE === "true") await test_exportToExcelFile();
}


module.exports = 
{
    test_common
};