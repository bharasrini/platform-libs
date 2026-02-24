const { google } = require('googleapis');
const { createGoogleAuth } = require("./google_auth");
const { statusMessage } = require("./logs");
const { getIdFromUrl } = require("./misc");
const google_drive_core = require("./google_drive_core_fns");


/***************** Wrappers for Google Drive related functions *****************/

/*
Function: copyFileOnGoogleDrive
Purpose: Copies the file to the destination folder. Note that this has to be a 'Shared Folder' since the service account needs to have access to it. 
Inputs: URL of the file to be copied, ID of the folder to where it needs to be copied, file name to use for the copied file, whether to copy if the same file exists
Output: URL of the copied file on success, blank otherwise
*/
async function copyFileOnGoogleDrive(source_file_url, dest_folder_id, file_name_to_use, copy_if_same_file_exists)
{
    const fn = copyFileOnGoogleDrive.name;
    
    // Get authentication and drive instance
    const auth = createGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    var copied_file_url = "";

    // Get the file ID from the URL
    var source_file_id = getIdFromUrl(source_file_url);
    if(source_file_id == "")
    {
        statusMessage(fn, "Failed to extract ID from source file url: " + source_file_url);
        return copied_file_url;
    }

    // Get a handle on the destination folder
    const dest_res = await google_drive_core.GoogleDrive_getFolder(drive, dest_folder_id);
    if(!dest_res)
    {
        statusMessage(fn, "Error fetching destination folder with ID " + dest_folder_id);
        return copied_file_url;
    }

    // Check if a file with the same name already exists in the destination folder
    const child_res = await google_drive_core.GoogleDrive_getFilesInFolder(drive, dest_folder_id, file_name_to_use);

    // If we could not find the file or if we need to copy even if the same file exists, proceed with copying
    if (!child_res || !child_res.data.files || child_res.data.files.length === 0 || copy_if_same_file_exists) 
    {
        const copy_res = await google_drive_core.GoogleDrive_copyFileToFolder(drive, source_file_id, dest_folder_id, file_name_to_use);
        if(copy_res === null)
        {
            statusMessage(fn, "Failed to copy file: " + source_file_id + " to destination folder with ID: " + dest_folder_id);
            return copied_file_url;
        }

        copied_file_url = "https://drive.google.com/file/d/" + copy_res.data.id + "/view";
    }
    // Else we found an existing file and we are not supposed to copy if the same file exists, so just return the URL of the existing file
    else
    {
        statusMessage(fn, "Found existing file " + file_name_to_use + " under " + dest_folder_id);
        copied_file_url = "https://drive.google.com/file/d/" + child_res.data.files[0].id + "/view";
    }

    return copied_file_url;
}



/*
Function: trashFileOnGoogleDrive
Purpose: Trashes the file whose file name and parent folder are passed in
Inputs: folder ID, file name
Output: 0 on success, -1 otherwise
*/
async function trashFileOnGoogleDrive(folder_id, file_name)
{
    const fn = trashFileOnGoogleDrive.name;
    
    // Get authentication and drive instance
    const auth = createGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    // First check if the parent folder exists and is a folder
    const res = await google_drive_core.GoogleDrive_getFolder(drive, folder_id);
    if(!res)
    {
        statusMessage(fn, "Error fetching destination folder with ID " + folder_id);
        return -1;
    }

    // Check if a file with the same name already exists in the destination folder
    const child_res = await google_drive_core.GoogleDrive_getFilesInFolder(drive, folder_id, file_name);
    if(!child_res)
    {
        statusMessage(fn, "Error fetching files in folder with ID " + folder_id);
        return -1;
    }

    const file_id = child_res.data.files[0].id;
    const del_res = await google_drive_core.GoogleDrive_trashFile(drive, file_id);
    if(!del_res)
    {
        statusMessage(fn, "Error thrashing file " + file_name + " id:" + file_id + " under folder with ID " + folder_id);
        return -1;
    }

    statusMessage(fn, "Trashed file " + file_name + " id:" + file_id + " under folder with ID " + folder_id);
    
    return 0;
}



/*
Function: moveFolderOnGoogleDrive
Purpose: Moves to folder whose id is passed in to the destination folder whose id is passed in
Inputs: folder ID, destination folder id
Output: 0 on success, -1 otherwise
*/
async function moveFolderOnGoogleDrive(folder_id, dest_folder_id) 
{
    const fn = moveFolderOnGoogleDrive.name;
    
    // Get authentication and drive instance
    const auth = createGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    // First check if the folder with id folder_id exists and is a folder
    const res = await google_drive_core.GoogleDrive_getFolder(drive, folder_id);
    if(!res)
    {
        statusMessage(fn, "Error fetching folder with ID " + folder_id);
        return -1;
    }

    // Next check if the destination folder with id dest_folder_id exists and is a folder
    const dest_res = await google_drive_core.GoogleDrive_getFolder(drive, dest_folder_id);
    if(!dest_res)
    {
        statusMessage(fn, "Error fetching destination folder with ID " + dest_folder_id);
        return -1;
    }

    const move_res = await google_drive_core.GoogleDrive_moveFolder(drive, folder_id, dest_folder_id, res);
    if(!move_res)
    {
        statusMessage(fn, "Error moving folder with ID " + folder_id + " to destination folder with ID " + dest_folder_id);
        return -1;
    }

    return 0;
}



/* 
Function: checkAndCreateFolderOnGoogleDrive
Purpose: Checks and creates a child folder with the provided name in the parent folder on Google Drive (provided the child folder does not exist)
Inputs: parent folder ID, child folder name
Output: child folder id on success, "" otherwise
*/
async function checkAndCreateFolderOnGoogleDrive(parent_folder_id, child_folder_name) 
{
    const fn = checkAndCreateFolderOnGoogleDrive.name;
    
    // Get authentication and sheets instance
    const auth = createGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    // First check if the parent folder exists and is a folder
    const parent_res = await google_drive_core.GoogleDrive_getFolder(drive, parent_folder_id);
    if(!parent_res)
    {
        statusMessage(fn, "Error fetching parent folder with ID " + parent_folder_id);
        return "";
    }

    // Check for existing child folder with the given name under the parent folder
    const child_res = await google_drive_core.GoogleDrive_getFolderInFolder(drive, parent_folder_id, child_folder_name);
    if(child_res === null)
    {
        // We couldn't find the child folder, lets create it
        const created_res = await google_drive_core.GoogleDrive_createFolder(drive, child_folder_name, parent_folder_id);
        if(!created_res)
        {
            statusMessage(fn, "Error creating child folder " + child_folder_name + " under parent folder with ID " + parent_folder_id);
            return "";
        }
        const created_folder_id = created_res.data.id;
        statusMessage(fn, "Created folder " + child_folder_name + " with ID " + created_folder_id + " under parent folder with ID " + parent_folder_id);
        return created_folder_id;
    }
    else
    {
        // We found the child folder, return the ID
        statusMessage(fn, "Found existing folder " + child_folder_name + " under " + parent_folder_id);
        const child_folder_id = child_res.data.files[0].id;
        return child_folder_id; 
    }

    return "";
}


module.exports =
{
    copyFileOnGoogleDrive,
    trashFileOnGoogleDrive,
    moveFolderOnGoogleDrive,
    checkAndCreateFolderOnGoogleDrive
};