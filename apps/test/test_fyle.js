const { formatInTimeZone } = require("date-fns-tz");
const { fyle_account } = require("@fyle-ops/fyle_api");
const mime = require("mime-types");
const fs = require("fs/promises");
const path = require("path");
const common = require("@fyle-ops/common");


async function test_fyle_api_auth()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();
    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    console.log("Fyle API authentication successful !!!");
    await fyle_acc.auth.getClusterEndpoint();
    console.log("Fyle API cluster endpoint retrieval successful !!!");
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Fyle API profile details retrieval successful !!!");
}


async function test_fyle_api_get_categories()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    await fyle_acc.category.getCategories();
    console.log("Categories retrieved successfully !!!");
}


async function test_fyle_api_get_projects()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    await fyle_acc.project.getProjects();
    console.log("Projects retrieved successfully !!!");
}



async function test_fyle_api_get_employees()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    await fyle_acc.employee.getEmployees();
    console.log("Employees retrieved successfully !!!");
}



async function test_fyle_api_get_departments()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    await fyle_acc.department.getDepartments();
    console.log("Departments retrieved successfully !!!");
}



async function test_fyle_api_get_expenses()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    var states = ["COMPLETE", "APPROVER_PENDING", "APPROVED", "PAYMENT_PROCESSING", "PAYMENT_PENDING", "PAID"];
    var users = ["usyXAERqjQGX", "usxGgLmlhGIn", "us08ojgOHURE", "ushhTRDSOLsw", "usFKjFhQxoaw", "usD2ChrJOftx", "usEcLMSeAEaW"];
    var event = "created_at";
    var after = "01-Jan-2025";
    var before = "31-Dec-2025";
    var start_date_str = formatInTimeZone(new Date(after), "UTC", "yyyy-MM-dd'T'HH:mm:ssXXX"); 
    var end_date_str = formatInTimeZone(new Date(before), "UTC", "yyyy-MM-dd'T'HH:mm:ssXXX"); 

    await fyle_acc.expense.getExpenses(users, states, event, start_date_str, end_date_str);
    console.log("Expenses retrieved successfully !!!");
}


async function test_fyle_api_get_expense_fields()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    await fyle_acc.expense_field.getExpenseFields();
    console.log("Expense fields retrieved successfully !!!");
}



async function test_fyle_api_get_named_expense_field()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    var ret = {};
    const field_name = "Project";
    await fyle_acc.expense_field.getNamedExpenseField(field_name, ret);
    console.log("Named expense field " + field_name + " retrieved successfully !!!");
    console.log("Expense Field details for " + field_name + " :" + JSON.stringify(ret.data));
}


async function test_fyle_api_set_expense_field()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    var ret = {};
    const field_name = "Onward Travel Class";
    await fyle_acc.expense_field.getNamedExpenseField(field_name, ret);
    console.log("Named expense field " + field_name + " retrieved successfully !!!");
    console.log("Expense Field details for " + field_name + " :" + JSON.stringify(ret.data));
    
    var id = ret.data.id;
    var new_field_name = "Onward Travel Class New";
    var type = ret.data.type;
    var options = ["Economy", "Premium Economy", "Business", "First", "Other"];
    var default_value = "Business";
    var is_enabled = true;
    var is_mandatory = true;
    await fyle_acc.expense_field.setExpenseField(id, new_field_name, type, options, default_value, is_enabled, is_mandatory);
    console.log("Expense fields updated successfully !!!");
}



async function test_fyle_api_get_receipt_list()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    var states = ["COMPLETE", "APPROVER_PENDING", "APPROVED", "PAYMENT_PROCESSING", "PAYMENT_PENDING", "PAID"];
    var users = ["usyXAERqjQGX", "usxGgLmlhGIn", "us08ojgOHURE", "ushhTRDSOLsw", "usFKjFhQxoaw", "usD2ChrJOftx", "usEcLMSeAEaW"];
    var event = "created_at";
    var after = "01-Jan-2025";
    var before = "31-Dec-2025";
    var start_date_str = formatInTimeZone(new Date(after), "UTC", "yyyy-MM-dd'T'HH:mm:ssXXX"); 
    var end_date_str = formatInTimeZone(new Date(before), "UTC", "yyyy-MM-dd'T'HH:mm:ssXXX"); 

    await fyle_acc.expense.getExpenses(users, states, event, start_date_str, end_date_str);
    console.log("Expenses retrieved successfully !!!");

    await fyle_acc.receipt.getReceiptList();
    console.log("Receipts retrieved successfully !!!");
}



