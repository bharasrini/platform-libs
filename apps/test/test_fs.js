const { fs_account } = require("@fyle-ops/freshsuccess");

async function test_fs_account()
{
    const account = new fs_account();
    await account.getAccounts();
    await account.getBillingData();
    await account.getInvitedUsersMetrics();
    await account.getVerifiedUsersMetrics();
    console.log("Accounts read successfully !!!");
}

async function test_fs()
{
    if(process.env.RUN_TEST_FS_ACCOUNT === "true") await test_fs_account();
}


module.exports = 
{
    test_fs
};