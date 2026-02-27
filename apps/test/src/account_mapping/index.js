const path = require("path");

require("dotenv").config
({
    path: path.resolve(__dirname, "..", "..", "env", ".env.account_mapping"),
    override: true
});

const { test_account_mapping } = require("./test_account_mapping");

(async () => 
{
    // Account Mappping functions
    if (process.env.RUN_ACCOUNT_MAPPING_TEST === "true") await test_account_mapping();
})();