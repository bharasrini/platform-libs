const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");
const { fetchFyleData, postFyleData, putFyleData } = require("./fyle_common");

// Class to manage Fyle categories
class fyle_category
{
    constructor(fyle_acc)
    {
      _initFyleCategory(this, fyle_acc);
    }

    async getCategories()
    {
        return await _getCategories(this);
    }
}



/* 
Function: _initFyleCategory
Purpose: Initializes the 'fyle_category' instance
Pre-requisite: None
Inputs: fyle_category instance
Output: 0 on success, -1 on failure
*/
function _initFyleCategory(fyle_category, fyle_acc)
{
    // Save a reference to the fyle_account instance in fyle_auth so that we can access it in the fyle_auth functions
    fyle_category.fyle_acc = fyle_acc;

    fyle_acc.categories = 
    {
        category_list: [],
        num_categories : 0
    };

    return 0;
}


/* 
Function: _getCategories
Purpose: Gets the list of categories in the fyle org and stores it in the fyle_account.categories structure. 
Pre-requisite: getAccessToken() and getClusterEndpoint() to be invoked prior
Inputs: fyle_account instance
Output: 0 on success, -1 on failure
*/
async function _getCategories(fyle_category)
{
    var fyle_acc = fyle_category.fyle_acc;

    const url_path = "/platform/v1/admin/categories";

    var url = new URL(fyle_acc.access_params.cluster_domain + url_path);
    common.statusMessage(arguments.callee.name, "Fyle URL = " + url.toString());

    var offset = process.env.FYLE_API_START_OFFSET;
    var limit = process.env.FYLE_API_MAX_ITEMS;
    var total_count = 0;
    var page = 1;

    do
    {
        try
        {
            // Fetch data for the current page
            const {headers,data} = await fetchFyleData
            ({
                url: url.toString(),
                access_token: fyle_acc.access_params.access_token,
                offset: offset,
                limit: limit,
                include: null
            });

            // Save the overall number of categories we need to read in
            total_count = data.count;

            // Number of categories read in from this response
            var this_count = data.data.length;

            // Load all categories received in this response to fyle_account.categories {}
            var i = 0;
            for(i = 0; i < data.data.length; i++)
            {
                var this_category = data.data[i];
                fyle_acc.categories.category_list.push(this_category);
                fyle_acc.categories.num_categories++;
            }

            common.statusMessage(arguments.callee.name, "Finished processing " + this_count + " categories on page " + page + ", total categories processed = " + fyle_acc.categories.num_categories);

            // If records on the current page were greater or equal to the limit, then increment the offset
            if(this_count >= limit)
            {
                offset += limit;
                page++;
            }
        }
        catch(e)
        {
            common.statusMessage(arguments.callee.name, "Failed to get categories. Error:" + e.message);
            return -1;
        }

    } while(fyle_acc.categories.num_categories < total_count);

    common.statusMessage(arguments.callee.name, "Successfully retrieved categories. Total categories retrieved = " + fyle_acc.categories.num_categories);

    return 0;
    
}



// Export the class
module.exports =
{
    fyle_category,
};