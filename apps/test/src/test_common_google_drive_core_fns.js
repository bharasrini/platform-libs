const { formatInTimeZone } = require("date-fns-tz");
const path = require("path");
const { google } = require('googleapis');
const common = require("@fyle-ops/common");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_common_google_drive_core_fns_get_folder()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    var folder_id = "1RQWnc1dSkRnUDxkO4Tm_tjBjyyL1qpr-";  // "Test Folder" under "Customer Success Shared Drive"
    const res = await common.GoogleDrive_getFolder(drive, folder_id);
    console.log("Get folder result - ID: " + res.data.id + " Name: " + res.data.name);
}

async function test_common_google_drive_core_fns_get_files_in_folder()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    var folder_id = "1RQWnc1dSkRnUDxkO4Tm_tjBjyyL1qpr-";  // "Test Folder" under "Customer Success Shared Drive"

    // Test with a file name that exists in the folder
    const res = await common.GoogleDrive_getFilesInFolder(drive, folder_id, "Test Spreadsheet");
    console.log("[1]. Get files in folder result - ID: " + res.data.files[0].id + " Name: " + res.data.files[0].name);

    // Test with a file name that doesn't exist in the folder
    const res2 = await common.GoogleDrive_getFilesInFolder(drive, folder_id, "Non Existent File Name");
    console.log("[2]. Get files in folder result - ID: " + (res2 && res2.data.files.length > 0 ? res2.data.files[0].id : "No file found") + " Name: " + (res2 && res2.data.files.length > 0 ? res2.data.files[0].name : "No file found"));
}

async function test_common_google_drive_core_fns_get_folder_in_folder()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    var folder_id = "1RQWnc1dSkRnUDxkO4Tm_tjBjyyL1qpr-";  // "Test Folder" under "Customer Success Shared Drive"

    // Test with a folder name that exists in the folder
    const res = await common.GoogleDrive_getFolderInFolder(drive,folder_id, "Check123");
    console.log("[1]. Get folder in folder result - ID: " + res.data.files[0].id + " Name: " + res.data.files[0].name);

    // Test with a folder name that doesn't exist in the folder
    const res2 = await common.GoogleDrive_getFolderInFolder(drive, folder_id, "Non Existent Folder Name");
    console.log("[2]. Get folder in folder result - ID: " + (res2 && res2.data.files.length > 0 ? res2.data.files[0].id : "No folder found") + " Name: " + (res2 && res2.data.files.length > 0 ? res2.data.files[0].name : "No folder found"));
}

async function test_common_google_drive_core_fns_copy_file_to_folder()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    var source_file_id = "1IWlRG96NFZhyAfhk-ncUpp4uMIpbCe7f"; // "Copied Test File - XUL Brewing Company" in "Test Folder" under "Customer Success Shared Drive"
    var dest_folder_id = "1RQWnc1dSkRnUDxkO4Tm_tjBjyyL1qpr-";  // "Test Folder" under "Customer Success Shared Drive"
    var file_name_to_use = "Modified Core Test File - XUL Brewing Company.pdf";

    const res = await common.GoogleDrive_copyFileToFolder(drive, source_file_id, dest_folder_id, file_name_to_use);
    console.log("Copy file to folder result - ID: " + res.data.id + " Name: " + res.data.name + " Parent: " + res.data.parents);
}

async function test_common_google_drive_core_fns_trash_file()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    var file_id = "1ZzED8zH9LJMMkOJgFnquACDLfA2p29pjqMWapI2iEZY"; // "Test for Thrashing" in "Test Folder" under "Customer Success Shared Drive"

    const res = await common.GoogleDrive_trashFile(drive, file_id);
    console.log("Trash file result: ID: " + res.data.id + " Name: " + res.data.name + " Thrashed: " + res.data.trashed);
}


async function test_common_google_drive_core_fns_move_folder()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    const folder_id = "1lLv2oSIQVlBl97KZzxuyndfU5l7_Ij-O"; // Folder "Check123" under "Customer Success Shared Drive"
    const dest_folder_id = "1uYmEV_I-ZHGM4iDX6etkJGogMGyuBoiH"; // Folder "Test Folder1" under "Customer Success Shared Drive"

     // First get the reference to the folder we want to move to ensure that it exists before we try to move it
    const src_res = await common.GoogleDrive_getFolder(drive, folder_id);
    if(!src_res)
    {
        console.log("Error fetching folder with ID " + folder_id);
        return;
    }

    const res = await common.GoogleDrive_moveFolder(drive, folder_id, dest_folder_id, src_res);
    console.log("Move folder result: ID: " + res.data.id + " Name: " + res.data.name + " Parent: " + res.data.parents);
}

async function test_common_google_drive_core_fns_create_folder()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    const folder_name = "Test Create Folder";
    const parent_folder_id = "1RQWnc1dSkRnUDxkO4Tm_tjBjyyL1qpr-";  // "Test Folder" under "Customer Success Shared Drive"
    const res = await common.GoogleDrive_createFolder(drive, folder_name, parent_folder_id);
    console.log("Create folder result: ID: " + res.data.id + " Name: " + res.data.name + " Parent: " + res.data.parents);
}

async function test_common_google_drive_core_fns_create_file()
{
    // Get authentication and drive instance
    const auth = common.createGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    const file_name = "Test Create File.txt";
    const parent_folder_id = "1RQWnc1dSkRnUDxkO4Tm_tjBjyyL1qpr-";  // "Test Folder" under "Customer Success Shared Drive"
    const mime_type = "text/plain";
    const res = await common.GoogleDrive_createFile(drive, file_name, parent_folder_id, mime_type);
    console.log("Create file result: ID: " + res.data.id + " Name: " + res.data.name + " Parent: " + res.data.parents);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_common_google_drive_core_fns()
{
    if(process.env.RUN_TEST_COMMON_GOOGLE_DRIVE_CORE_FNS_GET_FOLDER === "true") await test_common_google_drive_core_fns_get_folder();
    if(process.env.RUN_TEST_COMMON_GOOGLE_DRIVE_CORE_FNS_GET_FILES_IN_FOLDER === "true") await test_common_google_drive_core_fns_get_files_in_folder();
    if(process.env.RUN_TEST_COMMON_GOOGLE_DRIVE_CORE_FNS_GET_FOLDER_IN_FOLDER === "true") await test_common_google_drive_core_fns_get_folder_in_folder();
    if(process.env.RUN_TEST_COMMON_GOOGLE_DRIVE_CORE_FNS_COPY_FILE_TO_FOLDER === "true") await test_common_google_drive_core_fns_copy_file_to_folder();
    if(process.env.RUN_TEST_COMMON_GOOGLE_DRIVE_CORE_FNS_TRASH_FILE === "true") await test_common_google_drive_core_fns_trash_file();
    if(process.env.RUN_TEST_COMMON_GOOGLE_DRIVE_CORE_FNS_MOVE_FOLDER === "true") await test_common_google_drive_core_fns_move_folder();
    if(process.env.RUN_TEST_COMMON_GOOGLE_DRIVE_CORE_FNS_CREATE_FOLDER === "true") await test_common_google_drive_core_fns_create_folder();
    if(process.env.RUN_TEST_COMMON_GOOGLE_DRIVE_CORE_FNS_CREATE_FILE === "true") await test_common_google_drive_core_fns_create_file();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = 
{
    test_common_google_drive_core_fns
}