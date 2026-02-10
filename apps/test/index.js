require("dotenv").config();
require("dotenv").config({ path: __dirname + "/.env" });

const { test_fs } = require ("./test_fs");
const { test_billing } = require ("./test_billing");
const { test_account_mapping } = require("./test_account_mapping");
const { test_fd } = require("./test_fd");
const { test_common } = require("./test_common");


(async () => 
{
    if (process.env.RUN_FS_TEST === "true") await test_fs ();
    if (process.env.RUN_BILLING_TEST === "true") await test_billing();
    if (process.env.RUN_ACCOUNT_MAPPING_TEST === "true") await test_account_mapping();
    if (process.env.RUN_FD_TEST === "true") await test_fd();
    if (process.env.RUN_COMMON_TEST === "true") await test_common();
})();
