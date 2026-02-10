const { sleep } = require("./misc");


/* 
Function: withRetry
Purpose: Retries the provided async function up to 'retries' times with a delay between attempts
Inputs: 
  fn - async function to retry
  retries - number of attempts (default 3)
  delayMs - delay between attempts in milliseconds (default 1000)
Output: Returns the result of the function if successful, otherwise throws the last error encountered
*/
async function withRetry(fn, retries = 3, delayMs = 1000) 
{
    let lastError;
    for (let attempt = 0; attempt < retries; attempt++) 
    {
        try
        {
            const result = await fn();
            return result;
        }
        catch (err)
        {
            lastError = err;
            console.warn(`withRetry: attempt ${attempt + 1} failed:`, err.message);
            if (attempt < retries - 1)
            {
                await new Promise(r => setTimeout(r, delayMs));
            }
        }
    }
    throw lastError;
}


// Exporting the functions
module.exports = { withRetry };