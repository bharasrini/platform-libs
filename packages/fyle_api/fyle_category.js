const common = require("@fyle-ops/common");
const { fetchFyleData, postFyleData, putFyleData } = require("./fyle_common");

class fyle_category
{
    constructor(account)
    {
      _initFyleCategory(this);
    }

}




/* 
Function: _getCategories
Purpose: Gets the list of categories in the fyle org and stores it in the fyle_account.categories structure. 
Pre-requisite: getAccessToken() and getClusterEndpoint() to be invoked prior
Inputs: fyle_account instance
Output: 0 on success, -1 on failure
*/
function _getCategories(fyle_acc)
{
    var limit = 200;
    var offset = 0;
    var total_count = 0;
    var page = 1;

    var options = 
    {
        "method": "get",
        "headers":
        {
          "authorization": "Bearer "+ fyle_acc.access_params.access_token,
          "Content-Type": "application/json",
        },
        "muteHttpExceptions": true,
    };


    do
    {
        var url = fyle_acc.access_params.cluster_domain + "/platform/v1/admin/categories?offset="+offset+"&limit="+limit;

        // Now send the query with the new options
        var response = UrlFetchApp.fetch(url, options); // get api endpoint
        var resp_code = response.getResponseCode();
        var resp_header = response.getHeaders();

        if(CommonUtilities.processHTTPStatus(resp_header, resp_code) < 0)
        {
            CommonUtilities.statusMessage(arguments.callee.name, "Request failed, code = " + resp_code, true, -1);
            return -1;
        }

        var json = response.getContentText();
        var data = JSON.parse(json);

        // Save the overall number of categories we need to read in
        total_count = data.count;

        // Number of categories read in from this response
        var this_count = data.data.length;

        // Load all categories received in this response to fyle_account.categories {}
        for(i = 0; i < data.data.length; i++)
        {
            var this_category = data.data[i];
            fyle_acc.categories.category_list.push(this_category);
            fyle_acc.categories.num_categories++;
        }

        CommonUtilities.statusMessage(arguments.callee.name, "Finished processing " + this_count + " records on page " + page + ", total categories processed = " + fyle_acc.categories.num_categories, true, -1);

        // If records on the current page were greater or equal to the limit, then increment the offset
        if(this_count >= limit)
        {
            offset += limit;
            page++;
        }

    }while(fyle_acc.categories.num_categories < total_count);

    return 0;
    
}


