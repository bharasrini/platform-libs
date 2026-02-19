const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");
const { fetchFyleData, postFyleData, putFyleData } = require("./fyle_common");

// Class to manage Fyle Departments
class fyle_department
{
    constructor(fyle_acc)
    {
      _initFyleDepartment(this, fyle_acc);
    }

    async getDepartments()
    {
        return _getDepartments(this);
    }

}



/* 
Function: _initFyleDepartment
Purpose: Initializes the 'fyle_department' instance
Pre-requisite: None
Inputs: fyle_department instance
Output: 0 on success, -1 on failure
*/
function _initFyleDepartment(fyle_department, fyle_acc)
{
    // Save a reference to the fyle_account instance in fyle_auth so that we can access it in the fyle_auth functions
    fyle_department.fyle_acc = fyle_acc;

    fyle_acc.departments = 
    {
        department_list: [],
        num_departments : 0
    };

    return 0;
}


/* 
Function: _getDepartments
Purpose: Gets the list of departments in the fyle org and stores it in the fyle_account.departments structure. 
Pre-requisite: getAccessToken() and getClusterEndpoint() to be invoked prior
Inputs: fyle_account instance
Output: 0 on success, -1 on failure
*/
async function _getDepartments(fyle_department)
{
    var fyle_acc = fyle_department.fyle_acc;

    const url_path = "/platform/v1/admin/departments";

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

            // Save the overall number of departments we need to read in
            total_count = data.count;

            // Number of departments read in from this response
            var this_count = data.data.length;

            // Load all departments received in this response to fyle_account.departments {}
            var i = 0;
            for(i = 0; i < data.data.length; i++)
            {
                var this_department = data.data[i];
                fyle_acc.departments.department_list.push(this_department);
                fyle_acc.departments.num_departments++;
            }

            common.statusMessage(arguments.callee.name, "Finished processing " + this_count + " departments on page " + page + ", total departments processed = " + fyle_acc.departments.num_departments);

            // If records on the current page were greater or equal to the limit, then increment the offset
            if(this_count >= limit)
            {
                offset += limit;
                page++;
            }
        }
        catch(e)
        {
            common.statusMessage(arguments.callee.name, "Failed to get departments. Error:" + e.message);
            return -1;
        }

    } while(fyle_acc.departments.num_departments < total_count);

    common.statusMessage(arguments.callee.name, "Successfully retrieved departments. Total departments retrieved = " + fyle_acc.departments.num_departments);

    return 0;
    
}



// Export the class
module.exports =
{
    fyle_department,
};
