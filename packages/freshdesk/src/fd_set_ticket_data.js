const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");
const { fetchFreshdeskData, postFreshdeskData, putFreshdeskData } = require('./fd_common');

// Importing the ticket field mapping from fd_ticket_field_map.json
const ticket_field_map = require("../data/fd_ticket_field_map.json");


/* 
Function: checkAndSetDataLoad
Purpose: Checks and sets mandatory fields in the data load for setTicketField() to work
Inputs: ticket id, data_load, field_name, field_value, field map (map of all fields with their hierarchy)
Output: 0 on success, -1 on failure
*/
async function checkAndSetDataLoad(ticket_id, field_name, field_value, data_load)
{
    // URL path for the API endpoint to get the list of ticket fields
    var path = "tickets/" + ticket_id.toString();

    // First get the ticket data from Freshdesk for the provided ticket_id to check which mandatory fields are blank and need to be set in the data_load {}
    try
    {
        const {headers,data} = await fetchFreshdeskData
        ({
            path: path
        });

        // Initialize loop counters
        var i = 0;

        // Read through the ticket_field_map to check which mandatory fields are blank in the ticket data and set them in the data_load {} so that we can successfully update the field using setTicketField() routine
        for(i = 0; i < ticket_field_map.length; i++)
        {
            var this_hierarchy = (ticket_field_map[i].hierarchy).toString().trim();
            var this_field_name = ticket_field_map[i].fd_field;
            var this_field_val = ticket_field_map[i].default_value;

            // Set the appropriate fd field for the field_name being passed in
            if(this_field_name == field_name)
            {
                // Check if we have a blank val and the field is mandatory
                if(field_value != "") this_field_val = field_value;

                // Set the appropriate field in the data_load {}
                if(this_hierarchy == "")
                {
                    data_load[this_field_name] = this_field_val;
                }
                else
                {
                    if(!data_load[this_hierarchy])
                    {
                        data_load[this_hierarchy] = {};
                    }
                    data_load[this_hierarchy][this_field_name] = this_field_val;                
                }
                common.statusMessage(arguments.callee.name, "Successfully set value: " +  this_field_val + " for field_name: " + this_field_name + " in data_load for ticket: " + ticket_id);
                continue;
            }

            // Check if all other mandatory fields have been also set
            var this_settable = ticket_field_map[i].settable;
            var this_mandatory = ticket_field_map[i].mandatory;

            // If the field is settable and mandatory, check if we have a blank val in the ticket data and set it to the default value
            if((this_settable == "yes") && (this_mandatory == "yes"))
            {
                if(this_hierarchy == "")
                {
                    var field_val_from_fd = data[this_field_name] ? (data[this_field_name]).toString().trim() : "";
                    if(field_val_from_fd == "")
                    {
                        data_load[this_field_name] = this_field_val;
                    }
                }
                else
                {
                    var field_val_from_fd = data[this_hierarchy] && data[this_hierarchy][this_field_name] ? (data[this_hierarchy][this_field_name]).toString().trim() : "";
                    if(field_val_from_fd == "")
                    {
                        if(!data_load[this_hierarchy])
                        {
                            data_load[this_hierarchy] = {};
                        } 
                        data_load[this_hierarchy][this_field_name] = this_field_val;
                    }
                }

                common.statusMessage(arguments.callee.name, "Successfully set value: " +  this_field_val + " for field_name: " + this_field_name + " in data_load for ticket: " + ticket_id);
            }
        }

        // set a sleep here for 100 ms so that we don't exceed the throttle
        common.sleep(100);

    }
    catch(e)
    {
        common.statusMessage(arguments.callee.name, "Failed to get data for ticket ID " + ticket_id + ". Error:" + e.message);
        return -1;
    }

    return 0;
}




/* 
Function: verifyValueSet
Purpose: Checks if the required value was set in FD
Inputs: data from the set operation, field name, field value, field map
Output: 0 on success, -1 on failure
*/
function verifyValueSet(data, field_name, field_value)
{
    var i = 0;
    var ret = false;

    for(i = 0; i < ticket_field_map.length; i++)
    {
        var this_hierarchy = (ticket_field_map[i].hierarchy).toString().trim();
        var this_field_name = ticket_field_map[i].fd_field;
        var this_field_val;

        // Set the appropriate fd field for the field_name being passed in
        if(this_field_name == field_name)
        {
            // Check the appropriate field in the data {}
            if(this_hierarchy == "")
            {
                this_field_val = data[this_field_name];
            }
            else
            {
                this_field_val = data[this_hierarchy][this_field_name];
            }

            // Check if the value was set correctly
            if(this_field_val == field_value) ret = true;

            break;
        }

    }

    return ret;
}



/* 
Function: setTicketField
Purpose: Sets the field to the provided value for the ticket
Inputs: ticket id, field name, field value
Output: 0 on success, -1 on failure
*/
async function setTicketField(ticket_id, field_name, field_value, ret)
{
    // URL path for the API endpoint to set the ticket fields
    var path = "tickets/" + ticket_id.toString();

    // There are some mandatory fields that need to be set in Freshdesk without which the provided field setting will not go through. We'll need to check this
    var data_load = {};
    if(await checkAndSetDataLoad(ticket_id, field_name, field_value, data_load) < 0)
    {
        common.statusMessage(arguments.callee.name, "Failed to set data load for field_name: " + field_name + " value: " + field_value + " for ticket ID: " + ticket_id + ".");
        return -1;
    }

    try
    {
        const {headers,data} =  await putFreshdeskData
        ({
            path, 
            data_load
        });

        // Check if the value was set as expected
        if(verifyValueSet(data, field_name, field_value) != true)
        {
            common.statusMessage(arguments.callee.name, "Failed to set ticket field : " + field_name + " value: " + field_value + " for ticket ID: " + ticket_id + ".");
            return -1;
        }

        // return the field name, field value and the time at which the field was updated in Freshdesk back to the caller in the ret {} 
        ret.field_name = field_name;
        ret.field_value = field_value;
        ret.status_updated_at = data["updated_at"];

    }
    catch(e)
    {
        common.statusMessage(arguments.callee.name, "Failed to set ticket field : " + field_name + " value: " + field_value + " for ticket ID: " + ticket_id + "." + e.message);
        return -1;
    }

    common.statusMessage(arguments.callee.name, "Successfully set ticket field : " + field_name + " value: " + field_value + " for ticket ID: " + ticket_id + ".");

    return 0;
}


// Export funtions
module.exports =
{
    setTicketField
};