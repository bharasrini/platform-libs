const { formatInTimeZone } = require("date-fns-tz");
const mime = require("mime-types");
const fs = require("fs/promises");
const path = require("path");
const common = require("@fyle-ops/common");
const { fetchFyleData, postFyleData, putFyleData } = require("./fyle_common");


// Class to manage Fyle Receipts
class fyle_receipt
{
    constructor(fyle_acc)
    {
      _initFyleReceipt(this, fyle_acc);
    }

    async getReceiptList()
    {
        return await _getReceiptList(this);    
    }

    async getReceiptLinks()
    {
        return await _getReceiptLinks(this);
    }

    getReceiptObject(receipt_id)
    {
        return _getReceiptObject(this, receipt_id);
    }

    async getReceiptFile(receipt_id)
    {
        return await _getReceiptFile(this, receipt_id);
    }

}



/* 
Function: _initFyleReceipt
Purpose: Initializes the 'fyle_receipt' instance
Pre-requisite: None
Inputs: fyle_receipt instance, fyle_account instance
Output: 0 on success, -1 on failure
*/
function _initFyleReceipt(fyle_receipt, fyle_acc)
{
    // Save a reference to the fyle_account instance in fyle_receipt so that we can access it in the fyle_receipt functions
    fyle_receipt.fyle_acc = fyle_acc;

    fyle_acc.receipts =
    {
        receipt_list: [],
        num_receipts: 0
    };

    return 0;
}



/* 
Function: _getReceiptList
Purpose: Gets the list of expenses corresponding to the expenses in the fyle_acc instance and updates the receipt_list in fyle_acc instance with the receipt information
Pre-requisite: getExpenses() to be invoked to populate the expenses list
Inputs: fyle_receipt instance
Output: 0 on success, -1 on failure
*/
async function _getReceiptList(fyle_receipt)
{
    // Loop variables
    var i = 0, j = 0;

    // Get a reference to the fyle_acc instance
    var fyle_acc = fyle_receipt.fyle_acc;

    if(fyle_acc.expenses.num_expenses == 0)
    {
        common.statusMessage(arguments.callee.name, "No expenses found in fyle_acc instance. Invoking getExpenses() for all expenses created in the last 1 month.");
        var users = null; // all users
        var states = null; // all states
        var event = "created_at";
        var after = common.getNMonthsAgo(new Date(), 1).getTime(); // 1 month ago
        var before = formatInTimeZone(new Date(), "yyyy-MM-dd", "UTC");
        await fyle_acc.expenses.getExpenses(users, states, event, after, before); // Let's try to fetch the expenses here itself and then proceed to fetch the receipts
    }

    // Loop through all expenses and get the receipts
    for(i = 0; i < fyle_acc.expenses.num_expenses; i++)
    {
        var this_expense = fyle_acc.expenses.expense_list[i];

        // Record receipt details for this expense
        for(j = 0; j < this_expense.files.length; j++)
        {
            var type = this_expense.files[j].type;
            if(type == "RECEIPT")
            {
                var expense_id = this_expense.id;
                var content_type = this_expense.files[j].content_type;
                var receipt_id = this_expense.files[j].id;
                var name = this_expense.files[j].name;
                var user_id = this_expense.user_id;
                var org_user_id = this_expense.employee_id;

                //  Let's create an structure to capture the receipt information
                var this_receipt = {};

                // Add the file details as well
                this_receipt.expense_id = expense_id;
                this_receipt.id = receipt_id;
                this_receipt.name = name;
                this_receipt.type = type;
                this_receipt.content_type = content_type;
                this_receipt.user_id = user_id;
                this_receipt.org_user_id = org_user_id;
                this_receipt.download_url = ""; // We will populate this when we fetch the receipt links using the function _getReceiptLinks
                this_receipt.link_issued_at = null; // We will populate this when we fetch the receipt links using the function _getReceiptLinks
                this_receipt.link_expires_at = null; // We will populate this when we fetch the receipt links using the function _getReceiptLinks
                this_receipt.blob = null;  // We will populate this when we fetch the receipt using the function _getReceipt

                // Attach this to the receipt_details list
                fyle_acc.receipts.receipt_list.push(this_receipt);

                // Increment the receipt count
                fyle_acc.receipts.num_receipts++;

            }
        }
        
    }

    common.statusMessage(arguments.callee.name, "Finished retrieving receipt list for all expenses. Total receipts found : " + fyle_acc.receipts.num_receipts);

     // As a test, export the receipts to an Excel file in the downloads folder
    await common.exportExcelFile(fyle_acc.receipts.receipt_list, process.env.DOWNLOADS_FOLDER, "receipts.xlsx", "Receipts");

    return 0;
}




