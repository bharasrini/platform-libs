const { fyle_account } = require("@fyle-ops/fyle_api");
const common = require("@fyle-ops/common");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function test_fyle_api_get_projects()
{
    // Get function name for logging
    const fn = test_fyle_api_get_projects.name;

    common.start_test(fn);

    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    common.statusMessage(fn,"Authentication successful !!!");

    await fyle_acc.project.getProjects();
    common.statusMessage(fn,"Projects retrieved successfully !!!. Number of projects retrieved: " + fyle_acc.projects.num_projects);

    common.end_test(fn);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function test_fyle_api_projects()
{
    // Get function name for logging
    const fn = test_fyle_api_projects.name;

    common.start_test_suite("Fyle API - Projects");

    if(process.env.RUN_TEST_FYLE_API_GET_PROJECTS === "true") await test_fyle_api_get_projects();

    common.end_test_suite("Fyle API - Projects");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Export the test function
module.exports = 
{
    test_fyle_api_projects
};

