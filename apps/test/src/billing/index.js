const path = require("path");

require("dotenv").config
({
    path: path.resolve(__dirname, "..", "..", "env", ".env.billing"),
    override: true
});



const { test_billing } = require ("./test_billing");

(async () => 
{
    // Billing functions
    if (process.env.RUN_BILLING_TEST === "true") await test_billing();
})();