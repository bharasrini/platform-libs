require("dotenv").config();
require("dotenv").config({ path: __dirname + "/../.env" });

const { test_common_date_time } = require("./test_common_date_time");
const { test_common_file_folder } = require("./test_common_file_folder");
const { test_common_google_drive_core_fns } = require("./test_common_google_drive_core_fns");
const { test_common_google_drive } = require("./test_common_google_drive");
const { test_common_google_sheet_core_fns } = require("./test_common_google_sheet_core_fns");
const { test_common_google_sheet } = require("./test_common_google_sheet");
const { test_common_misc } = require("./test_common_misc");
const { test_common_retry } = require("./test_common_retry");
const { test_account_mapping } = require("./test_account_mapping");
const { test_billing } = require ("./test_billing");
const { test_fs } = require ("./test_fs");
const { test_fd } = require("./test_fd");
const { test_csm_mapping } = require("./test_csm_mapping");
const { test_fyle_api } = require("./test_fyle");

(async () => 
{
    // Common functions
    if (process.env.RUN_COMMON_DATE_TIME_TEST === "true") await test_common_date_time();
    if (process.env.RUN_COMMON_FILE_FOLDER_TEST === "true") await test_common_file_folder();
    if (process.env.RUN_COMMON_GOOGLE_DRIVE_CORE_FNS_TEST === "true") await test_common_google_drive_core_fns();
    if (process.env.RUN_COMMON_GOOGLE_DRIVE_TEST === "true") await test_common_google_drive();
    if (process.env.RUN_COMMON_GOOGLE_SHEET_CORE_FNS_TEST === "true") await test_common_google_sheet_core_fns();
    if (process.env.RUN_COMMON_GOOGLE_SHEET_TEST === "true") await test_common_google_sheet();
    if (process.env.RUN_COMMON_MISC_TEST === "true") await test_common_misc();
    if (process.env.RUN_COMMON_RETRY_TEST === "true") await test_common_retry();

    // Account Mappping functions
    if (process.env.RUN_ACCOUNT_MAPPING_TEST === "true") await test_account_mapping();

    // Billing functions
    if (process.env.RUN_BILLING_TEST === "true") await test_billing();

    // Freshsuccess functions
    if (process.env.RUN_FS_TEST === "true") await test_fs ();

    // Freshdesk functions
    if (process.env.RUN_FD_TEST === "true") await test_fd();

    // CS Mapping functions
    if (process.env.RUN_CSM_MAPPING_TEST === "true") await test_csm_mapping();

    // Fyle API functions
    if (process.env.RUN_FYLE_API_TEST === "true") await test_fyle_api();
})();
