const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");
const { fetchFreshdeskData } = require('./fd_common');
const { convertTimeToUTC } = require('./fd_timezones');

const holiday_list = 
[
    {date:"01-Jan-2025", holiday: "New Year's Day"},
    {date:"20-Jan-2025", holiday: "Martin Luther King's Day"},
    {date:"10-Feb-2025", holiday: "Q1 Wellness Holiday"},
    {date:"17-Feb-2025", holiday: "President's Day"},
    {date:"18-Apr-2025", holiday: "Good Friday"},
    {date:"09-May-2025", holiday: "Q2 Wellness Holiday"},
    {date:"26-May-2025", holiday: "Memorial Day"},
    {date:"04-Jul-2025", holiday: "US Independence Day"},
    {date:"07-Jul-2025", holiday: "Q3 Wellness Holiday"},
    {date:"01-Sep-2025", holiday: "Labor Day"},
    {date:"13-Oct-2025", holiday: "Columbus Day"},
    {date:"07-Nov-2025", holiday: "Fyle - Wellness day off"},
    {date:"11-Nov-2025", holiday: "Veteran's Day"},
    {date:"27-Nov-2025", holiday: "Thanksgiving"},
    {date:"28-Nov-2025", holiday: "Thanksgiving"},
    {date:"25-Dec-2025", holiday: "Christmas"},
    {date:"01-Jan-2026", holiday: "New Year's Day"},
    {date:"19-Jan-2026", holiday: "Martin Luther King's Day"},
    {date:"16-Feb-2026", holiday: "President's Day"},
    {date:"03-Apr-2026", holiday: "Good Friday"},
    {date:"25-May-2026", holiday: "Memorial Day"},
    {date:"04-Jul-2026", holiday: "US Independence Day"},
    {date:"07-Sep-2026", holiday: "Labor Day"},
    {date:"12-Oct-2026", holiday: "Columbus Day"},
    {date:"11-Nov-2026", holiday: "Veteran's Day"},
    {date:"26-Nov-2026", holiday: "Thanksgiving"},
    {date:"27-Nov-2026", holiday: "Thanksgiving"},
    {date:"25-Dec-2026", holiday: "Christmas"},
];

// Freshdesk Business Hours class
class fd_business_hours
{
    constructor()
    {
      _initBusinessHours(this);
    }

    getBusinessHours()
    {
        return _getBusinessHours(this);
    }

    checkIfWithinBusinessHours(support_group, time_instance)
    {
        return _checkIfWithinBusinessHours(this, support_group, time_instance);
    }

}


/* 
Function: _initBusinessHours
Purpose: Initializes the Freshdesk 'business hours' functionality
Inputs: business_hours instance
Output: 0 on success, -1 on failure
*/
function _initBusinessHours(business_hours)
{
    // Initialize an array to store the business hours list
    business_hours.business_hours_list = [];

    // Initialize number of business_hours
    business_hours.num_business_hours = 0;

    // Nothing else to do, return success
    return 0;

}


/* 
Function: _getBusinessHours
Purpose: Gets the list of all configured Business Hours from Freshdesk
Inputs: business hours instance
Output: List of business hours in business_hours.business_hours_list[]. Returns 0 on success, -1 on failure
*/
async function _getBusinessHours(business_hours)
{
    // URL path for fetching business hours
    var path = "business_hours";

    // Initialize the page and record count
    var page = process.env.FRESHDESK_START_PAGE || 1;
    var per_page = process.env.FRESHDESK_MAX_BUSINESS_HOURS_PER_PAGE || 100;
    var link = "";

    do
    {
        // Fetch data for the current page
        try
        {
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
            var i = 0;  

            // Load all accounts received in this response to the account_list []
            for(i = 0; i < data.length; i++)
            {
                var business_hours_info = 
                {
                    "id": data[i].id,
                    "name": data[i].name,
                    "description": data[i].description,
                    "time_zone": data[i].time_zone,
                    "business_hours":
                    {
                        "monday":
                        {
                            "start": data[i].business_hours.monday && data[i].business_hours.monday.start_time ? data[i].business_hours.monday.start_time : "0:00:00 AM",
                            "end": data[i].business_hours.monday && data[i].business_hours.monday.end_time ? data[i].business_hours.monday.end_time : "11:59:59 PM",
                        },
                        "tuesday":
                        {
                            "start": data[i].business_hours.tuesday && data[i].business_hours.tuesday.start_time ? data[i].business_hours.tuesday.start_time : "0:00:00 AM",
                            "end": data[i].business_hours.tuesday && data[i].business_hours.tuesday.end_time ? data[i].business_hours.tuesday.end_time : "11:59:59 PM",
                        },
                        "wednesday":
                        {
                            "start": data[i].business_hours.wednesday && data[i].business_hours.wednesday.start_time ? data[i].business_hours.wednesday.start_time : "0:00:00 AM",
                            "end": data[i].business_hours.wednesday && data[i].business_hours.wednesday.end_time ? data[i].business_hours.wednesday.end_time : "11:59:59 PM",
                        },
                        "thursday":
                        {
                            "start": data[i].business_hours.thursday && data[i].business_hours.thursday.start_time ? data[i].business_hours.thursday.start_time : "0:00:00 AM",
                            "end": data[i].business_hours.thursday && data[i].business_hours.thursday.end_time ? data[i].business_hours.thursday.end_time : "11:59:59 PM",
                        },
                        "friday":
                        {
                            "start": data[i].business_hours.friday && data[i].business_hours.friday.start_time ? data[i].business_hours.friday.start_time : "0:00:00 AM",
                            "end": data[i].business_hours.friday && data[i].business_hours.friday.end_time ? data[i].business_hours.friday.end_time : "11:59:59 PM",
                        },
                        "saturday":
                        {
                            "start": data[i].business_hours.saturday && data[i].business_hours.saturday.start_time ? data[i].business_hours.saturday.start_time : "",
                            "end": data[i].business_hours.saturday && data[i].business_hours.saturday.end_time ? data[i].business_hours.saturday.end_time : "",
                        },
                        "sunday":
                        {
                            "start": data[i].business_hours.sunday && data[i].business_hours.sunday.start_time ? data[i].business_hours.sunday.start_time : "",
                            "end": data[i].business_hours.sunday && data[i].business_hours.sunday.end_time ? data[i].business_hours.sunday.end_time : "",
                        },
                    },
                };

                business_hours.business_hours_list.push(business_hours_info);

                // Increment counter
                business_hours.num_business_hours++;
            }

            if(link)
            {
                page++;
            }
    /*
            if((page % 5) == 0)
            {
                common.statusMessage(arguments.callee.name, "Processing page: " + page + ", business hours processed: " + business_hours.num_business_hours);
            }
    */
            // set a sleep here for 100 ms so that we don't exceed the throttle
            common.sleep(100);

        }
        catch(e)
        {
            common.statusMessage(arguments.callee.name, "Failed to get list of business hours. Error:" + e.message);
            return -1;
        }

    }while(link);

    common.statusMessage(arguments.callee.name, "Successfully fetched business hours. Number of business hours = "+ business_hours.num_business_hours);

    return 0;
}




