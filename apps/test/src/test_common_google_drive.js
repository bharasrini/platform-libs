const { formatInTimeZone } = require("date-fns-tz");
const path = require("path");
const { google } = require('googleapis');
const common = require("@fyle-ops/common");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function test_copyFileOnGoogleDrive()
{
    var source_file_url = "https://drive.google.com/file/d/1zEvRdrTnBHLLvvBAF0ZopIpVu3XcFFvt/view?usp=drive_link";
    var dest_folder_id = "1RQWnc1dSkRnUDxkO4Tm_tjBjyyL1qpr-";  // "Test Folder" under "Customer Success Shared Drive"
    var file_name_to_use = "Final Copied Test File - XUL Brewing Company.pdf";
    var copy_if_same_file_exists = true;
    var copied_file_url = await common.copyFileOnGoogleDrive(source_file_url, dest_folder_id, file_name_to_use, copy_if_same_file_exists);
    if(copied_file_url) console.log("Copied file URL: ", copied_file_url);
}


async function test_trashFileOnGoogleDrive()
{
    var folder_id = "1RQWnc1dSkRnUDxkO4Tm_tjBjyyL1qpr-";  // "Test Folder" under "Customer Success Shared Drive"
    var file_name = "Final Copied Test File - XUL Brewing Company.pdf";
    var result = await common.trashFileOnGoogleDrive(folder_id, file_name);
    console.log("Trash file result: ", result);
}


async function test_moveFolderOnGoogleDrive()
{
    var folder_id = "1lLv2oSIQVlBl97KZzxuyndfU5l7_Ij-O";  // "Check123: under "Test Folder" in "Customer Success Shared Drive"
    var dest_folder_id = "1uYmEV_I-ZHGM4iDX6etkJGogMGyuBoiH";  // "Test Folder1" under "Customer Success Shared Drive"
    var result = await common.moveFolderOnGoogleDrive(folder_id, dest_folder_id);
    console.log("Moved folder: " + folder_id + " to folder: " + dest_folder_id);
}

async function test_checkAndCreateFolderOnGoogleDrive()
{
    //const folder_id = "1LNU3tU8F3gRoncR1kpGCfJad9zTvTteW";
    var folder_id = "1RQWnc1dSkRnUDxkO4Tm_tjBjyyL1qpr-";  // "Test Folder" under "Customer Success Shared Drive"
    const child_folder_name = "Check123";
    const child_folder_id = await common.checkAndCreateFolderOnGoogleDrive(folder_id, child_folder_name);
    console.log("Folder details: ", child_folder_id);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_common_google_drive()
{
    // Google Drive functions
    if(process.env.RUN_TEST_COMMON_COPY_FILE_ON_GOOGLE_DRIVE === "true") await test_copyFileOnGoogleDrive();
    if(process.env.RUN_TEST_COMMON_TRASH_FILE_ON_GOOGLE_DRIVE === "true") await test_trashFileOnGoogleDrive();
    if(process.env.RUN_TEST_COMMON_MOVE_FOLDER_ON_GOOGLE_DRIVE === "true") await test_moveFolderOnGoogleDrive();
    if(process.env.RUN_TEST_COMMON_CHECK_AND_CREATE_FOLDER_ON_GOOGLE_DRIVE === "true") await test_checkAndCreateFolderOnGoogleDrive();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = 
{
    test_common_google_drive
};