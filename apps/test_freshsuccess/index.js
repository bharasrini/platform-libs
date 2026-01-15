const { FreshsuccessClient } = require("@fyle-ops/freshsuccess");

(async () => {
  const client = new FreshsuccessClient({
    host: process.env.FRESHSUCCESS_HOST,
    apiKey: process.env.FRESHSUCCESS_API_KEY,
  });

  const accounts = await client.listAllAccounts();
  console.log("Accounts:", accounts.length);
})();

