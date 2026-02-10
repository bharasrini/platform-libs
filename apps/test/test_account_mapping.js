const { account_mapping } = require("@fyle-ops/account_mapping");

async function test_getAccountMapping()
{
    const account_map = new account_mapping();
    await account_map.getAccountMappingData();
    console.log("Account mapping data read successfully !!!");
}

async function test_account_mapping()
{
    if(process.env.RUN_TEST_ACCOUNT_MAPPING_DATA === "true") await test_getAccountMapping();
}

module.exports = 
{
    test_account_mapping
};