const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");
const { fetchFreshdeskData, postFreshdeskData, putFreshdeskData } = require('./fd_common');


// Freshdesk Company class 
class fd_company
{
    constructor()
    {
      _initCompany(this);
    }

    getCompanies()
    {
        return _getCompanies(this);
    }

    getCompanyName(comp_id)
    {
        return _getCompanyName(this, comp_id);
    }

    getCSM(comp_id)
    {
        return _getCSM(this, comp_id);
    }

    getFDCompanyID(org_id)
    {
        return _getFDCompanyID(this, org_id);
    }

    getFDOrgID(comp_id)
    {
        return _getFDOrgID(this, comp_id);
    }

    getFDTier(comp_id)
    {
        return _getFDTier(this, comp_id);
    }

    getFDSource(comp_id)
    {
        return _getFDSource(this, comp_id);
    }

    getFDPartner(comp_id)
    {
        return _getFDPartner(this, comp_id);
    }

    updateAccountName(org_id, account_name)
    {
        return _updateAccountName(this, org_id, account_name);
    }

}


/* 
Function: _initCompany
Purpose: Initializes the Freshdesk 'company' functionality
Inputs: company instance
Output: 0 on success, -1 on failure
*/
function _initCompany(company)
{
    // Initialize an array to store the company list
    company.company_list = [];

    // Initialize number of companies
    company.num_companies = 0;

    // Nothing else to do, return success
    return 0;
}



/* 
Function: _getCompanies
Purpose: Gets the list of all companies from Freshdesk
Inputs: company instance
Output: List of companies stored in company.company_list[]. Returns 0 on success, -1 on failure
*/
async function _getCompanies(company)
{
    // URL path for fetching companies
    var path = "companies";

    // Initialize the page and record count
    var page = process.env.FRESHDESK_START_PAGE || 1;
    const per_page = process.env.FRESHDESK_MAX_COMPANIES_PER_PAGE || 100;
    var link = "";

    do
    {
        try
        {
            // Fetch data for the current page
            const {headers,data} = await fetchFreshdeskData
            ({
                path: path,
                current_page: page,
                per_page: per_page
            });

            // Check if we have a link header for pagination
            link = headers.get("link");
            link = (link   ?? "").toString().trim();

            // Initialize loop counters 
            var i = 0, j = 0;  

            // Load all accounts received in this response to the account_list []
            for(i = 0; i < data.length; i++)
            {
                var domain_list = "";
                for(var j = 0; j < data[i].domains.length; j++) domain_list = domain_list + data[i].domains[j] + ";";
                var company_info = 
                {
                    "id": data[i]["id"] ? data[i]["id"] : "",
                    "name": data[i]["name"] ? data[i]["name"] : "",
                    "arr": data[i]["custom_fields"] && data[i]["custom_fields"]["arrrevenue"] ? data[i]["custom_fields"]["arrrevenue"] : "",
                    "description": data[i]["description"] ? data[i]["description"] : "",
                    "csm": data[i]["custom_fields"] && data[i]["custom_fields"]["csm"] ? data[i]["custom_fields"]["csm"] : "",
                    "domains": data[i]["domains"] ? data[i]["domains"] : "",
                    "org_id": data[i]["custom_fields"] && data[i]["custom_fields"]["org_id"] ? data[i]["custom_fields"]["org_id"] : "",
                    "account_tier": data[i]["account_tier"] ? data[i]["account_tier"] : "",
                    "arr": data[i]["custom_fields"] && data[i]["custom_fields"]["arrrevenue"] ? data[i]["custom_fields"]["arrrevenue"] : "",
                    "source": data[i]["custom_fields"] && data[i]["custom_fields"]["source"] ? data[i]["custom_fields"]["source"] : "",
                    "partner": data[i]["custom_fields"] && data[i]["custom_fields"]["partner"] ? data[i]["custom_fields"]["partner"] : "",
                };

                company.company_list.push(company_info);

                // Increment counter
                company.num_companies++
            }

            if(link)
            {
                page++;
            }
    /*
            if((page % 5) == 0)
            {
                common.statusMessage(arguments.callee.name, "Processing page: " + page + ", companies processed: " + company.num_companies);
            }
    */
            // set a sleep here for 100 ms so that we don't exceed the throttle
            common.sleep(100);
        }
        catch(e)
        {
            common.statusMessage(arguments.callee.name, "Failed to get list of companies. Error:" + e.message);
            return -1;
        }

    }while(link);

    common.statusMessage(arguments.callee.name, "Successfully fetched companies. Number of companies = "+ company.num_companies);

    return 0;
}




