const { google } = require('googleapis');

/* 
Function: getLastRowAndCol
Purpose: Returns the last row and column indices of a Google Sheet data object
Inputs: sheet_data - The data object returned by Google Sheets API, 
Output: Object with lastRow and lastColumn properties
*/
function getLastRowAndCol(sheet_data) 
{
    // Locate the last row
    const rows = sheet_data.values || [];
    const lastRow = rows.length;

    // find the maximum non-empty columns among all rows
    let lastColumn = 0;
    for (const row of rows) 
    {
        if (row.length > lastColumn) lastColumn = row.length;
    }

    return { lastRow, lastColumn };
}


// Exporting the functions
module.exports = 
{ 
    getLastRowAndCol,
};
