const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");
const { fetchFreshdeskData, postFreshdeskData, putFreshdeskData } = require('./fd_common');


// Class to manage contacts in Freshdesk
class fd_contacts
{
    constructor()
    {
      _initContacts(this);
    }

    getContacts()
    {
        return _getContacts(this);
    }

    getContactForEmail(email)
    {
        return _getContactForEmail(this, email);
    }

    getContactForID(id)
    {
        return _getContactForID(this, id);
    }
}


/* 
Function: _initContacts
Purpose: Initializes the contact structure to store the contact information
Inputs: contact variable
Output: 0 on success, -1 on failure
*/
function _initContacts(contact)
{
    // Initialize an array to store the contact list
    contact.contact_list = [];

    // Initialize number of contacts
    contact.num_contacts = 0;

    // Nothing else to do, return success
    return 0;

}



/* 
Function: _getContacts
Purpose: Gets the list of all contacts from Freshdesk
Inputs: contact instance
Output: List of contacts stored in contact.contact_list[]. Returns 0 on success, -1 on failure
*/
async function _getContacts(contact)
{
    // URL path for fetching contacts
    var path = "contacts";

    // Initialize the page and record count
    var page = process.env.FRESHDESK_START_PAGE || 1;
    const per_page = process.env.FRESHDESK_MAX_CONTACTS_PER_PAGE || 100;
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

            // Load all contacts received in this response to the contact_list []
            for(i = 0; i < data.length; i++)
            {
                var contact_info = 
                {
                    "id": data[i]["id"] ? data[i]["id"] : "",
                    "name": data[i]["name"] ? data[i]["name"] : "",
                    "email": data[i]["email"] ? data[i]["email"] : "",
                    "role": data[i].custom_fields && data[i].custom_fields["role"] ? data[i].custom_fields["role"] : ""
                };

                contact.contact_list.push(contact_info);

                // Increment counter
                contact.num_contacts++
            }

            if(link)
            {
                page++;
            }
    /*
            if((page % 5) == 0)
            {
                common.statusMessage(arguments.callee.name, "Processing page: " + page + ", contacts processed: " + contact.num_contacts);
            }
    */
            // set a sleep here for 100 ms so that we don't exceed the throttle
            common.sleep(100);
        }
        catch(e)
        {
            common.statusMessage(arguments.callee.name, "Failed to get list of contacts. Error:" + e.message);
            return -1;
        }

    }while(link);

    common.statusMessage(arguments.callee.name, "Successfully fetched contacts. Number of contacts = "+ contact.num_contacts);

    return 0;
}




/* 
Function: _getContactForEmail
Purpose: Gets the contact information for the email passed in. Pre-requisite: getContacts () to be run prior 
Inputs: contact instance, email
Output: Contact offset in contact.contact_list[] on success, -1 on failure
*/
function _getContactForEmail(contact, email)
{
    // Sanity check
    if(email == "")
    {
        common.statusMessage(arguments.callee.name, "Invalid email ID passed in ..");
        return -1;
    }

    // Check if there are contacts in the contact list
    if(contact.contact_list.length == 0)
    {
        common.statusMessage(arguments.callee.name, "No contacts, getContacts() to be run prior ..");
        return -1;
    }

    // Loop through the contact list and find the contact with the email ID passed in
    for(var i = 0; i < contact.contact_list.length; i++)
    {
        var this_email = contact.contact_list[i].email;

        if(this_email == email)
        {
            return i;
        }
    }

    // If we are here, we did not get a match. Return failure
    return -1;

}



