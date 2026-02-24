const common = require("@fyle-ops/common");

// Importing the CSM mapping from csm_mapping.json
const CSM_MAP = require("../data/csm_mapping.json");


/* 
Function: returnFDCSMNameForEmail
Purpose: Returns the FreshDesk CSM name for the email passed in
Inputs: csm_email
Output: CSM Name or blank if not found
*/
function returnFDCSMNameForEmail(email)
{
    var i = 0;

    for(i = 0; i < CSM_MAP.length; i++)
    {
        if(email == CSM_MAP[i].csm_email_from_fs)
        {
            return CSM_MAP[i].csm_name_from_fd;
        }
    }

    return "";
}


/* 
Function: returnEmailForFDCSMName
Purpose: Returns the email for the FreshDesk CSM name passed in
Inputs: csm_name
Output: CSM Email or blank if not found
*/
function returnEmailForFDCSMName(csm_name)
{
    var i = 0;

    for(i = 0; i < CSM_MAP.length; i++)
    {
        if(csm_name == CSM_MAP[i].csm_name_from_fd)
        {
            return CSM_MAP[i].csm_email_from_fs;
        }
    }

    return "";
}


module.exports =
{
    returnFDCSMNameForEmail,
    returnEmailForFDCSMName
};