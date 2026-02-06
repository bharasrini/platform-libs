const { google } = require('googleapis');

function getLastRowAndCol(sheet_data) {

    const rows = sheet_data.values || [];

    const lastRow = rows.length;

    // find the maximum non-empty columns among all rows
    let lastColumn = 0;
    for (const row of rows) {
        if (row.length > lastColumn) lastColumn = row.length;
    }

    return { lastRow, lastColumn };
}



module.exports = { 
    getLastRowAndCol,
};