async function test_fyle_api_get_receipt_links()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    var states = ["COMPLETE", "APPROVER_PENDING", "APPROVED", "PAYMENT_PROCESSING", "PAYMENT_PENDING", "PAID"];
    var users = ["usyXAERqjQGX", "usxGgLmlhGIn", "us08ojgOHURE", "ushhTRDSOLsw", "usFKjFhQxoaw", "usD2ChrJOftx", "usEcLMSeAEaW"];
    var event = "created_at";
    var after = "01-Jan-2025";
    var before = "31-Dec-2025";
    var start_date_str = formatInTimeZone(new Date(after), "UTC", "yyyy-MM-dd'T'HH:mm:ssXXX"); 
    var end_date_str = formatInTimeZone(new Date(before), "UTC", "yyyy-MM-dd'T'HH:mm:ssXXX"); 

    await fyle_acc.expense.getExpenses(users, states, event, start_date_str, end_date_str);
    console.log("Expenses retrieved successfully !!!");

    await fyle_acc.receipt.getReceiptList();
    console.log("Receipts retrieved successfully !!!");

    await fyle_acc.receipt.getReceiptLinks();
    console.log("Receipt links retrieved successfully !!!");
}




async function test_fyle_api_get_receipt()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    var states = ["COMPLETE", "APPROVER_PENDING", "APPROVED", "PAYMENT_PROCESSING", "PAYMENT_PENDING", "PAID"];
    var users = ["usyXAERqjQGX", "usxGgLmlhGIn", "us08ojgOHURE", "ushhTRDSOLsw", "usFKjFhQxoaw", "usD2ChrJOftx", "usEcLMSeAEaW"];
    var event = "created_at";
    var after = "01-Jan-2025";
    var before = "31-Dec-2025";
    var start_date_str = formatInTimeZone(new Date(after), "UTC", "yyyy-MM-dd'T'HH:mm:ssXXX"); 
    var end_date_str = formatInTimeZone(new Date(before), "UTC", "yyyy-MM-dd'T'HH:mm:ssXXX"); 

    await fyle_acc.expense.getExpenses(users, states, event, start_date_str, end_date_str);
    console.log("Expenses retrieved successfully !!!");

    await fyle_acc.receipt.getReceiptList();
    console.log("Receipts retrieved successfully !!!");

    var receipt_id = "fib4h01PgYUA";
    await fyle_acc.receipt.getReceiptFile(receipt_id);
    console.log("Receipt File for: " + receipt_id + " retrieved successfully !!!");
}



async function test_fyle_api_get_card_transactions()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    var event = "created_at";
    var after = "01-Jan-2025";
    //var before = "28-Feb-2026";
    var before = null;
    var start_date_str = formatInTimeZone(new Date(after), "UTC", "yyyy-MM-dd'T'HH:mm:ssXXX"); 
    //var end_date_str = formatInTimeZone(new Date(before), "UTC", "yyyy-MM-dd'T'HH:mm:ssXXX"); 
    var end_date_str = null;

    await fyle_acc.card_transaction.getCardTransactions(event, start_date_str, end_date_str);
    console.log("Card transactions retrieved successfully !!!");
}



async function test_fyle_api_get_select_card_transactions()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    var transaction_list = 
    [
        "btxntvnJZRvQIz",
        "btxn1MpYfYtzZL",
        "btxnCX0JSDgmB5",
        "btxnCIWUzFuYSd",
        "btxnDrSJCmHeeX",
        "btxnje3q6GZujP",
        "btxnTqDu9WfZqz",
        "btxnZ30HoDvNvD",
        "btxn9u60JNQHs3",
        "btxnkhHBZBgVte",
        "btxnhjsM5WNYpk",
        "btxn5d5MHHaJFX",
        "btxnplc8JFUUPP",
        "btxnytUP76IEAd",
        "btxndNN2hySdnv",
        "btxnaqhLHa9jQM",
        "btxnlWcNSCAphS",
        "btxnkNTFteTCFT",
        "btxnQr0aqPPmPl"
    ];

    const ret = await fyle_acc.card_transaction.getSelectCardTransactions(transaction_list);
    console.log("Card transactions retrieved successfully !!!");
}