/* 
Function: _getReceiptLinks
Purpose: Generates the receipt links for all receipts in the fyle_acc instance and updates the receipt_list with the link information
Pre-requisite: getReceiptList() to be invoked prior to populate the receipt_list in fyle_acc instance
Inputs: fyle_receipt instance
Output: 0 on success, -1 on failure
*/
async function _getReceiptLinks(fyle_receipt)
{
    var fyle_acc = fyle_receipt.fyle_acc;

    var i = 0, j = 0;
    var processed = 0;
    const limit = 200;

    // Sanity check
    if(fyle_acc.receipts.num_receipts == 0)
    {
        common.statusMessage(arguments.callee.name, "No receipts found. Invoking getReceiptList first.");
        await fyle_receipt.getReceiptList();
    }

    // Get the total count of receipts to be processed
    var total_count = fyle_acc.receipts.receipt_list.length;

    // Process 200 receipt links at a time
    do
    {
        try
        {
            var payload = 
            {
                "data": []
            };

            var num_receipts_this_time = processed + limit > total_count ? total_count - processed : limit;

            // Load all receipt data to the payload
            for(i = processed; i < processed + num_receipts_this_time; i++)
            {
                var this_receipt = 
                {
                    "method": "GET",
                    "path": "/platform/v1/admin/files/download",
                    "query_params": "id="+fyle_acc.receipts.receipt_list[i].id,
                    "org_user_id": fyle_acc.receipts.receipt_list[i].org_user_id
                };
                payload.data.push(this_receipt);
            }

            const {headers,data} = await postFyleData
            ({
                url: fyle_acc.access_params.cluster_domain + "/auth/signed_url/bulk",
                access_token: fyle_acc.access_params.access_token,
                data_load: payload.data
            });

            
            // Load all transactions received in this response back to receipt_list
            for(i = 0; i < data.data.length; i++)
            {
                var signed_url = data.data[i].signed_url;
                const [base_url, queryString] = signed_url.split('?');
                const params = new URLSearchParams(queryString)

                var id = params.has("id") ? params.get("id") : null;

                // Search through the receipt list and attach link information
                for(j = processed; j < processed + num_receipts_this_time; j++)
                {
                    if(id == fyle_acc.receipts.receipt_list[j].id)
                    {
                        // Update the receipt data
                        fyle_acc.receipts.receipt_list[j].download_url = signed_url;
                        fyle_acc.receipts.receipt_list[j].link_issued_at = params.has("X-Fyle-Issued-At") ? params.get("X-Fyle-Issued-At") : null;
                        fyle_acc.receipts.receipt_list[j].link_expires_at = params.has("X-Fyle-Expires-At") ? params.get("X-Fyle-Expires-At") : null;
                        break;
                    }
                }
            }

            // Increment the number of receipts processed
            processed += num_receipts_this_time;
            common.statusMessage(arguments.callee.name, "Retrieved links for " + processed + " receipts so far");
        }
        catch(e)
        {
            common.statusMessage(arguments.callee.name, "Error while retrieving receipt links for receipts from " + processed + " to " + (processed + num_receipts_this_time) + ". Error: " + e.message);
            return -1;
        }

    }while(processed < total_count);

    common.statusMessage(arguments.callee.name, "Finished retrieving links for all receipts. Total receipt links : " + total_count);

    // As a test, export the receipts to an Excel file in the downloads folder
    await common.exportExcelFile(fyle_acc.receipts.receipt_list, process.env.DOWNLOADS_FOLDER, "receipts.xlsx", "Receipts");

    return 0;
}



