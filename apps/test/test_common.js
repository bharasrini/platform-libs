const common = require("@fyle-ops/common");

async function test_checkAndCreateFolder()
{
    const folder_id = "1LNU3tU8F3gRoncR1kpGCfJad9zTvTteW";
    const child_folder_name = "Test Folder";
    const child_folder_id = await common.checkAndCreateFolder(folder_id, child_folder_name);
    console.log("Folder details: ", child_folder_id);
}


async function test_common()
{
    if(process.env.RUN_TEST_CHECK_AND_CREATE_FOLDER === "true") await test_checkAndCreateFolder();
}


module.exports = 
{
    test_common
};