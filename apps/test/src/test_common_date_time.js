const { formatInTimeZone } = require("date-fns-tz");
const path = require("path");
const common = require("@fyle-ops/common");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function test_getPrev3MonthsMarkers()
{
    const markers = common.returnPrevious3MonthsPeriodMarkers();
    console.log("Markers: ", markers);
}


function test_getMonthMarkers()
{
    var date = "15 Aug 2024";
    var dateObj = new Date(date);
    const markers = common.getMonthMarkers(dateObj);
    console.log("Markers: ", markers);
}

function test_getEndOfMonth()
{
    var offset = 1;
    const endOfMonth = common.getEndOfMonth(offset);
    console.log("End of month: ", formatInTimeZone(endOfMonth, "GMT", "yyyy-MM-dd"));
}

function test_isNewTimestampCloser()
{
    var base_date = "31 Jan 2026";
    var base_timestamp = (new Date(base_date)).getTime();
    var new_date = "20 Jan 2026";
    var new_timestamp = (new Date(new_date)).getTime();
    var curr_date = "02 Feb 2026";
    var curr_timestamp = (new Date(curr_date)).getTime();
    var interval = "week"
    var is_closer = common.isNewTimestampCloser(base_timestamp, new_timestamp, curr_timestamp, interval);
    if(is_closer) console.log("New timestamp: ", new_date, " is closer to base timestamp: ", base_date, " than current timestamp: ", curr_date);
    else console.log("New timestamp: ", new_date, " is not closer to base timestamp: ", base_date, " than current timestamp: ", curr_date);

    base_date = "31 Jan 2026";
    base_timestamp = (new Date(base_date)).getTime();
    new_date = "28 Jan 2026";
    new_timestamp = (new Date(new_date)).getTime();
    curr_date = "10 Feb 2026";
    curr_timestamp = (new Date(curr_date)).getTime();
    interval = "week"
    is_closer = common.isNewTimestampCloser(base_timestamp, new_timestamp, curr_timestamp, interval);
    if(is_closer) console.log("New timestamp: ", new_date, " is closer to base timestamp: ", base_date, " than current timestamp: ", curr_date);
    else console.log("New timestamp: ", new_date, " is not closer to base timestamp: ", base_date, " than current timestamp: ", curr_date);
}

function test_convertTimeMinutesToString()
{
    var time_in_minutes = 60*24*12 + 60*5 + 10; // 12 days, 5 hours and 10 minutes
    var time_in_minutes_str = common.convertTimeMinutesToString(time_in_minutes);
    console.log("Time in minutes string: ", time_in_minutes_str);

    time_in_minutes = 60*5 + 10; // 5 hours and 10 minutes
    time_in_minutes_str = common.convertTimeMinutesToString(time_in_minutes);
    console.log("Time in minutes string: ", time_in_minutes_str);

    time_in_minutes = 10; // 10 minutes
    time_in_minutes_str = common.convertTimeMinutesToString(time_in_minutes);
    console.log("Time in minutes string: ", time_in_minutes_str);
}

function test_isValidDate()
{
    var date_str = "2024-08-15";
    var is_valid = common.isValidDate(date_str);
    console.log("Set 1: Date: ", date_str, ", is valid date: ", is_valid);

    var date_str = "2024-02-30";
    var is_valid = common.isValidDate(date_str);
    console.log("Set 2: Date: ", date_str, ", is valid date: ", is_valid);

    var date_str = "Invalid Date";
    var is_valid = common.isValidDate(date_str);
    console.log("Set 3: Date: ", date_str, ", is valid date: ", is_valid);

    var date_str = "2024-12-01T10:00:00Z";
    var is_valid = common.isValidDate(date_str);
    console.log("Set 4: Date: ", date_str, ", is valid date: ", is_valid);
}

function test_getSinceString()
{
    var interval = 24;
    const since_str = common.getSinceString(interval);
    console.log("Since string: ", since_str);
}

function test_getNMonthsAgo()
{
    var date = "15 Aug 2024";
    var n_months = 3;
    var dateObj = new Date(date);
    const n_months_ago = common.getNMonthsAgo(dateObj, n_months);
    console.log(n_months, " months ago from ", date, " is: ", formatInTimeZone(n_months_ago, "GMT", "yyyy-MM-dd"));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_common_date_time()
{
    // Date and Time functions
    if(process.env.RUN_TEST_COMMON_GET_PREV_3_MONTHS_MARKERS === "true") test_getPrev3MonthsMarkers();
    if(process.env.RUN_TEST_COMMON_GET_MONTH_MARKERS === "true") test_getMonthMarkers();
    if(process.env.RUN_TEST_COMMON_GET_END_OF_MONTH === "true") test_getEndOfMonth();
    if(process.env.RUN_TEST_COMMON_IS_NEW_TIMESTAMP_CLOSER === "true") test_isNewTimestampCloser();
    if(process.env.RUN_TEST_COMMON_CONVERT_TIME_MINUTES_TO_STRING === "true") test_convertTimeMinutesToString();
    if(process.env.RUN_TEST_COMMON_IS_VALID_DATE === "true") test_isValidDate();
    if(process.env.RUN_TEST_COMMON_GET_SINCE_STRING === "true") test_getSinceString();
    if(process.env.RUN_TEST_COMMON_GET_N_MONTHS_AGO === "true") test_getNMonthsAgo();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = 
{
    test_common_date_time
};