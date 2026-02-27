const { sleep } = require("./misc");
const { statusMessage } = require("./logs");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
Function: withRetry
Purpose: Retries the provided async function up to 'retries' times with a delay between attempts
Inputs: 
  func_to_call - async function to retry
  retries - number of attempts (default 3)
  delayMs - delay between attempts in milliseconds (default 1000)
Output: Returns the result of the function if successful, otherwise throws the last error encountered
*/
async function withRetry(func_to_call, retries = 3, delayMs = 1000) 
{
    // Get the function name for logging
    const fn = withRetry.name;

    let lastError;
    for (let attempt = 0; attempt < retries; attempt++) 
    {
        try
        {
            const result = await func_to_call();
            return result;
        }
        catch (err)
        {
            lastError = err;
            statusMessage(fn, `Attempt ${attempt + 1} failed: ${err.message}`);
            if (attempt < retries - 1)
            {
                await new Promise(r => setTimeout(r, delayMs));
            }
        }
    }
    throw lastError;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// EXPORTS /////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Exporting the functions
module.exports = 
{
    withRetry
};