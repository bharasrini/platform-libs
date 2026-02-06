/* 
Function: statusMessage
Purpose: Log the message to execution logs
Inputs: calling_func - name of the calling function, message - message to log and display
Output: none
*/
function statusMessage(calling_func, message) 
{
    var final_message = calling_func + ": " + message;

    // Log the message to the console
    console.log(final_message);

    return;
}



module.exports = { 
    statusMessage,
};

