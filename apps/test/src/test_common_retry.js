const { formatInTimeZone } = require("date-fns-tz");
const path = require("path");
const common = require("@fyle-ops/common");


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function retry_func(retry_count)
{
    if(retry_count < 2)   
    {
        console.log("Retry count: ", retry_count, " - Throwing error");
        throw new Error("Test error");
    }
    const ret = "Success at retry count: " + retry_count;
    return ret;
}


async function test_withRetry()
{
    var attempt = 0;

    try
    {
        var ret = await common.withRetry(async () => retry_func(attempt++));
        console.log("Function succeeded after attempt: " + attempt + " with return value: ", ret);
    }
    catch(e)
    {
        console.log("Error after " + attempt + " retries: ", e.message);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_common_retry()
{
    // Retry functions
    if(process.env.RUN_TEST_COMMON_WITH_RETRY === "true") await test_withRetry();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = 
{
    test_common_retry
};
