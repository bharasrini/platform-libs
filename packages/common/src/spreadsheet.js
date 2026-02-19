const { google } = require('googleapis');
const ExcelJS = require("exceljs");
const fs = require("fs/promises");
const path = require("path");
const { statusMessage } = require("./logs");
const { flattenStructure } = require("./misc");


/* 
Function: getLastRowAndCol
Purpose: Returns the last row and column indices of a Google Sheet data object
Inputs: sheet_data - The data object returned by Google Sheets API, 
Output: Object with lastRow and lastColumn properties
*/
function getLastRowAndCol(sheet_data) 
{
    // Locate the last row
    const rows = sheet_data || [];
    const lastRow = rows.length;

    // find the maximum non-empty columns among all rows
    let lastColumn = 0;
    for (const row of rows) 
    {
        if (row.length > lastColumn) lastColumn = row.length;
    }

    return { lastRow, lastColumn };
}


/* 
Function: exportExcelFile
Purpose: Exports data to an Excel file
Inputs: data_array - Array of data to be exported, dir_name - Directory name to save the file, file_name - Name of the Excel file, sheet_name - Name of the sheet
Output: 0 on success, -1 on failure
*/
async function exportExcelFile(data_array, dir_name, file_name, sheet_name)
{

    // Sanity check - if data_array is empty, return without creating the file
    if (!data_array || data_array.length === 0)
    {
        statusMessage(arguments.callee.name, "No data to export");
        return 0;
    }

    // Flatten the data array if it is an array of objects with nested objects/arrays
    var flattenedHeaders = {};
    var new_data_array = [];
    for(i = 0; i < data_array.length; i++)
    {
        flattenStructure(data_array[i], flattenedHeaders, '', new_data_array, i);
    }
    var headers = Object.keys(flattenedHeaders);

    try
    {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        // Write out the header row
        worksheet.columns = Object.keys(new_data_array[0]).map(key => 
        ({
            header: key,
            key: key,
            width: 20
        }));

        new_data_array.forEach(e => worksheet.addRow(e));    

        // Ensure output folder exists
        const base_path = process.cwd();
        const output_dir = path.join(base_path, dir_name);
        await fs.mkdir(output_dir, { recursive: true });

        const fullPath = path.join(output_dir, file_name);
        await workbook.xlsx.writeFile(fullPath);

        statusMessage(arguments.callee.name, "Excel file saved at:", fullPath);
    }
    catch(e)
    {
        statusMessage(arguments.callee.name, "Error exporting Excel file:", e);
        return -1;
    }

    return 0;
}


// Exporting the functions
module.exports = 
{ 
    getLastRowAndCol,
    exportExcelFile
};
