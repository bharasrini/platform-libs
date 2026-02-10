const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");

/* 
Function: fetchFreshsuccessData
Purpose: Fetches data from the Freshsuccess API
Inputs: path - API endpoint path,
        current_page - Page number for pagination,
        include_inactive - Whether to include inactive records,
        order_by - Field to order the results by,
        include - Additional related data to include
Output: Parsed JSON response from the API
*/
async function fetchFreshsuccessData
({
  path,
  current_page,
  include_inactive,
  order_by,
  include
}) 
{
    // Read environment variables
    var api_key_orig = process.env.FRESHSUCCESS_API_KEY;
    var this_host = process.env.FRESHSUCCESS_HOST;

    const url = new URL(`https://${this_host}/api/v2/${path}`);

    url.searchParams.append("api_key", api_key_orig);
    url.searchParams.append("page", String(current_page));
    url.searchParams.append("include_inactive", String(include_inactive));
    if (order_by) url.searchParams.append("order_by", order_by);
    if (include) url.searchParams.append("include", include);

    console.log("Freshsuccess Url = ", url.toString());

    // Fetch data with retry logic
    return common.withRetry(async () => 
    {
        const res = await fetch(url.toString(), { method: "GET" });

        if (!res.ok)
        {
            const body = await res.text();
            throw new Error(`Freshsuccess ${res.status}: ${body}`);
        }
        const json = await res.json();
        return json; // parsed JSON body
    });
}

// Export the function for use in other modules
module.exports = 
{
    fetchFreshsuccessData
};