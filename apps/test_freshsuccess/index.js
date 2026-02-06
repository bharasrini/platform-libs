require("dotenv").config();

const common = require("@fyle-ops/common");
const { billing_data } = require("@fyle-ops/billing");
const { fs_account } = require("@fyle-ops/freshsuccess");
const { account_mapping } = require("@fyle-ops/account_mapping");


(async () => {
  const account = new fs_account();
  await account.getAccounts();
  await account.getBillingData();
  await account.getInvitedUsersMetrics();
  await account.getVerifiedUsersMetrics();
  console.log("Accounts read successfully !!!");

  const billing = new billing_data();
  await billing.getBillingLinks();
  var test_date = new Date(2024, 8, 15); // 15-Sep-2024
  await billing.getBillingData(test_date);
  console.log("Billing data read successfully !!!");

  const account_map = new account_mapping();
  await account_map.getAccountMappingData();
  console.log("Account mapping data read successfully !!!");

})();