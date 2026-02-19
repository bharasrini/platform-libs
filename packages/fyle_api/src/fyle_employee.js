const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");
const { fetchFyleData, postFyleData, putFyleData } = require("./fyle_common");

// Class to manage Fyle employees
class fyle_employee
{
    constructor(fyle_acc)
    {
      _initFyleEmployee(this, fyle_acc);
    }

    async getEmployees()
    {
        return _getEmployees(this);
    }

    getEmployeeName(user_id)
    {
        return _getEmployeeName(this.fyle_acc, user_id);
    }

    getEmployeeEmail(user_id)
    {
        return _getEmployeeEmail(this.fyle_acc, user_id);
    }
}



/* 
Function: _initFyleEmployee
Purpose: Initializes the 'fyle_employee' instance
Pre-requisite: None
Inputs: fyle_employee instance
Output: 0 on success, -1 on failure
*/
function _initFyleEmployee(fyle_employee, fyle_acc)
{
    // Save a reference to the fyle_account instance in fyle_auth so that we can access it in the fyle_auth functions
    fyle_employee.fyle_acc = fyle_acc;

    fyle_acc.employees = 
    {
        employee_list: [],
        num_employees : 0
    };

    return 0;
}


/* 
Function: _getEmployees
Purpose: Gets the list of employees in the fyle org and stores it in the fyle_account.employees structure. 
Pre-requisite: getAccessToken() and getClusterEndpoint() to be invoked prior
Inputs: fyle_account instance
Output: 0 on success, -1 on failure
*/
async function _getEmployees(fyle_employee)
{
    var fyle_acc = fyle_employee.fyle_acc;

    const url_path = "/platform/v1/admin/employees";

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

            // Save the overall number of employees we need to read in
            total_count = data.count;

            // Number of employees read in from this response
            var this_count = data.data.length;

            // Load all employees received in this response to fyle_account.employees {}
            var i = 0;
            for(i = 0; i < data.data.length; i++)
            {
                var this_employee = data.data[i];
                fyle_acc.employees.employee_list.push(this_employee);
                fyle_acc.employees.num_employees++;
            }

            common.statusMessage(arguments.callee.name, "Finished processing " + this_count + " employees on page " + page + ", total employees processed = " + fyle_acc.employees.num_employees);

            // If records on the current page were greater or equal to the limit, then increment the offset
            if(this_count >= limit)
            {
                offset += limit;
                page++;
            }
        }
        catch(e)
        {
            common.statusMessage(arguments.callee.name, "Failed to get employees. Error:" + e.message);
            return -1;
        }

    } while(fyle_acc.employees.num_employees < total_count);

    common.statusMessage(arguments.callee.name, "Successfully retrieved employees. Total employees retrieved = " + fyle_acc.employees.num_employees);

    return 0;
    
}



/* 
Function: _getEmployeeName
Purpose: Gets the employee name for the user id passed in
Pre-requisite: getEmployees() to be invoked prior
Inputs: fyle_account instance, user_id
Output: user name on success, blank otherwise
*/
function _getEmployeeName(fyle_acc, user_id)
{
    var i;

    for(i = 0; i < fyle_acc.employees.num_employees; i++)
    {
        var this_user_id = fyle_acc.employees.employee_list[i].user_id;

        if(this_user_id == user_id)
        {
            var this_user_name = fyle_acc.employees.employee_list[i].user.full_name;
            return this_user_name;
        }
    }

    return "";
}


/* 
Function: _getEmployeeEmail
Purpose: Gets the employee email for the user id passed in
Pre-requisite: getEmployees to be invoked prior
Inputs: fyle_account instance, user_id
Output: user email on success, blank otherwise
*/
function _getEmployeeEmail(fyle_acc, user_id)
{
    var i;

    for(i = 0; i < fyle_acc.employees.num_employees; i++)
    {
        var this_user_id = fyle_acc.employees.employee_list[i].user_id;

        if(this_user_id == user_id)
        {
            var this_user_email = fyle_acc.employees.employee_list[i].user.email;
            return this_user_email;
        }
    }

    return "";
}



// Export the class
module.exports =
{
    fyle_employee,
};
