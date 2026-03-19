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

    async addProjects(projects_list)
    {
        return await _addProjects(this, projects_list);
    }

    getProjectId(project_name)
    {
        return _getProjectId(this, project_name)
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



/* 
Function: _addProjects
Purpose: Adds new projects to the fyle org and updates the fyle_account.projects structure. 
Pre-requisite: getAccessToken() and getClusterEndpoint() to be invoked prior
Inputs: fyle_account instance, list of projects to be added (each project should have the following structure: {project_name: "name of the project", is_enabled: true/false})
Output: 0 on success, -1 on failure
*/
async function _addProjects(fyle_project, projects_list)
{
    // Get the function name for logging
    const fn = _addProjects.name;
    
    // Initialize counters
    var i = 0;

    // Point to the fyle_account instance
    var fyle_acc = fyle_project.fyle_acc;

    // API endpoint for adding projects
    const url_path = "/platform/v1/admin/projects/bulk";
    var url = new URL(fyle_acc.access_params.cluster_domain + url_path);
    common.statusMessage(fn, "Fyle URL = " , url.toString());

    // Setup the data load
    var data_load = 
    {
        "data": []
    };

    for(i = 0; i < projects_list.length; i++)
    {
        var this_project =
        {
              "name": projects_list[i].name,
              "is_enabled": projects_list[i].is_enabled,
              "category_ids": null, // associate all categories for the project
        };

        // Push this map into data.data[]
        data_load.data.push(this_project);
    }    

    try
    {
        // Fetch data for the current page
        const {headers,data} = await postFyleData
        ({
            url: url.toString(),
            access_token: fyle_acc.access_params.access_token,
            data_load: data_load,
        });
    }
    catch(e)
    {
        common.statusMessage(fn, "Failed to create projects. Error: " , e.message);
        return -1;
    }

    common.statusMessage(fn, "Successfully created projects. Total projects created = " , projects_list.length);

    return 0;
    
}


/* 
Function: _getProjectId
Purpose: Gets the project ID for the project name passed in
Pre-requisite: getProjects() to be invoked prior
Inputs: fyle_project instance, project name
Output: Project ID or -1 on failure
*/
function _getProjectId(fyle_project, project_name)
{
    // Get the function name for logging
    const fn = _getProjectId.name;

    // Loop counters
    var i = 0;

    // Lets get the project ID for the given project name from fyle_acc.projects.project_list
    var project_id = -1;

    // Point to the fyle_account instance
    var fyle_acc = fyle_project.fyle_acc;

    for(i = 0; i < fyle_acc.projects.num_projects; i++)
    {
        var this_project_name = fyle_acc.projects.project_list[i].name;
        if(this_project_name === project_name)
        {
            project_id = fyle_acc.projects.project_list[i].id;
            break;
        }
    }

    return project_id;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// EXPORTS /////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Export the class
module.exports =
{
    fyle_project,
};
