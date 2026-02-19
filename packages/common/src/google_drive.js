const { google } = require('googleapis');
const { createGoogleAuth } = require("./google_auth");
const { statusMessage } = require("./logs");

/* 
Function: checkAndCreateFolderonGoogleDrive
Purpose: Checks and creates a child folder with the provided name in the parent folder on Google Drive (provided the child folder does not exist)
Inputs: parent folder ID, child folder name
Output: child folder id on success, "" otherwise
*/
async function checkAndCreateFolderonGoogleDrive(parent_folder_id, child_folder_name) 
{
    // Get authentication and sheets instance
    const auth = createGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    // Check for existing folder with the given name under the parent folder
    const listRes = await drive.files.list
    ({
        q: [
        `'${parent_folder_id}' in parents`,
        `name = '${child_folder_name.replace(/'/g, "\\'")}'`,
        `mimeType = 'application/vnd.google-apps.folder'`,
        'trashed = false',
        ].join(' and '),
        fields: 'files(id)',
        pageSize: 1,
    });

    // Check if we were able to find the folder
    if (listRes.data.files && listRes.data.files.length > 0) 
    {
        statusMessage('checkAndCreateFolder', `Found existing folder "${child_folder_name}" under ${parent_folder_id}`);
        return listRes.data.files[0].id; // folderId
    }

    // If we were unable to find the folder, create it
    statusMessage('checkAndCreateFolder', `Creating folder "${child_folder_name}" under ${parent_folder_id}`);
    const createRes = await drive.files.create
    ({
        requestBody: 
        {
            name: child_folder_name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parent_folder_id],
        },
        fields: 'id',
    });

    // Return the created folder ID
    return createRes.data.id;
}


// Exporting the functions
module.exports = 
{ 
    checkAndCreateFolderonGoogleDrive,
};
