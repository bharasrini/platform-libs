const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");
const { fetchFreshdeskData } = require("./fd_common");

/* 
Function: getAssociatedTicketsList
Purpose: Gets the list of all associated tickets from Freshdesk for the ticket whose id is passed in
Inputs: ticket id, list to store Ids of associated tickets
Output: List of associated tickets in list[]. Returns 0 on success, -1 on failure
*/
async function getAssociatedTicketsList(id, list)
{
    // URL path for fetching associated tickets for the given ticket id
    var url_path = "tickets/"+id;

    // Initialize the page and record count
    var page = process.env.FRESHDESK_START_PAGE || 0;
    var per_page = process.env.FRESHDESK_MAX_TICKETS_PER_PAGE || 100;
    var link = "";

    do
    {
        try
        {
            const {headers,data} = await fetchFreshdeskData
            ({
                url_path: url_path,
                current_page: page,
                per_page: per_page
            });

            // Check if we have a link header for pagination
            link = headers.get("link");
            link = (link   ?? "").toString().trim();

            // Initialize loop counters 
            var i = 0;  

            // Read through the responses
            if(data.associated_tickets_list)
            {
                for(var i = 0; i < data.associated_tickets_list.length; i++)
                {
                    list.push(data.associated_tickets_list[i]);
                }
            }

            if(link)
            {
                page++;
            }

            // set a sleep here for 100 ms so that we don't exceed the throttle
            common.sleep(100);

        }
        catch(e)
        {
            common.statusMessage(arguments.callee.name, "Failed to get ticket list for ID: " + id + ". Error:" + e.message);
            return -1;
        }

    }while(link);

    common.statusMessage(arguments.callee.name, "Successfully fetched associated tickets for ID: " + id + ". Total associated tickets: " + list.length);

    return 0;
}


/* 
Function: getAssociationType
Purpose: Returns the association type string associated with the numeric value passed in
Inputs: association type (number)
Output: association type value (string)
*/
function getAssociationType(association_type)
{
    var ret = "";

    switch(association_type)
    {
        case 0:
          ret = "None";
          break;

        case 1: 
          ret = "Parent";
          break;

        case 2: 
          ret = "Child";
          break;

        case 3:
          ret = "Tracker";
          break;

        case 4:
          ret = "Related";
          break;

        default:
          ret = "None";
          break;
    }

    return ret;
}



// Exporting the function
module.exports = 
{
    getAssociatedTicketsList,
    getAssociationType
};