/* 
Function: _getCompanyName
Purpose: Returns the company name associated with the company id passed in. Pre-requisite: getCompanies() to be run prior
Inputs: company instance, company id (string)
Output: company name (string)
*/
function _getCompanyName(company, comp_id)
{
    var i = 0;
    var ret = "";

    // Sanity check
    if(company.num_companies == 0)
    {
        common.statusMessage(arguments.callee.name, "No Companies to read, possibly getCompanies() not called ?");
        return ret;
    }

    // Loop through the company list to find the matching company id and return the company name
    for(i = 0; i < company.num_companies; i++)
    {
        if(company.company_list[i].id == comp_id)
        {
            ret = company.company_list[i].name;
            break;
        }
    }

    return ret;
}



/* 
Function: _getCSM
Purpose: Returns the CSM associated with the company id passed in. Pre-requisite: getCompanies() to be run prior
Inputs: company instance, company id (string)
Output: CSM (string)
*/
function _getCSM(company, comp_id)
{
    var i = 0;
    var ret = "";

    // Sanity check
    if(company.num_companies == 0)
    {
        common.statusMessage(arguments.callee.name, "No Companies to read, possibly getCompanies() not called ?");
        return ret;
    }

    // Loop through the company list to find the matching company id and return the CSM
    for(i = 0; i < company.num_companies; i++)
    {
        if(company.company_list[i].id == comp_id)
        {
            ret = company.company_list[i].csm;
            break;
        }
    }

    return ret;
}



/* 
Function: _getFDCompanyID
Purpose: Returns the Freshdesk company ID associated with the org id passed in. Pre-requisite: getCompanies() to be run prior
Inputs: company instance, company id (string)
Output: company name (string)
*/
function _getFDCompanyID(company, org_id)
{
    var i = 0;
    var ret = "";

    // Sanity check
    if(company.num_companies == 0)
    {
        common.statusMessage(arguments.callee.name, "No Companies to read, possibly getCompanies() not called ?");
        return ret;
    }

    // Loop through the company list to find the matching org id and return the Freshdesk company id
    for(i = 0; i < company.num_companies; i++)
    {
        if(company.company_list[i]["org_id"] == org_id)
        {
            ret = company.company_list[i].id;
            break;
        }
    }

    return ret;
}




/* 
Function: _getFDOrgID
Purpose: Returns the Org ID associated with the Freshdesk Company id passed in. Pre-requisite: getCompanies() to be run prior
Inputs: company instance, org id (string)
Output: Org name (string)
*/
function _getFDOrgID(company, comp_id)
{
    var i = 0;
    var ret = "";

    // Sanity check
    if(company.num_companies == 0)
    {
        common.statusMessage(arguments.callee.name, "No Companies to read, possibly getCompanies() not called ?");
        return ret;
    }

    // Loop through the company list to find the matching Freshdesk company id and return the org id
    for(i = 0; i < company.num_companies; i++)
    {
        if(company.company_list[i]["id"] == comp_id)
        {
            ret = company.company_list[i].org_id;
            break;
        }
    }

    return ret;
}



/* 
Function: _getFDTier
Purpose: Returns the Tier associated with the Freshdesk Company id passed in. Pre-requisite: getCompanies() to be run prior
Inputs: company instance, org id (string)
Output: Tier (string)
*/
function _getFDTier(company, comp_id)
{
    var i = 0;
    var ret = "";

    // Sanity check
    if(company.num_companies == 0)
    {
        common.statusMessage(arguments.callee.name, "No Companies to read, possibly getCompanies() not called ?");
        return ret;
    }

    // Loop through the company list to find the matching Freshdesk company id and return the Tier
    for(i = 0; i < company.num_companies; i++)
    {
        if(company.company_list[i]["id"] == comp_id)
        {
            ret = company.company_list[i].account_tier;
            break;
        }
    }

    return ret;
}



