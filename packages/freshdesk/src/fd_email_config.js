const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");
const { fetchFreshdeskData } = require('./fd_common');


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Freshdesk Email Config class
class fd_email_config
{
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////// CLASS VARIABLES ///////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Array to store the email config list
    email_config_list = [];

    // Number of email configs
    num_email_configs = 0;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////// CLASS FUNCTIONS ///////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    constructor()
    {
      _initEmailConfigs(this);
    }

    async getEmailConfigs()
    {
        return await _getEmailConfigs(this);
    }

    getEmailConfigID(reply_email)
    {
        return _getEmailConfigID(this, reply_email);
    }

    getEmailConfigIDUsingGroupID(group_id)
    {
        return _getEmailConfigIDUsingGroupID(this, group_id);
    }

}


/* 
Function: _initEmailConfigs
Purpose: Initializes the Freshdesk 'email config' functionality
Inputs: Freshdesk email config instance
Output: 0 on success, -1 on failure
*/
function _initEmailConfigs(email_config)
{
    // Get the function name for logging
    const fn = _initEmailConfigs.name;

    // Nothing else to do, return success
    return 0;
}



/* 
Function: _getEmailConfigs
Purpose: Gets the list of all email configs from Freshdesk
Inputs: email config instance
Output: List of email configs stored in email_config.email_config_list[]. Returns 0 on success, -1 on failure
*/
async function _getEmailConfigs(email_config)
{
    // Get the function name for logging
    const fn = _getEmailConfigs.name;

    // URL path for fetching email configs from Freshdesk API
    var url_path = "email_configs";

    // Initialize the page and record count
    var page = Number(process.env.FRESHDESK_START_PAGE) || 1;
    const per_page = Number(process.env.FRESHDESK_MAX_GROUPS_PER_PAGE) || 100;
    var link = "";

    do
    {
        try
        {
            // Fetch data for the current page
            const {headers,data} = await fetchFreshdeskData
            ({
                url_path: url_path,
                current_page: page,
                per_page: per_page,
                updated_since: null,
                include: null
            });

            // Check if we have a link header for pagination
            link = headers.get("link");
            link = (link   ?? "").toString().trim();

            // Initialize loop counters 
            var i = 0;  

            // Load all email configs received in this response to the email_config_list []
            for(i = 0; i < data.length; i++)
            {
                var email_config_info = 
                {
                    "id": data[i]["id"] ? data[i]["id"] : "",
                    "name": data[i]["name"]? data[i]["name"] : "",
                    "product_id": data[i]["product_id"]? data[i]["product_id"] : "",
                    "to_email": data[i]["to_email"]? data[i]["to_email"] : "",
                    "reply_email": data[i]["reply_email"]? data[i]["reply_email"] : "",
                    "group_id": data[i]["group_id"]? data[i]["group_id"] : "",
                    "primary_role": data[i]["primary_role"]? data[i]["primary_role"] : "",
                    "active": data[i]["active"]? data[i]["active"] : "",
                    "created_at": data[i]["created_at"]? data[i]["created_at"] : "",
                    "updated_at": data[i]["updated_at"]? data[i]["updated_at"] : "",
                };

                email_config.email_config_list.push(email_config_info);

                // Increment counter
                email_config.num_email_configs++;
            }

            if(link)
            {
                page++;
            }
    /*
            if((page % 5) == 0)
            {
                common.statusMessage(fn, "Processing page: ", page, ", email configs processed: ", email_config.num_email_configs);
            }
    */
            // set a sleep here for 100 ms so that we don't exceed the throttle
            common.sleep(100);

        }
        catch(e)
        {
            common.statusMessage(fn, "Failed to get list of email configs. Error:", e.message);
            return -1;
        }        

    }while(link);

    common.statusMessage(fn, "Successfully fetched email configs. Number of email configs = ", email_config.num_email_configs);

    return 0;
}



/* 
Function: _getEmailConfigID
Purpose: Returns the email config id associated with the reply email passed in. Pre-requisite: getEmailConfigs() to be run prior
Inputs: email_config instance, reply email (string)
Output: Email Config ID
*/
function _getEmailConfigID(email_config, reply_email)
{
    var i = 0;
    var ret = 0;

    // Trivial check
    if(email_config.num_email_configs == 0)
    {
        common.statusMessage(arguments.callee.name, "No email configs to read, possibly getEmailConfigs() not called ?");
        return ret;
    }


    for(i = 0; i < email_config.num_email_configs; i++)
    {
        if(email_config.email_config_list[i].reply_email == reply_email)
        {
            ret = email_config.email_config_list[i].id;
            break;
        }
    }

    return ret;
}


/* 
Function: _getEmailConfigIDUsingGroupID
Purpose: Returns the email config id associated with the group_id passed in. Pre-requisite: getEmailConfigs() to be run prior
Inputs: email_config instance, group id (string)
Output: Email Config ID
*/
function _getEmailConfigIDUsingGroupID(email_config, group_id)
{
    var i = 0;
    var ret = 0;

    // Trivial check
    if(email_config.num_email_configs == 0)
    {
        common.statusMessage(arguments.callee.name, "No email configs to read, possibly getEmailConfigs() not called ?");
        return ret;
    }


    for(i = 0; i < email_config.num_email_configs; i++)
    {
        if(email_config.email_config_list[i].group_id == group_id)
        {
            ret = email_config.email_config_list[i].id;
            break;
        }
    }

    return ret;
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// EXPORTS /////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Exporting the class
module.exports = 
{
    fd_email_config
};