async function test_fyle_api_create_card_transaction()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    var card_transaction = 
    {
        id: "",
        amount: 47.51,
        currency: 'USD',
        spent_at: '2025-09-01T13:14:54.804+00:00',
        post_date: '2025-09-01T13:14:54.804+00:00',
        description: 'Team lunch',
        foreign_currency: 'GBP',
        foreign_amount: 3768,
        code: 'C1234',
        merchant: 'Uber',
        category: 'Travel',
        mcc: 'sample string',
        corporate_card_id: 'baccKD1GXS7rlB',
        metadata:
        {
            merchant_category_code: 'sample string',
            flight_merchant_category_code: 'sample string',
            flight_supplier_name: 'sample string',
            flight_travel_agency_name: 'sample string',
            flight_ticket_number: 'sample string',
            flight_total_fare: 468.2923,
            flight_travel_date: '2020-07-03T18:19:31.193Z',
            flight_service_class: 'sample string',
            flight_carrier_code: 'sample string',
            flight_fare_base_code: 'sample string',
            flight_trip_leg_number: 'sample string',
            hotel_merchant_category_code: 'sample string',
            hotel_supplier_name: 'sample string',
            hotel_checked_in_at: '2020-07-03T18:19:31.193Z',
            hotel_nights: 5,
            hotel_checked_out_at: '2020-07-03T18:19:31.193Z',
            hotel_country: 'sample string',
            hotel_city: 'sample string',
            hotel_total_fare: 468.2923,
            fleet_product_merchant_category_code: 'sample string',
            fleet_product_supplier_name: 'sample string',
            fleet_service_merchant_category_code: 'sample string',
            fleet_service_supplier_name: 'sample string',
            car_rental_merchant_category_code: 'sample string',
            car_rental_supplier_name: 'sample string',
            car_rental_started_at: '2020-07-03T18:19:31.193Z',
            car_rental_days: 5,
            car_rental_ended_at: '2020-07-03T18:19:31.193Z',
            general_ticket_issued_at: '2020-07-03T18:19:31.193Z',
            general_ticket_number: 'sample string',
            general_issuing_carrier: 'sample string',
            general_travel_agency_name: 'sample string',
            general_travel_agency_code: 'sample string',
            general_ticket_total_fare: 468.2923,
            general_ticket_total_tax: 468.2923,
            merchant_address: 'sample text'
        }        
    }

    await fyle_acc.card_transaction.createCardTransaction(card_transaction);
    console.log("Card transaction created successfully with id: " + card_transaction.id + " !!!");
}



async function test_fyle_api_create_negative_card_transaction()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    var card_transaction = 
    {
        id: "",
        amount: -23.46,
        currency: 'USD',
        spent_at: '2025-12-01T13:14:54.804+00:00',
        post_date: '2025-12-01T13:14:54.804+00:00',
        description: 'CORP ONLINE PAYMENT - THANK YOU',
        foreign_currency: 'GBP',
        foreign_amount: 3768,
        code: 'C1234',
        merchant: 'Uber',
        category: 'Travel',
        mcc: 'sample string',
        corporate_card_id: 'baccKD1GXS7rlB',
        metadata:
        {
            merchant_category_code: 'sample string',
            flight_merchant_category_code: 'sample string',
            flight_supplier_name: 'sample string',
            flight_travel_agency_name: 'sample string',
            flight_ticket_number: 'sample string',
            flight_total_fare: 468.2923,
            flight_travel_date: '2020-07-03T18:19:31.193Z',
            flight_service_class: 'sample string',
            flight_carrier_code: 'sample string',
            flight_fare_base_code: 'sample string',
            flight_trip_leg_number: 'sample string',
            hotel_merchant_category_code: 'sample string',
            hotel_supplier_name: 'sample string',
            hotel_checked_in_at: '2020-07-03T18:19:31.193Z',
            hotel_nights: 5,
            hotel_checked_out_at: '2020-07-03T18:19:31.193Z',
            hotel_country: 'sample string',
            hotel_city: 'sample string',
            hotel_total_fare: 468.2923,
            fleet_product_merchant_category_code: 'sample string',
            fleet_product_supplier_name: 'sample string',
            fleet_service_merchant_category_code: 'sample string',
            fleet_service_supplier_name: 'sample string',
            car_rental_merchant_category_code: 'sample string',
            car_rental_supplier_name: 'sample string',
            car_rental_started_at: '2020-07-03T18:19:31.193Z',
            car_rental_days: 5,
            car_rental_ended_at: '2020-07-03T18:19:31.193Z',
            general_ticket_issued_at: '2020-07-03T18:19:31.193Z',
            general_ticket_number: 'sample string',
            general_issuing_carrier: 'sample string',
            general_travel_agency_name: 'sample string',
            general_travel_agency_code: 'sample string',
            general_ticket_total_fare: 468.2923,
            general_ticket_total_tax: 468.2923,
            merchant_address: 'sample text'
        }        
    }

    await fyle_acc.card_transaction.createCardTransaction(card_transaction);
    console.log("Card transaction created successfully with id: " + card_transaction.id + " !!!");
}