/* 
Function: _getFDSource
Purpose: Returns the Source associated with the Freshdesk Company id passed in. Pre-requisite: getCompanies() to be run prior
Inputs: company instance, org id (string)
Output: Source (string)
*/
function _getFDSource(company, comp_id)
{
    var i = 0;
    var ret = "";

    // Sanity check
    if(company.num_companies == 0)
    {
        common.statusMessage(arguments.callee.name, "No Companies to read, possibly getCompanies() not called ?");
        return ret;
    }

    // Loop through the company list to find the matching Freshdesk company id and return the Source
    for(i = 0; i < company.num_companies; i++)
    {
        if(company.company_list[i]["id"] == comp_id)
        {
            ret = company.company_list[i].source;
            break;
        }
    }

    return ret;
}



/* 
Function: _getFDPartner
Purpose: Returns the Partner associated with the Freshdesk Company id passed in. Pre-requisite: getCompanies() to be run prior
Inputs: company instance, org id (string)
Output: Source (string)
*/
function _getFDPartner(company, comp_id)
{
    var i = 0;
    var ret = "";

    // Sanity check
    if(company.num_companies == 0)
    {
        common.statusMessage(arguments.callee.name, "No Companies to read, possibly getCompanies() not called ?");
        return ret;
    }

    // Loop through the company list to find the matching Freshdesk company id and return the Partner
    for(i = 0; i < company.num_companies; i++)
    {
        if(company.company_list[i]["id"] == comp_id)
        {
            ret = company.company_list[i].partner;
            break;
        }
    }

    return ret;
}



/* 
Function: _updateAccountName
Purpose: Updates the  Account Name for the provided company on Freshdesk with the provided inputs. Pre-requisite: getCompanies() to be run prior
Inputs: company instance, company org ID (string), account_name (string)
Output: 0 on success, -1 on failure
*/
async function _updateAccountName(company, org_id, account_name)
{
    // Sanity check
    if(company.num_companies == 0)
    {
        common.statusMessage(arguments.callee.name, "No Companies to read, possibly getCompanies() not called ?");
        return -1;
    }

    // First get the FD company ID for the org ID passed in
    const fd_company_id = company.getFDCompanyID(org_id);
    if(fd_company_id == "")
    {
        common.statusMessage(arguments.callee.name, "Failed to locate FD ID for org ID:" + org_id);
        return -1;
    }

    // Path to set company data
    const path = "companies/" + fd_company_id;

    // company data to be modified
    var data_load = 
    {
        "name": account_name
    };

    try
    {
        const {headers,data} =  await putFreshdeskData
        ({
            path, 
            data_load
        });

        // check if the account name is updated
        if(data.name != account_name)
        {
            common.statusMessage(arguments.callee.name, "New name: " + data.name + " does not match " + account_name + " for company org ID: " + org_id + ".");
            return -1;
        }
    }
    catch(e)
    {
        common.statusMessage(arguments.callee.name, "Failed to update new name: " + account_name + " for company org ID: " + org_id + "." + e.message);
        return -1;
    }

    common.statusMessage(arguments.callee.name, "Successfully updated new name: " + account_name + " for company org ID: " + org_id + ".");

    return 0;
}





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/* 
Function: createNewCompanyonFD
Purpose: Creates a new company on Freshdesk with the provided inputs
Inputs: company_details structure containing company name (string), company domain (array of strings), company org ID (string), csm (string), account_tier (string), arr (number)
Output: 0 on success, -1 on failure; also company_details.id is updated with the id of the created company
*/
async function createNewCompanyonFD(company_details)
{
    const path = "companies";

    const data_load = 
    {
        "name": company_details.crm_account_id,
        "domains": company_details.org_domain,
        "account_tier": common.escapeHtml(company_details.account_tier),
        "custom_fields":
        {
            "org_id": company_details.org_id,
            "csm": company_details.csm_name,
            "arrrevenue": company_details.arr,
            "source": company_details.source,
            "partner": company_details.partner,
        }
    };

    try
    {
        const {headers,data} =  await postFreshdeskData
        ({
            path, 
            data_load
        });

        company_details.id = data.id;
    }
    catch(e)
    {
        common.statusMessage(arguments.callee.name, "Failed to create new company. Error: " + e.message);
        return -1;
    }

    common.statusMessage(arguments.callee.name, "Successfully created new company with ID: " + company_details.id);

    return 0;
}




// Exporting the class and other functions
module.exports = 
{
    fd_company,
    createNewCompanyonFD
};
