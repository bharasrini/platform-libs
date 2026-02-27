const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");
const { fetchFyleData, postFyleData, putFyleData } = require("./fyle_common");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Class to manage Fyle projects
class fyle_project
{
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////// CLASS VARIABLES ///////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Reference to the fyle_account instance
    fyle_acc;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////// CLASS FUNCTIONS ///////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    constructor(fyle_acc)
    {
      _initFyleProject(this, fyle_acc);
    }

    async getProjects()
    {
        return await _getProjects(this);
    }
}



/* 
Function: _initFyleProject
Purpose: Initializes the 'fyle_project' instance
Pre-requisite: None
Inputs: fyle_project instance
Output: 0 on success, -1 on failure
*/
function _initFyleProject(fyle_project, fyle_acc)
{
    // Get the function name for logging
    const fn = _initFyleProject.name;

    // Save a reference to the fyle_account instance in fyle_project so that we can access it in the fyle_project functions
    fyle_project.fyle_acc = fyle_acc;

    return 0;
}


/* 
Function: _getProjects
Purpose: Gets the list of projects in the fyle org and stores it in the fyle_account.projects structure. 
Pre-requisite: getAccessToken() and getClusterEndpoint() to be invoked prior
Inputs: fyle_account instance
Output: 0 on success, -1 on failure
*/
async function _getProjects(fyle_project)
{
    // Get the function name for logging
    const fn = _getProjects.name;
    
    // Point to the fyle_account instance
    var fyle_acc = fyle_project.fyle_acc;

    // API endpoint for fetching projects
    const url_path = "/platform/v1/admin/projects";
    var url = new URL(fyle_acc.access_params.cluster_domain + url_path);
    common.statusMessage(fn, "Fyle URL = " , url.toString());

    // Pagination parameters
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

            // Save the overall number of projects we need to read in
            total_count = data.count;

            // Number of projects read in from this response
            var this_count = data.data.length;

            // Load all projects received in this response to fyle_account.projects {}
            var i = 0;
            for(i = 0; i < data.data.length; i++)
            {
                var this_project = data.data[i];
                fyle_acc.projects.project_list.push(this_project);
                fyle_acc.projects.num_projects++;
            }

            common.statusMessage(fn, "Finished processing " , this_count , " projects on page " , page , ", total projects processed = " , fyle_acc.projects.num_projects);

            // If records on the current page were greater or equal to the limit, then increment the offset
            if(this_count >= limit)
            {
                offset += limit;
                page++;
            }
        }
        catch(e)
        {
            common.statusMessage(fn, "Failed to get projects. Error: " , e.message);
            return -1;
        }

    } while(fyle_acc.projects.num_projects < total_count);

    common.statusMessage(fn, "Successfully retrieved projects. Total projects retrieved = " , fyle_acc.projects.num_projects);

    return 0;
    
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// EXPORTS /////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Export the class
module.exports =
{
    fyle_project,
};