async function test_fyle_api_ignore_card_transactions()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    var card_transaction_ids = ["btxntvnJZRvQIz"];
    await fyle_acc.card_transaction.ignoreCardTransactions(card_transaction_ids);
    console.log("Card transactions ignored successfully for ids: " + card_transaction_ids + " !!!");
}


async function test_fyle_api_undo_ignore_card_transactions()
{
    // Account details - org ID: "or8TuR1VLwUj", org name: "Training Account", user email: "ashwathi.vinod@fyle.in"
    var client_id_str = "tpagISVKxnQMr";
    var client_secret_str = "zJYzCG9O4J";
    var refresh_token_str = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Mzk4NTgxMzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3UzYnVRdFphdGIxXCIiLCJ0cGFfaWQiOiJcInRwYWdJU1ZLeG5RTXJcIiIsInRwYV9uYW1lIjoiXCJDYXJkIFRyYW5zYWN0aW8uLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vaW4xLmZ5bGVocS5jb21cIiIsImV4cCI6MjA1NTIxODEzMX0.VPNQ9P93kihD03p3-j_npcidd3TywOQ_6JAhXaZe6cQ";

    const fyle_acc = new fyle_account();

    await fyle_acc.auth.getAccessToken(client_id_str, client_secret_str, refresh_token_str);
    await fyle_acc.auth.getClusterEndpoint();
    await fyle_acc.auth.validateClusterEndpoint();
    console.log("Authentication successful !!!");

    var card_transaction_ids = ["btxntvnJZRvQIz"];
    await fyle_acc.card_transaction.undoIgnoreCardTransactions(card_transaction_ids);
    console.log("Card transactions undo ignore successfully for ids: " + card_transaction_ids + " !!!");
}


async function test_fyle_api()
{
    if(process.env.RUN_TEST_FYLE_API_AUTH === "true") await test_fyle_api_auth();
    if(process.env.RUN_TEST_FYLE_API_GET_CATEGORIES === "true") await test_fyle_api_get_categories();
    if(process.env.RUN_TEST_FYLE_API_GET_PROJECTS === "true") await test_fyle_api_get_projects();
    if(process.env.RUN_TEST_FYLE_API_GET_EMPLOYEES === "true") await test_fyle_api_get_employees();
    if(process.env.RUN_TEST_FYLE_API_GET_DEPARTMENTS === "true") await test_fyle_api_get_departments();
    if(process.env.RUN_TEST_FYLE_API_GET_EXPENSES === "true") await test_fyle_api_get_expenses();
    if(process.env.RUN_TEST_FYLE_API_GET_EXPENSE_FIELDS === "true") await test_fyle_api_get_expense_fields();
    if(process.env.RUN_TEST_FYLE_API_GET_NAMED_EXPENSE_FIELDS === "true") await test_fyle_api_get_named_expense_field();
    if(process.env.RUN_TEST_FYLE_API_SET_EXPENSE_FIELD === "true") await test_fyle_api_set_expense_field();
    if(process.env.RUN_TEST_FYLE_API_GET_RECEIPT_LIST === "true") await test_fyle_api_get_receipt_list();
    if(process.env.RUN_TEST_FYLE_API_GET_RECEIPT_LINKS === "true") await test_fyle_api_get_receipt_links();
    if(process.env.RUN_TEST_FYLE_API_GET_RECEIPT === "true") await test_fyle_api_get_receipt();
    if(process.env.RUN_TEST_FYLE_API_GET_CARD_TRANSACTIONS === "true") await test_fyle_api_get_card_transactions();
    if(process.env.RUN_TEST_FYLE_API_GET_SELECT_CARD_TRANSACTIONS === "true") await test_fyle_api_get_select_card_transactions();
    if(process.env.RUN_TEST_FYLE_API_CREATE_CARD_TRANSACTION === "true") await test_fyle_api_create_card_transaction();
    if(process.env.RUN_TEST_FYLE_API_CREATE_NEGATIVE_CARD_TRANSACTION === "true") await test_fyle_api_create_negative_card_transaction();
    if(process.env.RUN_TEST_FYLE_API_IGNORE_CARD_TRANSACTIONS === "true") await test_fyle_api_ignore_card_transactions();
    if(process.env.RUN_TEST_FYLE_API_UNDO_IGNORE_CARD_TRANSACTIONS === "true") await test_fyle_api_undo_ignore_card_transactions();
}


// Export the test function
module.exports = 
{
    test_fyle_api
};

