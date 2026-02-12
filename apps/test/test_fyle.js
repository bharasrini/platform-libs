const { fyle_auth } = require("@fyle-ops/fyle_api");

async function test_fyle_api_auth()
{
    // Account details - org ID: 
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const auth = new fyle_auth();
    await auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    console.log("Fyle API authentication successful !!!");
    await auth.getClusterEndpoint();
    console.log("Fyle API cluster endpoint retrieval successful !!!");
    await auth.validateClusterEndpoint();
    console.log("Fyle API profile details retrieval successful !!!");
}

async function test_fyle_api()
{
    if(process.env.RUN_TEST_FYLE_API_AUTH === "true") await test_fyle_api_auth();
}


module.exports = 
{
    test_fyle_api
};