/* 
Function: _getReceiptObject
Purpose: Gets the named receipt in the fyle org and returns in ret
Pre-requisite: getReceiptList() to be invoked prior to populate the receipt_list in fyle_acc instance
Inputs: fyle_receipt instance, receipt_id - ID of the receipt to be fetched
Output: receipt object on success, null on failure
*/
function _getReceiptObject(fyle_receipt, receipt_id)
{
    var i = 0;
    var fyle_acc = fyle_receipt.fyle_acc;

    for(i = 0; i < fyle_acc.receipts.num_receipts; i++)
    {
        if(fyle_acc.receipts.receipt_list[i].id == receipt_id)
        {
            return fyle_acc.receipts.receipt_list[i];
        }
    }
    return null;
}


/* 
Function: _getReceiptFile
Purpose: Gets the receipt file (blob) for the given receipt_id and updates the blob information in the receipt_list in fyle_acc instance
Pre-requisite: getReceiptList() to be invoked prior to populate the receipt_list in fyle_acc instance
Inputs: fyle_receipt instance, receipt_id - ID of the receipt to be fetched
Output: 0 on success, -1 on failure
*/
async function _getReceiptFile(fyle_receipt, receipt_id)
{
    // Loop variables
    var i = 0;

    var fyle_acc = fyle_receipt.fyle_acc;

    // Get the receipt object for the given receipt_id
    var receipt_obj = fyle_receipt.getReceiptObject(receipt_id);
    if(receipt_obj == null)
    {
        common.statusMessage(arguments.callee.name, "Receipt not found for receipt_id: " + receipt_id);
        return -1;
    }

    // Path to dowload the receipt file
    const url_path = "/platform/v1/admin/files/download";
    var url = new URL(fyle_acc.access_params.cluster_domain + url_path);
    common.statusMessage(arguments.callee.name, "Fyle URL = " + url.toString());

    // Build the 'include' parameter for the API call based on the input parameters
    var include = [{"id": receipt_id}];

    try
    {
        // Fetch data for the receipt from Fyle using the API
        const {headers, data} = await fetchFyleData
        ({
            url: url.toString(),
            access_token: fyle_acc.access_params.access_token,
            offset: null,
            limit: null,
            include: include
        });

        // Get the content type from the response headers to determine if it's a JSON response or a blob (file)
        const contentType = headers.get("content-type") || "application/octet-stream";
        if (contentType.includes("application/json"))
        {
            // It's a JSON response, just ignore it as we are expecting a blob for the receipt
            common.statusMessage(arguments.callee.name, "This is a JSON response:", data);
        }
        else
        {
            // It's a blob
            // Store it to the receipt object in receipt_list in fyle_acc instance
            receipt_obj.blob = data;

            const base_path = process.cwd();
            const output_dir = path.join(base_path, process.env.DOWNLOADS_FOLDER, "blobs");
            await common.createFolder(output_dir);

            const file_ext = mime.extension(receipt_obj.content_type) || "bin";
            await common.createFile(output_dir, receipt_obj.name, file_ext, receipt_obj.blob);
            console.log("Wrote blob to file: " + receipt_obj.name);
        }
    }
    catch(e)
    {
        common.statusMessage(arguments.callee.name, "Failed to get receipt for receipt_id: " + receipt_id + ". Error:" + e.message);
        return -1;
    }

    common.statusMessage(arguments.callee.name, "Successfully retrieved receipt for receipt_id: " + receipt_id);

    return 0;
    
}



// Export the class
module.exports =
{
    fyle_receipt,
};

