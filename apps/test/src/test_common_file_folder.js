const { formatInTimeZone } = require("date-fns-tz");
const path = require("path");
const common = require("@fyle-ops/common");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_hasExtension()
{
    var file_name = "test_file.csv";
    var ext = "csv";
    var has_ext = common.hasExtension(file_name, "." + ext);
    console.log("Set 1: File name: ", file_name, ", Extension: ", ext, ", Has extension: ", has_ext);

    file_name = "test_file";
    ext = "csv";
    has_ext = common.hasExtension(file_name, "." + ext);
    console.log("Set 2: File name: ", file_name, ", Extension: ", ext, ", Has extension: ", has_ext);
}


async function test_createFolder()
{
    const base_path = process.cwd();
    const output_dir = path.join(base_path, process.env.DOWNLOADS_FOLDER);
    var folder_path = path.join(output_dir, "test_folder");
    var result = await common.createFolder(folder_path);
    console.log("Create folder result: ", result);
}


async function test_createFile()
{
    const base_path = process.cwd();
    const output_dir = path.join(base_path, process.env.DOWNLOADS_FOLDER);
    var folder_path = path.join(output_dir, "test_folder");
    await common.createFolder(folder_path);

    const data_obj = Buffer.from("Test file content");
    var file_name = "test_file.txt";
    await common.createFile(folder_path, file_name, "txt", data_obj);
    console.log("Wrote data to file: " + file_name);

    const image_data  = require("../data/image");
    const rocketBmp = Buffer.from(image_data.base64, "base64");
    file_name = "rocket.bmp";
    await common.createFile(folder_path, file_name, "bmp", rocketBmp);
    console.log("Wrote data to file: " + file_name);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_common_file_folder()
{
    // File and Folder functions
    if(process.env.RUN_TEST_COMMON_HAS_EXTENSION === "true") await test_hasExtension();
    if(process.env.RUN_TEST_COMMON_CREATE_FOLDER === "true") await test_createFolder();
    if(process.env.RUN_TEST_COMMON_CREATE_FILE === "true") await test_createFile();

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports =
{
    test_common_file_folder
}