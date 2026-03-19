const { formatInTimeZone } = require("date-fns-tz");
const mime = require("mime-types");
const fs = require("fs/promises");
const path = require("path");
const common = require("@fyle-ops/common");
const { fetchFyleData, postFyleData, putFyleData } = require("./fyle_common");


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Class to manage Fyle Feature Configurations
class fyle_feature_config
{
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////// CLASS VARIABLES ///////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Reference to the fyle_account instance so that we can access it in the fyle_feature_config functions
    fyle_acc = null;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////// CLASS FUNCTIONS ///////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    constructor(fyle_acc)
    {
      _initFyleFeatureConfig(this, fyle_acc);
    }

    async getFeatureConfig()
    {
        return await _getFeatureConfig(this);    
    }

}



/* 
Function: _initFyleFeatureConfig
Purpose: Initializes the 'fyle_feature_config' instance
Pre-requisite: None
Inputs: fyle_card_transaction instance, fyle_account instance
Output: 0 on success, -1 on failure
*/
function _initFyleFeatureConfig(fyle_feature_config, fyle_acc)
{
    // Get the function name for logging
    const fn = _initFyleFeatureConfig.name;

    // Save a reference to the fyle_account instance so that we can access it in the fyle_feature_config functions
    fyle_feature_config.fyle_acc = fyle_acc;

    // Nothing else to do, return success
    return 0;
}




/* 
Function: _getFeatureConfig
Purpose: Gets the list of feature configurations in the fyle org and stores it in the fyle_account.feature_configs structure. 
Pre-requisite: getAccessToken() and getClusterEndpoint() to be invoked prior
Inputs: fyle_feature_config instance
Output: 0 on success, -1 on failure
*/
async function _getFeatureConfig(fyle_feature_config)
{
    // Get the function name for logging
    const fn = _getFeatureConfig.name;
    
    // Loop variables
    var i = 0;

    // Point back to the fyle_account instance
    var fyle_acc = fyle_feature_config.fyle_acc;

    const url_path = "/platform/v1/admin/feature_configs";

    var url = new URL(fyle_acc.access_params.cluster_domain + url_path);
    common.statusMessage(fn, "Fyle URL = " , url.toString());

    var offset = process.env.FYLE_API_START_OFFSET;
    var limit = process.env.FYLE_API_MAX_ITEMS;
    var total_count = 0;
    var page = 1;

    // Build the 'include' parameter for the API call based on the input parameters
    var include = [];

    // Loop to fetch all feature configurations with pagination. We will keep fetching feature configurations until we have fetched the total number of feature configurations in the org, which is given by the 'count' field in the API response
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
                include: include
            });

            // Save the overall number of feature configurations we need to read in
            total_count = data.count;

            // Number of feature configurations read in from this response
            var this_count = data.data.length;

            // Load all feature configurations received in this response to fyle_account.feature_configs {}
            for(i = 0; i < data.data.length; i++)
            {
                var this_feature_config = data.data[i];
                fyle_acc.feature_configs.feature_config_list.push(this_feature_config);
                fyle_acc.feature_configs.num_feature_configs++;
            }

            common.statusMessage(fn, "Finished processing " , this_count , " feature configurations on page " , page , ", total feature configurations processed = " , fyle_acc.feature_configs.num_feature_configs);

            // If records on the current page were greater or equal to the limit, then increment the offset
            if(this_count >= limit)
            {
                offset += limit;
                page++;
            }
        }
        catch(e)
        {
            common.statusMessage(fn, "Failed to get feature configurations. Error:" , e.message);
            return -1;
        }

    } while(fyle_acc.feature_configs.num_feature_configs < total_count);

    common.statusMessage(fn, "Successfully retrieved feature configurations. Total feature configurations retrieved = " , fyle_acc.feature_configs.num_feature_configs);

    // As a test, export the feature configurations to an Excel file in the downloads folder
    await common.exportToExcelFile(fyle_acc.feature_configs.feature_config_list, process.env.DOWNLOADS_FOLDER, "feature_configs.xlsx", "Feature Configurations");

    return 0;
    
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// EXPORTS /////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Export the class
module.exports =
{
    fyle_feature_config,
};

