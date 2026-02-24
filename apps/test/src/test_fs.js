const { fs_account, postRecordsToFS, removeCSMMappingfromFS, postContactsToFS } = require("@fyle-ops/freshsuccess");


async function test_fs_get_accounts()
{
    const account = new fs_account();
    await account.getAccounts();
    console.log("Accounts read successfully !!!");
}

async function test_fs_locate_org()
{
    const account = new fs_account();
    await account.getAccounts();
    const org_id = "or7llVvqUi5i"; // Suzanne & Walter Scott Foundation
    const org = account.locateOrg(org_id);
    if(org) console.log("Org located successfully - org name : " + account.account_list[org]["id"]["account_name"] + " !!!");
    else console.log("Org not found !!!");
}

async function test_fs_read_billing()
{
    const account = new fs_account();
    await account.getAccounts();
    await account.getBillingData();
    console.log("Billing data read successfully !!!");
}


async function test_fs_get_metrics()
{
    const account = new fs_account();
    await account.getAccounts();
    await account.getBillingData();
    await account.getInvitedUsersMetrics();
    await account.getVerifiedUsersMetrics();
    console.log("Metrics read successfully !!!");
}


async function test_fs_contact()
{
    const account = new fs_account();
    await account.getContacts();
    console.log("Contacts read successfully !!!");
}


async function test_fs_post_accounts()
{
    var record_container =
    [
        account_info = 
        {
            "account_id": "ortst9876543210",
            "parent_account_id": "orTuMHfWX13p",
            "crm_account_id": "Test Account 987654321 - Changed, LLC",
            "name": "Test Account 987654321 - Changed",
            "join_date": new Date("01-Feb-2026").getTime(),
            "current_mrr": 14990,
            "hierarchy_label": "Secondary",
            "tier": "Bronze: ARR <$1K",
            "billing_country": "US",
            "billing_state": "CA",
            "region": "Americas",
            "industry": "Construction",
            "stage": "Recently Onboarded",

            "assigned_csms": [{"email": "bharadwaj.srinivasan@fyle.in"}],
            "custom_label_dimensions": 
            [
                {"key": "enterprise_billing_org_id", "value": "ortst9876543210"},
                {"key": "customer_source", "value": "Referral"},
                {"key": "customer_type", "value": "Referral Customer"},
                {"key": "partner_reseller_name", "value": "Test Reseller, Inc."},
                {"key": "invoice_to", "value": "Direct To Customer"},
                {"key": "sales_rep_name", "value": "Girish Vagele"},
                {"key": "billing_frequency", "value": "Monthly"},
                {"key": "min_commit", "value": 20},
                {"key": "active_user_rate", "value": 14.99},
                {"key": "active_user_overage_rate", "value": 19.99},
                {"key": "committed_mrr", "value": 299.8},
                {"key": "timezone", "value": "(UTC-08:00) Pacific Time (US & Canada)"},
                {"key": "org_currency", "value": "USD"},
                {"key": "owner_email", "value": "bharadwaj.srinivasan@fyle.in"},
                {"key": "org_domain", "value": "testaccount987654321.com"},
                {"key": "prev_expense_process", "value": "Email and Spreadsheets"},
                {"key": "user_def", "value": ">= 1 expense"},
                {"key": "billing_currency", "value": "USD"},
                {"key": "onboarding_stage", "value": "Live"},
            ],

            "custom_value_dimensions": [],

            "custom_event_dimensions":
            [
                {"key": "kickoff_completed_date", "value": new Date("15-Feb-2026").getTime()},
                {"key": "contract_start_date", "value": new Date("01-Feb-2026").getTime()},
                {"key": "contract_end_date", "value": new Date("31-Jan-2027").getTime()},
            ],
        }
    ];

    if(await postRecordsToFS(record_container) < 0)
    {
        console.log("Error posting records to Freshsuccess !!!");
    }
    else
    {
        console.log("Records posted to Freshsuccess successfully !!!");
    }
}


async function test_fs_post_contacts()
{
    var record_container =
    [
        {
            "account_id": "ortst9876543210",
            "email": "bharadwaj.srinivasan001@fyle.in",
            "role": "User",
            "user_id": "user_123456789",
            "is_active": true,        
        },
        {
            "account_id": "ortst9876543210",
            "email": "bharadwaj.srinivasan002@fyle.in",
            "role": "Spender",
            "user_id": "user_987654321",
            "is_active": true,        
        },
    ];

    if(await postContactsToFS(record_container) < 0)
    {
        console.log("Error posting records to Freshsuccess !!!");
    }
    else
    {
        console.log("Records posted to Freshsuccess successfully !!!");
    }
    
}


async function test_fs_remove_csm_mapping()
{
    var account_id = "ortst9876543210";
    var csm_email = "bharadwaj.srinivasan@fyle.in";

    if(await removeCSMMappingfromFS(account_id, csm_email) < 0)
    {
        console.log("Error deleting CSM mapping from Freshsuccess !!!");
    }
    else
    {
        console.log("CSM mapping removed from Freshsuccess successfully !!!");
    }
}


async function test_fs()
{
    if(process.env.RUN_TEST_FS_GET_ACCOUNTS === "true") await test_fs_get_accounts();
    if(process.env.RUN_TEST_FS_LOCATE_ORG === "true") await test_fs_locate_org();
    if(process.env.RUN_TEST_FS_READ_BILLING === "true") await test_fs_read_billing();
    if(process.env.RUN_TEST_FS_GET_METRICS === "true") await test_fs_get_metrics();
    if(process.env.RUN_TEST_FS_GET_CONTACTS === "true") await test_fs_get_contacts();
    if(process.env.RUN_TEST_FS_POST_RECORDS === "true") await test_fs_post_accounts();
    if(process.env.RUN_TEST_FS_POST_CONTACTS === "true") await test_fs_post_contacts();
    if(process.env.RUN_TEST_FS_REMOVE_CSM_MAPPING === "true") await test_fs_remove_csm_mapping();
}


module.exports = 
{
    test_fs
};