/* 
Function: _getContactForID
Purpose: Gets the contact information for the ID passed in. Pre-requisite: getContacts () to be run prior 
Inputs: contact instance, id
Output: Contact offset in contact.contact_list[] on success, -1 on failure
*/
function _getContactForID(contact, id)
{
    // Sanity check
    if(id == "")
    {
        common.statusMessage(arguments.callee.name, "Invalid ID passed in ..");
        return -1;
    }

    // Check if there are contacts in the contact list
    if(contact.contact_list.length == 0)
    {
        common.statusMessage(arguments.callee.name, "No contacts, getContacts() to be run prior ..");
        return -1;
    }

    // Loop through the contact list and find the contact with the ID passed in
    for(var i = 0; i < contact.contact_list.length; i++)
    {
        var this_id = contact.contact_list[i].id;

        if(this_id == id)
        {
            return i;
        }
    }

    // If we are here, we did not get a match. Return failure
    return -1;
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/* 
Function: addContact
Purpose: Adds the contact for which the name, email and role is passed in. Pre-requisite: getContacts () to be run prior 
Inputs: name, email, role
Output: Returns offset to the added contact on success, -1 on failure
*/
async function addContact(name, email, role)
{
    // Sanity check
    if(email == "")
    {
        common.statusMessage(arguments.callee.name, "Invalid email passed in ..");
        return -1;
    }

    // Path to set contact data
    var path = "contacts";

    // contact data to be added
    var data_load = 
    {
        "name": name,
        "email": email,
        "custom_fields":
        {
            "role": role,
        }
    };


    try
    {
        // Add the contact information 
        const {headers,data} =  await postFreshdeskData
        ({
            path, 
            data_load
        });

        // check if the contact name, email and role are updated
        if(data.name != name)
        {
            common.statusMessage(arguments.callee.name, "Added name: " + data.name + " does not match name: " + name + " for contact ID: " + id + ".");
            return -1;
        }

        if(data.email != email)
        {
            common.statusMessage(arguments.callee.name, "Added email: " + data.email + " does not match email: " + email + " for contact ID: " + id + ".");
            return -1;
        }

        if(data.custom_fields && data.custom_fields["role"] != role)
        {
            common.statusMessage(arguments.callee.name, "Added role: " + (data.custom_fields ? data.custom_fields["role"] : "") + " does not match role: " + role + " for contact ID: " + id + ".");
            return -1;
        }
    }
    catch(e)
    {
        common.statusMessage(arguments.callee.name, "Failed to add new contact: " + name + ", email: " + email + ", role: " + role + "." + e.message);
        return -1;
    }

    common.statusMessage(arguments.callee.name, "Successfully added new contact: " + name + ", email: " + email + ", role: " + role + ".");

    return 0;
}


async function getContactIDFromEmail(email)
{
    // Return value from the function
    var id = "";

    // First get the ID for the email sent in
    var path = "search/contacts?query=\"email:'" + email + "'\"";

    try
    {
        // Fetch data for the current page
        const {headers,data} = await fetchFreshdeskData
        ({
            path: path,
        });

        // data.results[0] should have the contact information for the email sent in
        id = data.results[0] && data.results[0].id ? data.results[0].id : "";

        // set a sleep here for 100 ms so that we don't exceed the throttle
        common.sleep(100);
    }
    catch(e)
    {
        common.statusMessage(arguments.callee.name, "Failed to get list of contacts. Error:" + e.message);
        return id;
    }

    common.statusMessage(arguments.callee.name, "Successfully fetched id: " + id + " for contact email: " + email);

    return id;
}


/* 
Function: updateContact
Purpose: Updates the contact (for which the old email is passed) with the name, email id and role. Pre-requisite: getContacts () to be run prior 
Inputs: old email, new name, new email, new role
Output: Updated contact offset in contact.contact_list[] on success, -1 on failure
*/
async function updateContact(old_email, new_name, new_email, new_role)
{
    if(old_email == "")
    {
        common.statusMessage(arguments.callee.name, "Invalid email passed in ..");
        return -1;
    }

    // Fetch the contact ID for the email sent in
    var id = await getContactIDFromEmail(old_email);
    if(id == "")
    {
        common.statusMessage(arguments.callee.name, "Failed to get contact ID for email: " + old_email);
        return -1;
    }

    // Path to set contact data
    var path = "contacts/" + id;

    // contact data to be modified
    var data_load = 
    {
        "name": new_name,
        "email": new_email,
        "custom_fields":
        {
            "role": new_role,
        }
    };

    try
    {
        // Update the contact information for the contact ID passed in
        const {headers,data} =  await putFreshdeskData
        ({
            path, 
            data_load
        });

        // check if the contact name, email and role are updated
        if(data.name != new_name)
        {
            common.statusMessage(arguments.callee.name, "Updated name: " + data.name + " does not match name: " + new_name + " for contact ID: " + id + ".");
            return -1;
        }

        if(data.email != new_email)
        {
            common.statusMessage(arguments.callee.name, "Updated email: " + data.email + " does not match email: " + new_email + " for contact ID: " + id + ".");
            return -1;
        }

        if(data.custom_fields && data.custom_fields["role"] != new_role)
        {
            common.statusMessage(arguments.callee.name, "Updated role: " + (data.custom_fields ? data.custom_fields["role"] : "") + " does not match role: " + new_role + " for contact ID: " + id + ".");
            return -1;
        }
    }
    catch(e)
    {
        common.statusMessage(arguments.callee.name, "Failed to update new contact info: " + new_name + ", email: " + new_email + ", role: " + new_role + " for contact ID: " + id + "." + e.message);
        return -1;
    }

    common.statusMessage(arguments.callee.name, "Successfully updated new contact info: " + new_name + ", email: " + new_email + ", role: " + new_role + " for contact ID: " + id + ".");

    return 0;

}


// Export the functions that need to be accessed outside this module
module.exports =
{
    fd_contacts,
    addContact,
    updateContact,
};

