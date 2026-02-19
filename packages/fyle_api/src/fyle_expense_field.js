const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");
const { fetchFyleData, postFyleData, putFyleData } = require("./fyle_common");

// Class to manage Fyle Expenses
class fyle_expense_field
{
    constructor(fyle_acc)
    {
      _initFyleExpenseField(this, fyle_acc);
    }

    async getExpenseFields()
    {
        return await _getExpenseFields(this);
    }

    async getNamedExpenseField(field_name, ret)
    {
        return await _getNamedExpenseField(this, field_name, ret);
    }

    async setExpenseField(id, field_name, type, options, default_value, is_enabled, is_mandatory)
    {
        return await _setExpenseField(this, id, field_name, type, options, default_value, is_enabled, is_mandatory);
    }

}



/* 
Function: _initFyleExpenseField
Purpose: Initializes the 'fyle_expense_field' instance
Pre-requisite: None
Inputs: fyle_expense_field instance, fyle_account instance
Output: 0 on success, -1 on failure
*/
function _initFyleExpenseField(fyle_expense_field, fyle_acc)
{
    // Save a reference to the fyle_account instance in fyle_expense_field so that we can access it in the fyle_expense_field functions
    fyle_expense_field.fyle_acc = fyle_acc;

    fyle_acc.expense_fields = 
    {
        expense_field_list: [],
        num_expense_fields : 0
    };

    return 0;
}


/* 
Function: _getExpenseFields
Purpose: Gets the list of expense fields in the fyle org and stores it in the fyle_account.expense_fields structure. 
Pre-requisite: getAccessToken() and getClusterEndpoint() to be invoked prior
Inputs: fyle_expense_field instance
Output: 0 on success, -1 on failure
*/
async function _getExpenseFields(fyle_expense_field)
{
    // Loop variables
    var i = 0;

    // Point back to the fyle_account instance
    var fyle_acc = fyle_expense_field.fyle_acc;

    const url_path = "/platform/v1/admin/expense_fields";

    var url = new URL(fyle_acc.access_params.cluster_domain + url_path);
    common.statusMessage(arguments.callee.name, "Fyle URL = " + url.toString());

    var offset = process.env.FYLE_API_START_OFFSET;
    var limit = process.env.FYLE_API_MAX_ITEMS;
    var total_count = 0;
    var page = 1;

    // Loop to fetch all expenses with pagination. We will keep fetching expenses until we have fetched the total number of expenses in the org, which is given by the 'count' field in the API response
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

            // Save the overall number of expenses we need to read in
            total_count = data.count;

            // Number of expenses read in from this response
            var this_count = data.data.length;

            // Load all expense fields received in this response to fyle_account.expense_fields {}
            var i = 0;
            for(i = 0; i < data.data.length; i++)
            {
                // Leaving out the options since it might be hundreds or thousands in some cases
                var this_expense_field = 
                {
                    "id": data.data[i].id,
                    "field_name": data.data[i].field_name,
                    "parent_field_id": data.data[i].parent_field_id,
                    "org_id": data.data[i].org_id,
                    "type": data.data[i].type,
                    "placeholder": data.data[i].placeholder,
                    "is_custom": data.data[i].is_custom,
                    "is_enabled": data.data[i].is_enabled,
                    "is_mandatory": data.data[i].is_mandatory,
                    "default_value": data.data[i].default_value,
                    "created_at": data.data[i].created_at,
                    "updated_at": data.data[i].updated_at,
                };

                fyle_acc.expense_fields.expense_field_list.push(this_expense_field);
                fyle_acc.expense_fields.num_expense_fields++;
            }

            common.statusMessage(arguments.callee.name, "Finished processing " + this_count + " expense fields on page " + page + ", total expense fields processed = " + fyle_acc.expense_fields.num_expense_fields);

            // If records on the current page were greater or equal to the limit, then increment the offset
            if(this_count >= limit)
            {
                offset += limit;
                page++;
            }
        }
        catch(e)
        {
            common.statusMessage(arguments.callee.name, "Failed to get expense fields. Error:" + e.message);
            return -1;
        }

    } while(fyle_acc.expense_fields.num_expense_fields < total_count);

    common.statusMessage(arguments.callee.name, "Successfully retrieved expense fields. Total expense fields retrieved = " + fyle_acc.expense_fields.num_expense_fields);

    return 0;
    
}



