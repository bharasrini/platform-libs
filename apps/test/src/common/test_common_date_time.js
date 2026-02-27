const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function test_getPrev3MonthsMarkers()
{
    // Get the function name for logging
    const fn = test_getPrev3MonthsMarkers.name;

    common.start_test(fn);

    const markers = common.returnPrevious3MonthsPeriodMarkers();
    common.statusMessage(fn, "Previous 3 months period markers: ", markers);

    common.end_test(fn);
}


function test_getMonthMarkers()
{
    // Get the function name for logging
    const fn = test_getMonthMarkers.name;

    common.start_test(fn);

    var date = "15 Aug 2024";
    var dateObj = new Date(date);
    const markers = common.getMonthMarkers(dateObj);
    common.statusMessage(fn, "Date = ", date, ", Markers = ", markers);

    common.end_test(fn);
}

function test_getEndOfMonth()
{
    // Get the function name for logging
    const fn = test_getEndOfMonth.name;

    common.start_test(fn);

    var offset = 2;
    const endOfMonth = common.getEndOfMonth(offset);
    common.statusMessage(fn, "End of month + ", offset, ": ", formatInTimeZone(endOfMonth, "UTC", "yyyy-MM-dd"));

    common.end_test(fn);
}

function test_isNewTimestampCloser()
{
    // Get the function name for logging
    const fn = test_isNewTimestampCloser.name;

    common.start_test(fn);

    var base_date = "31 Jan 2026";
    var base_timestamp = (new Date(base_date)).getTime();
    var new_date = "20 Jan 2026";
    var new_timestamp = (new Date(new_date)).getTime();
    var curr_date = "02 Feb 2026";
    var curr_timestamp = (new Date(curr_date)).getTime();
    var interval = "week"
    var is_closer = common.isNewTimestampCloser(base_timestamp, new_timestamp, curr_timestamp, interval);
    if(is_closer) common.statusMessage(fn, "New timestamp: ", new_date, " is closer to base timestamp: ", base_date, " than current timestamp: ", curr_date);
    else common.statusMessage(fn, "New timestamp: ", new_date, " is not closer to base timestamp: ", base_date, " than current timestamp: ", curr_date);

    base_date = "31 Jan 2026";
    base_timestamp = (new Date(base_date)).getTime();
    new_date = "28 Jan 2026";
    new_timestamp = (new Date(new_date)).getTime();
    curr_date = "10 Feb 2026";
    curr_timestamp = (new Date(curr_date)).getTime();
    interval = "week"
    is_closer = common.isNewTimestampCloser(base_timestamp, new_timestamp, curr_timestamp, interval);
    if(is_closer) common.statusMessage(fn, "New timestamp: ", new_date, " is closer to base timestamp: ", base_date, " than current timestamp: ", curr_date);
    else common.statusMessage(fn, "New timestamp: ", new_date, " is not closer to base timestamp: ", base_date, " than current timestamp: ", curr_date);

    common.end_test(fn);
}

function test_convertTimeMinutesToString()
{
    // Get the function name for logging
    const fn = test_convertTimeMinutesToString.name;

    common.start_test(fn);

    var time_in_minutes = 60*24*12 + 60*5 + 10; // 12 days, 5 hours and 10 minutes
    var time_in_minutes_str = common.convertTimeMinutesToString(time_in_minutes);
    common.statusMessage(fn, "Time number = ", time_in_minutes, ", Time in minutes string: ", time_in_minutes_str);

    time_in_minutes = 60*5 + 10; // 5 hours and 10 minutes
    time_in_minutes_str = common.convertTimeMinutesToString(time_in_minutes);
    common.statusMessage(fn, "Time number = ", time_in_minutes, ", Time in minutes string: ", time_in_minutes_str);

    time_in_minutes = 10; // 10 minutes
    time_in_minutes_str = common.convertTimeMinutesToString(time_in_minutes);
    common.statusMessage(fn, "Time number = ", time_in_minutes, ", Time in minutes string: ", time_in_minutes_str);

    common.end_test(fn);
}

function test_isValidDate()
{
    // Get the function name for logging
    const fn = test_isValidDate.name;

    common.start_test(fn);

    var date_str = "2024-08-15";
    var is_valid = common.isValidDate(date_str);
    common.statusMessage(fn, "Set 1: Date: ", date_str, ", is valid date: ", is_valid);

    var date_str = "2024-02-30";
    var is_valid = common.isValidDate(date_str);
    common.statusMessage(fn, "Set 2: Date: ", date_str, ", is valid date: ", is_valid);

    var date_str = "Invalid Date";
    var is_valid = common.isValidDate(date_str);
    common.statusMessage(fn, "Set 3: Date: ", date_str, ", is valid date: ", is_valid);

    var date_str = "2024-12-01T10:00:00Z";
    var is_valid = common.isValidDate(date_str);
    common.statusMessage(fn, "Set 4: Date: ", date_str, ", is valid date: ", is_valid);

    common.end_test(fn);
}

function test_getSinceString()
{
    // Get the function name for logging
    const fn = test_getSinceString.name;

    common.start_test(fn);

    var interval = 24;
    const since_str = common.getSinceString(interval);
    common.statusMessage(fn, "Since string for 24 hours prior: ", since_str);

    common.end_test(fn);
}

function test_getNMonthsAgo()
{
    // Get the function name for logging
    const fn = test_getNMonthsAgo.name;

    common.start_test(fn);

    var date = "15 Aug 2024";
    var n_months = 3;
    var dateObj = new Date(date);
    const n_months_ago = common.getNMonthsAgo(dateObj, n_months);
    common.statusMessage(fn, n_months, " months ago from ", date, " is: ", formatInTimeZone(n_months_ago, "GMT", "yyyy-MM-dd"));

    common.end_test(fn);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_common_date_time()
{
    // Get the function name for logging
    const fn = test_common_date_time.name;

    common.start_test_suite("Date and Time functions");
    
    // Date and Time functions
    if(process.env.RUN_TEST_COMMON_GET_PREV_3_MONTHS_MARKERS === "true") test_getPrev3MonthsMarkers();
    if(process.env.RUN_TEST_COMMON_GET_MONTH_MARKERS === "true") test_getMonthMarkers();
    if(process.env.RUN_TEST_COMMON_GET_END_OF_MONTH === "true") test_getEndOfMonth();
    if(process.env.RUN_TEST_COMMON_IS_NEW_TIMESTAMP_CLOSER === "true") test_isNewTimestampCloser();
    if(process.env.RUN_TEST_COMMON_CONVERT_TIME_MINUTES_TO_STRING === "true") test_convertTimeMinutesToString();
    if(process.env.RUN_TEST_COMMON_IS_VALID_DATE === "true") test_isValidDate();
    if(process.env.RUN_TEST_COMMON_GET_SINCE_STRING === "true") test_getSinceString();
    if(process.env.RUN_TEST_COMMON_GET_N_MONTHS_AGO === "true") test_getNMonthsAgo();

    common.end_test_suite("Date and Time functions");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = 
{
    test_common_date_time
};