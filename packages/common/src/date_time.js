const { formatInTimeZone } = require("date-fns-tz");
const util = require("util");

/* 
Function: returnPrevious3MonthsPeriodMarkers
Purpose: Returns Date markers in the last 3 months (first and last date of the last 3 months)
Inputs: none
Output: Structure with Date Markers in last 3 months denoted by "m_1_start", "m_1_end", "m_2_start", "m_2_end", "m_3_start" & "m_3_end"
*/
function returnPrevious3MonthsPeriodMarkers()
{
    var todayDateObj = new Date();

    var month = todayDateObj.getMonth();
    var year = todayDateObj.getFullYear();

    var m0_year = year;
    var m0_month = month;

    var m1_year = (month == 0) ? year - 1: year;
    var m1_month = (month == 0) ? 11: month-1;
    var m1_date = 1;
    var m1DateObj_start = new Date(m1_year, m1_month, m1_date);
    var m1DateObj_end = new Date(m0_year, m0_month, 0, 23, 59, 59);

    var m2_year = (m1_month == 0) ? m1_year - 1: m1_year;
    var m2_month = (m1_month == 0) ? 11: m1_month-1;
    var m2_date = 1;
    var m2DateObj_start = new Date(m2_year, m2_month, m2_date);
    var m2DateObj_end = new Date(m1_year, m1_month, 0, 23, 59, 59);

    var m3_year = (m2_month == 0) ? m2_year - 1: m2_year;
    var m3_month = (m2_month == 0) ? 11: m2_month-1;
    var m3_date = 1;
    var m3DateObj_start = new Date(m3_year, m3_month, m3_date);
    var m3DateObj_end = new Date(m2_year, m2_month, 0, 23, 59, 59);

    var threeMonthPeriodMarkers = 
    {
        "m_1_start": 
        {
          "date": m1DateObj_start, 
          "timestamp": m1DateObj_start.getTime(),
        },
        "m_1_end": 
        {
          "date": m1DateObj_end, 
          "timestamp": m1DateObj_end.getTime(),
        },
        "m_2_start": 
        {
          "date": m2DateObj_start, 
          "timestamp": m2DateObj_start.getTime(),
        },
        "m_2_end": 
        {
          "date": m2DateObj_end, 
          "timestamp": m2DateObj_end.getTime(),
        },
        "m_3_start": 
        {
          "date": m3DateObj_start,
          "timestamp": m3DateObj_start.getTime(),
        },
        "m_3_end": 
        {
          "date": m3DateObj_end,
          "timestamp": m3DateObj_end.getTime(),
        },
    };

    return threeMonthPeriodMarkers;
}


/* 
Function: getMonthMarkers
Purpose: Returns Date markers for the month corresponding to the period passed in (first and last date of the month)
Inputs: Period (Date)
Output: Structure with Date Markers for start and end of the months denoted by "m_start" & "m_end"
*/
function getMonthMarkers(period)
{
    var year = period.getFullYear();
    var month = period.getMonth();

    var next_year = (month == 11) ? year + 1: year;
    var next_month = (month == 11) ? 0: month + 1;

    var mDateObj_start = new Date(year, month, 1);
    var mDateObj_end = new Date(next_year, next_month, 0, 23, 59, 59);

    var monthMarkers = 
    {
        "m_start":
        {
            "date": mDateObj_start, 
            "timestamp": mDateObj_start.getTime(),
        },
        "m_end":
        {
            "date": mDateObj_end, 
            "timestamp": mDateObj_end.getTime(),
        },
    };

    return monthMarkers;
}


/* 
Function: getEndOfMonth
Purpose: Returns the last date of the month for which the month_offset is provided. month_offset = 0 refers to current month, month_offset = 1 is next month and so on
Inputs: month_offset
Output: Date
*/
function getEndOfMonth(month_offset) 
{
    // Get the current date
    var end_of_month = new Date();

    // Set the date to the first day of the (month_offset + 1) month
    end_of_month.setMonth(end_of_month.getMonth() + month_offset + 1, 1);

    // Subtract one day to get the last day of the (month_offset) month
    end_of_month.setDate(end_of_month.getDate() - 1);

    return end_of_month;
}



/* 
Function: isNewTimestampCloser
Purpose: Checks whether the new timestamp is closer to the base timestamp than the current timestamp (and also less than the acceptable time interval)
Inputs: Base timestamp, New timestamp, Current timestamp, Max Acceptable interval ("day", "week" or "month")
Output: True if the new timestamp is closer, false otherwise
*/
function isNewTimestampCloser(base_timestamp, new_timestamp, current_timestamp, max_interval)
{
    // Compute the acceptable time interval
    var interval_timestamp = 0;
    
    switch(max_interval)
    {
        case "day": 
          interval_timestamp = 1000*60*60*24;
          break;

        case "week": 
          interval_timestamp = 1000*60*60*24*7;
          break;

        case "month": 
          interval_timestamp = 1000*60*60*24*30;
          break;

        default:
          interval_timestamp = 1000*60*60*24*7;
          break;
    }

    // Difference between new timestamp and base timestamp
    var diff_new_timestamp = Math.abs(base_timestamp-new_timestamp);

    // Difference between current timestamp and base timestamp
    var diff_curr_timestamp = Math.abs(base_timestamp-current_timestamp);

    // Check if the new timestamp is closer to the base timestamp than the current one and the difference is lesser than the acceptable time interval
    if((diff_new_timestamp < diff_curr_timestamp) && (diff_new_timestamp < interval_timestamp))
    {
        return true;
    }

    // If we are here, then the new timestamp is either not closer than the current timestamp OR the difference is greater than the acceptable time interval
    return false;
}


/* 
Function: convertTimeMinutesToString
Purpose: Converts the time in minutes to a String representation in the following format : XX days, XX hours, XX mins
Inputs: time in minutes
Output: String representation of Time
*/
function convertTimeMinutesToString(time_mins)
{
    var ret_str = "";

    if(time_mins < 60)
    {
        ret_str = util.format("%2d",time_mins) + " minutes";
    }
    else if(time_mins < (60*24))
    {
        var num_hours = parseInt((time_mins / 60));
        var num_mins = parseInt(time_mins - (num_hours*60));

        ret_str = util.format("%2d", num_hours) + " hours, " + util.format("%2d", num_mins) + " minutes";
    }
    else
    {
        var num_days = parseInt(time_mins / (24*60));
        var num_hours = parseInt((time_mins / 60) - (num_days*24));
        var num_mins = parseInt(time_mins - (num_days*24*60) - (num_hours*60));

        ret_str = util.format("%2d", num_days) + " days, " + util.format("%2d", num_hours) + " hours, " + util.format("%2d", num_mins) + " minutes";
    }

    return ret_str;
}




module.exports = { 
    returnPrevious3MonthsPeriodMarkers,
    getMonthMarkers,
    getEndOfMonth,
    isNewTimestampCloser,
    convertTimeMinutesToString
};