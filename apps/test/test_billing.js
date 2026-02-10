const { billing_data } = require("@fyle-ops/billing");

async function test_getBillingData()
{
    const billing = new billing_data();
    await billing.getBillingLinks();
    var test_date = new Date(2024, 8, 15); // 15-Sep-2024
    await billing.getBillingData(test_date);
    console.log("Billing data read successfully !!!");
}

async function test_billing()
{
    if(process.env.RUN_TEST_BILLING_DATA === "true") await test_getBillingData();
}


module.exports = 
{
    test_billing
};