/* 
Function: _getNamedExpenseField
Purpose: Gets the named expense fields in the fyle org and returns in ret
Pre-requisite: getAccessToken() and getClusterEndpoint() to be invoked prior
Inputs: fyle_expense_field instance, field_name - name of the expense field to be fetched, ret - output parameter to return the expense field details in
Output: 0 on success, -1 on failure
*/
async function _getNamedExpenseField(fyle_expense_field, field_name, ret)
{
    // Loop variables
    var i = 0;

    // Point back to the fyle_account instance
    var fyle_acc = fyle_expense_field.fyle_acc;

    const url_path = "/platform/v1/admin/expense_fields";

    var url = new URL(fyle_acc.access_params.cluster_domain + url_path);
    common.statusMessage(arguments.callee.name, "Fyle URL = " + url.toString());

    // Build the 'include' parameter for the API call based on the input parameters
    var include = [{"field_name": "eq." + field_name}];

    try
    {
        // Fetch data for the current page
        const {headers,data} = await fetchFyleData
        ({
            url: url.toString(),
            access_token: fyle_acc.access_params.access_token,
            offset: null,
            limit: null,
            include: include
        });

        // Leaving out the options since it might be hundreds or thousands in some cases
        var this_expense_field = 
        {
            "id": data.data[0].id,
            "field_name": data.data[0].field_name,
            "parent_field_id": data.data[0].parent_field_id,
            "org_id": data.data[0].org_id,
            "type": data.data[0].type,
            "placeholder": data.data[0].placeholder,
            "is_custom": data.data[0].is_custom,
            "is_enabled": data.data[0].is_enabled,
            "is_mandatory": data.data[0].is_mandatory,
            "default_value": data.data[0].default_value,
            "created_at": data.data[0].created_at,
            "updated_at": data.data[0].updated_at,
        };

        // Return the expense field details in the output parameter
        ret.data = this_expense_field;
    }
    catch(e)
    {
        common.statusMessage(arguments.callee.name, "Failed to get expense fields for " + field_name + ". Error:" + e.message);
        return -1;
    }

    common.statusMessage(arguments.callee.name, "Successfully retrieved expense fields for: " + field_name);

    return 0;
    
}



/* 
Function: _setExpenseField
Purpose: Sets the specific expense field parameters in the fyle org
Pre-requisite: getAccessToken() and getClusterEndpoint() to be invoked prior
Inputs: fyle_account instance, field id, field name, field type, options list, default value, is_enabled, is_mandatory
Output: 0 on success, -1 on failure
*/
async function _setExpenseField(fyle_expense_field, id, field_name, type, options, default_value, is_enabled, is_mandatory)
{
    // Point back to the fyle_account instance
    var fyle_acc = fyle_expense_field.fyle_acc;

    try
    {
        var payload = 
        {
            "data": 
            {
                "id": id,
                "field_name": field_name,
                "type": type,
                "options": options,
                "default_value": default_value,
                "is_enabled": is_enabled,
                "is_mandatory": is_mandatory
            }
        };

        const {headers,data} = await postFyleData
        ({
            url: fyle_acc.access_params.cluster_domain + "/platform/v1/admin/expense_fields",
            access_token: fyle_acc.access_params.access_token,
            data_load: payload
        });

        // Check that the values were set correctly by comparing the response with the input parameters
        var ret_field = data.data;
        if(ret_field.field_name !== field_name)
        {
            common.statusMessage(arguments.callee.name, "Failed to set expense field. Expected field_name = " + field_name + ", returned field_name = " + ret_field.field_name);
            return -1;
        }
        
        // Type can't be changed, so skipping the check for type in the response

        if(common.sameStringSet(ret_field.options, options) === false)
        {
            common.statusMessage(arguments.callee.name, "Failed to set expense field. Expected options differ from returned options.");
            return -1;
        }

        if(ret_field.default_value !== default_value)
        {
            common.statusMessage(arguments.callee.name, "Failed to set expense field. Expected default_value = " + default_value + ", returned default_value = " + ret_field.default_value);
            return -1;
        }

        if(ret_field.is_enabled !== is_enabled)
        {
            common.statusMessage(arguments.callee.name, "Failed to set expense field. Expected is_enabled = " + is_enabled + ", returned is_enabled = " + ret_field.is_enabled);
            return -1;
        }

        if(ret_field.is_mandatory !== is_mandatory)
        {
            common.statusMessage(arguments.callee.name, "Failed to set expense field. Expected is_mandatory = " + is_mandatory + ", returned is_mandatory = " + ret_field.is_mandatory);
            return -1;
        }
    }
    catch (error)
    {
        common.statusMessage(arguments.callee.name, "Failed to set expense field. Error:" + error.message);
        return -1;
    }

    common.statusMessage(arguments.callee.name, "Successfully set expense field: " + id + ", field_name: " + field_name);

    return 0;

}

 



// Export the class
module.exports =
{
    fyle_expense_field,
};