/* 
Function: _checkIfWithinBusinessHours
Purpose: Checks if the provided time instance (in UTC) is within defined business hours
Inputs: business hours instance, support group, time instance
Output: 0 on success, -1 on failure
*/
function _checkIfWithinBusinessHours(business_hours, support_group, time_instance)
{
    var i = 0;
    var ret = false;
    var is_holiday = false;

    var input_date = new Date(time_instance);
    
    var input_year = input_date.getFullYear();
    var input_month = input_date.getMonth();
    var input_date_in_month = input_date.getDate();
    var input_day_of_week = input_date.getDay();
    var input_date_in_secs = input_date.getTime();

    // First check if the provided date is within any of the holidays
    for(i = 0; i < holiday_list.length; i++)
    {
        var holiday_date = new Date(holiday_list[i].date);
        var holiday_year = holiday_date.getFullYear();
        var holiday_month = holiday_date.getMonth();
        var holiday_date_in_month = holiday_date.getDate();

        if((holiday_year == input_year) && (holiday_month == input_month) && (holiday_date_in_month == input_date_in_month))
        {
            is_holiday = true;
            break;
        }
    }

    // Check if we got a holiday
    if(is_holiday)
    {
        //common.statusMessage(arguments.callee.name, "Provided date: " + time_instance + " falls on a holiday");
        ret = false;
        return ret;
    }

    // Proceed to checking against the business hour start and end for each day
    // Construct a date string for the date passed in
    var dateStr = formatInTimeZone(input_date, "UTC", "yyyy-MM-dd");
    var day_of_week = "";

    // Loop through and identify the support group that we are interested in
    for(i = 0; i < business_hours.num_business_hours; i++)
    {
        if(support_group == business_hours.business_hours_list[i].name)
        {
            switch(input_day_of_week)
            {
                case 0: day_of_week = "sunday"; break;
                case 1: day_of_week = "monday"; break;
                case 2: day_of_week = "tuesday"; break;
                case 3: day_of_week = "wednesday"; break;
                case 4: day_of_week = "thursday"; break;
                case 5: day_of_week = "friday"; break;
                case 6: day_of_week = "saturday"; break;
                default: day_of_week = "monday"; break;
            }

            var start_time = business_hours.business_hours_list[i].business_hours[day_of_week].start;
            var end_time = business_hours.business_hours_list[i].business_hours[day_of_week].end;

            if(start_time == "" || end_time == "")
            {
                // This is a weekend ticket
                //common.statusMessage(arguments.callee.name, "Provided date: " + time_instance + " is a weekend ticket");
                ret = false;
                break;
            }

            var time_zone = business_hours.business_hours_list[i].time_zone;
            var start_date_time = convertTimeToUTC(start_time, time_zone, dateStr);
            var end_date_time = convertTimeToUTC(end_time, time_zone, dateStr);

            var start_date_time_in_secs = new Date(start_date_time).getTime();
            var end_date_time_in_secs = new Date(end_date_time).getTime();

            // Check if input_date_in_secs lies between  start_date_time_in_secs & end_date_time_in_secs
            if((input_date_in_secs >= start_date_time_in_secs) && (input_date_in_secs <= end_date_time_in_secs))
            {
                ret = true;
                break;
            }
        }
    }

    return ret;
}



// Exporting the functions
module.exports =
{
    fd_business_hours,
};