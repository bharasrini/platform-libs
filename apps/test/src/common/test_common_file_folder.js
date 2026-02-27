const path = require("path");
const common = require("@fyle-ops/common");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_hasExtension()
{
    // Get the function name for logging
    const fn = test_hasExtension.name;

    common.start_test(fn);
    
    var file_name = "test_file.csv";
    var ext = "csv";
    var has_ext = common.hasExtension(file_name, "." + ext);
    common.statusMessage(fn, "Set 1: File name: ", file_name, ", Extension: ", ext, ", Has extension: ", has_ext);

    file_name = "test_file";
    ext = "csv";
    has_ext = common.hasExtension(file_name, "." + ext);
    common.statusMessage(fn, "Set 2: File name: ", file_name, ", Extension: ", ext, ", Has extension: ", has_ext);

    common.end_test(fn);
}


async function test_createFolder()
{
    // Get the function name for logging
    const fn = test_createFolder.name;

    common.start_test(fn);

    const base_path = process.cwd();
    const output_dir = path.join(base_path, process.env.DOWNLOADS_FOLDER);
    var folder_path = path.join(output_dir, "test_folder");
    var result = await common.createFolder(folder_path);
    common.statusMessage(fn, "Create folder result: ", result);

    common.end_test(fn);
}


async function test_createFile()
{
    // Get the function name for logging
    const fn = test_createFile.name;

    common.start_test(fn);

    const base_path = process.cwd();
    const output_dir = path.join(base_path, process.env.DOWNLOADS_FOLDER);
    var folder_path = path.join(output_dir, "test_folder");
    await common.createFolder(folder_path);

    const data_obj = Buffer.from("Test file content");
    var file_name = "test_file.txt";
    await common.createFile(folder_path, file_name, "txt", data_obj);
    common.statusMessage(fn, "Wrote data to file: ", file_name);

    const image_data  = require("../../data/image.json");
    const rocketBmp = Buffer.from(image_data.base64, "base64");
    file_name = "rocket.bmp";
    await common.createFile(folder_path, file_name, "bmp", rocketBmp);
    common.statusMessage(fn, "Wrote data to file: ", file_name);

    common.end_test(fn);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_common_file_folder()
{
    // Get the function name for logging
    const fn = test_common_file_folder.name;

    common.start_test_suite("File and Folder functions");
    
    // File and Folder functions
    if(process.env.RUN_TEST_COMMON_HAS_EXTENSION === "true") await test_hasExtension();
    if(process.env.RUN_TEST_COMMON_CREATE_FOLDER === "true") await test_createFolder();
    if(process.env.RUN_TEST_COMMON_CREATE_FILE === "true") await test_createFile();

    common.end_test_suite("File and Folder functions");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports =
{
    test_common_file_folder
}