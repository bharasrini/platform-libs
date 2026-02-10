

/* 
Function: sleep
Purpose: Returns a promise that resolves after ms milliseconds
Inputs: milliseconds
Output: Promise that resolves after ms milliseconds
*/
function sleep(ms) 
{ 
  return new Promise(r => setTimeout(r, ms)); 
}


/* 
Function: getIdFromUrl
Purpose: Extracts the ID portion from the folder or file URL
Inputs: URL (string)
Output: ID (string)
Source: ChatGPT
*/
function getIdFromUrl(url) 
{
    var id = "";
    var match = /[-\w]{25,}/.exec(url);
    if (match) {
        id = match[0];
    } else if (/open\?id=(\w+)/.test(url)) {
        id = /open\?id=(\w+)/.exec(url)[1];
    } else if (/drive\/folders\/(\w+)/.test(url)) {
        id = /drive\/folders\/(\w+)/.exec(url)[1];
    } else if (/drive\/u\/\d+\/folders\/(\w+)/.test(url)) {
        id = /drive\/u\/\d+\/folders\/(\w+)/.exec(url)[1];
    } else if (/drive\/u\/\d+\/file\/d\/(\w+)\//.test(url)) {
        id = /drive\/u\/\d+\/file\/d\/(\w+)\//.exec(url)[1];
    } else if (/\/d\/(\w+)\//.test(url)) {
        id = /\/d\/(\w+)\//.exec(url)[1];
    } else if (/uc\?id=(\w+)&/.test(url)) {
        id = /uc\?id=(\w+)&/.exec(url)[1];
    } else if (/view\?usp=sharing&id=(\w+)/.test(url)) {
        id = /view\?usp=sharing&id=(\w+)/.exec(url)[1];
    } else {
        console.log("Invalid URL: " + url);
    }
    return id;
}



/* 
Function: escapeHtml
Purpose: Escapes special characters from the HTML string
Inputs: string (with special characters)
Output: string with special characters escaped
Credits - https://github.com/janl/mustache.js/blob/master/mustache.js#L73
*/
const entityMap = 
{
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHtml (string) 
{
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s)
    {
        return entityMap[s];
    });
}


/*
Function: validateEmailAddress
Purpose: Checks if the email address is valid
Inputs: Email address to be checked
Output: true if the address is valid, false otherwise
*/
function validateEmailAddress(email_address)
{

    //var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var validRegex = /\S+@\S+\.\S+/;

    if (validRegex.test(email_address))
        return true;
    else
        return false;
}



/*
Function: parseEmail
Purpose: Parses the email list that is passed in, removes identified special characters and stores it as an array of email addresses
Inputs: Email list, Array of email addresses (output)
Output: none
*/
function parseEmail(this_email, this_email_arr)
{
    var split_str = [];

    // First replace all the '[', ']', '{', '}', ' ' & '"' by ""
    this_email = this_email.toString().replace("[","");
    this_email = this_email.toString().replace("]","");
    this_email = this_email.toString().replace("{","");
    this_email = this_email.toString().replace("}","");
    this_email = this_email.toString().replace(/\"+/g,"");

    split_str = this_email.toString().split(",");
  
    for(var i = 0; i < split_str.length; i++) 
    {
        if(split_str[i].toString().trim() == "") continue;
        
        var found = false;
        for(var j = 0; j < this_email_arr.length; j++)
        {
            if((split_str[i]).toString().trim() == this_email_arr[j])
            {
                found = true;
                break;
            }
        }

        // Add only if not found & non-blank
        if(found == false) this_email_arr.push((split_str[i]).toString().trim());
    }

    return;
}



/*
Function: getNameFromEmail
Purpose: Generates a name from the email address passed in
Inputs: email
Output: none
*/
function getNameFromEmail(email)
{
    var final = ""

    // Sanity check
    if(email.toString().trim() == "")
    {
        statusMessage(arguments.callee.name, "Blank email", true, -1);
        return "";
    }

    // Split the email at the '@'
    var offset = email.lastIndexOf("@");
    if(offset < 0)
    {
        statusMessage(arguments.callee.name, "Invalid email: " + email, true, -1);
        return "";
    }

    var name = email.substring(0, offset);
    if(name.toString().trim() == "")
    {
        statusMessage(arguments.callee.name, "Failed to extract name from email: " + email, true, -1);
        return "";
    }

    // Split the name at the period (.)
    var split_str = name.toString().split(".");

    // Convert to uppercase
    for(var i = 0; i < split_str.length; i++) split_str[i] = (split_str[i]).toUpperCase();

    // Join the split pieces
    for(var i = 0; i < split_str.length; i++)
    {
        if(i > 0) final += " ";
        final += split_str[i];
    }

    return final;
}



/*
Function: replaceSpecialChars
Purpose: Replaces special characters in the string passed in (as per the special_chars_list[]) with a specific character
Inputs: string in which special characters need to be replaced, list of special characters, character to replace with
Output: final string in which all special characters are replaced
*/
function replaceSpecialChars(string_to_replace, special_chars_list, char_to_replace_with)
{
    for(var i = 0; i < special_chars_list.length; i++)
    {
        string_to_replace = string_to_replace.replaceAll(special_chars_list[i], char_to_replace_with);
    }

    // Make sure there are no double occurrences of the char_to_replace_with
    if(char_to_replace_with != '')
    {
        var double_char_to_replace_with = char_to_replace_with.toString() + char_to_replace_with.toString();
        while(string_to_replace.indexOf(double_char_to_replace_with) > -1)
        {
            string_to_replace = string_to_replace.replace(double_char_to_replace_with, char_to_replace_with);
        }
    }

    // Make sure the first and last character are not char_to_replace_with
    if(string_to_replace.indexOf(char_to_replace_with) == 0) string_to_replace = string_to_replace.substring(1);
    var reverse_string = string_to_replace.split("").reverse().join("");
    if(reverse_string.indexOf(char_to_replace_with) == 0) reverse_string = reverse_string.substring(1);
    string_to_replace = reverse_string.split("").reverse().join("");

    return string_to_replace;
}


/*
Function: replaceKnownSpecialCharsWithUnderscore
Purpose: Replaces 'known' special characters in the string passed in with '_'
Inputs: string in which special characters need to be replaced
Output: final string in which all special characters are replaced
*/
function replaceKnownSpecialCharsWithUnderscore(string_to_replace)
{
    const special_chars_list = [' ', ',', ':', ';', '.', '(', ')', '{', '}', '/', '\\', '"', '<', '>', '?', '&', '-'];
    const char_to_replace_with = '_';
    return replaceSpecialChars(string_to_replace, special_chars_list, char_to_replace_with);
}



/*
Function: matchWithinXPercent
Purpose: Checks if the 2 numbers are within 'percentage' distance of each other (i.e. 1+/-perc)
Inputs: number 1, number 2, percentage
Output: true if they are percentage distance, false otherwise
*/
function matchWithinXPercent(num_a, num_b, perc)
{
    var num_a_plus_perc = num_a * (1 + perc);
    var num_a_minus_perc = num_a * (1 - perc);
    var num_b_plus_perc = num_b * (1 + perc);
    var num_b_minus_perc = num_b * (1 - perc);

    // If either num_a is within num_b_plus_perc or num_b_minus_perc, return true
    if((num_a >= num_b_minus_perc) && (num_a <= num_b_plus_perc)) return true;

    // If either num_b is within num_a_plus_perc or num_a_minus_perc, return true
    if((num_b >= num_a_minus_perc) && (num_b <= num_a_plus_perc)) return true;

    return false;
}


/*
Function: checkType
Purpose: Checks for the type of element passed in
Inputs: element
Output: type of element (array, date, object, string, number)
*/
function checkType(element) 
{
    if (Array.isArray(element)) return "array";
    else if (element instanceof Date) return "date";
    else if (typeof element === 'object') 
    {
        // Attempt to create a Date object from the string
        var dateObject = new Date(element);
        // Check if the dateObject is a valid date
        if (!isNaN(dateObject.getTime())) return "date";
        else return "object";
    }
    else return typeof (element);
}



/*
Function: flattenStructure
Purpose: Flattens out the structure passed in to show all members of constituent arrays or structures. It's invoked recursively
Inputs: structure, flattended output, prefix for the field (if any), new data array (to also store the flattened data in), row index in the new data array
Output: flattended structured in flattened {}, also copy of the flattened structure in new_data_array[row]
Source: ChatGPT
*/
function flattenStructure(structure, flattened, prefix, new_data_array, row) 
{
    for (var key in structure) 
    {
        if (structure.hasOwnProperty(key)) 
        {
            var value = structure[key];
            var newKey = prefix ? prefix + '.' + key : key;
            var type = checkType(value);

            if(type == "array")
            {
                if (value.length > 0 && typeof value[0] === 'object') 
                {
                    for(var i = 0; i < value.length; i++)
                    {
                        flattenStructure(value[i], flattened, newKey + '[' + i + ']', new_data_array, row);
                    }
                } 
                else 
                {
                    flattened[newKey] = value.join(', ');

                    if(new_data_array[row])
                    {
                        new_data_array[row][newKey] = value.join(', ');
                    }
                    else
                    {
                        var this_field = {newKey: value.join(', ')};
                        new_data_array.push(this_field);
                    }
                }                
            }
            else if (type == "object") 
            {
                flattenStructure(value, flattened, newKey, new_data_array, row);
            } 
            else 
            {
                flattened[newKey] = value;

                if(new_data_array[row])
                {
                    new_data_array[row][newKey] = value;
                }
                else
                {
                    var this_field = {};
                    new_data_array.push(this_field);
                    new_data_array[row][newKey] = value;
                }
            }
        }
    }

    return;
}



//
// Levenshtein Distance Function for Google Sheets
// 
// This function calculates de Levenshtein Distance (or Edit Distance) between two strings.
// I used the algorith and code from Wikipedia (https://en.wikipedia.org/wiki/Levenshtein_distance)
// as a reference and just adjusted the code to be used on Google Sheets.
//
// By: Manoel Lemos / manoel@lemos.net / http://manoellemos.com
//
// IMPORTANT: I added some code in the begining of the function to try to solve the issues
// related to rate-limit of App Scripts in Google Sheets. There is a limit of how many times
// per second you can call external funcions on Google Sheets. The code is a bit dumb and makes
// everything much slower, but it worked for me. You can comment it if you don't need too many
// calls (you'll have much faster response times).
//
 
function LevDis(s,t)
{
    // Workaround on Google Sheets rate-limit for external functions 
    //var sleep = Math.floor((Math.random() * 3000) + 1);
    //Utilities.sleep(3000+sleep);
    
    // The code
    if (s == t) return 0;
    if (s.length == 0) return t.length;
    if (t.length == 0) return s.length;
  
    var v0 = [];
    var v1 = [];
    var i;
    var j;
    var cost;
  
    for (i = 0; i < (t.length+1); i++) 
    {
        v0[i] = i;
    }
  
    for(i = 0; i < s.length; i++)
    {
        v1[0] = i + 1;  
        for(j = 0; j < t.length; j++)
        {
            if (s[i] == t[j])
            {
                cost = 0;
            }
            else
            {
                cost = 1;
            }
            v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
        }
        for(j = 0; j < (t.length+1); j++) 
        {
            v0[j] = v1[j];
        }
    }

    return v1[t.length];  
}


//------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------



// Exporting the functions
module.exports = 
{
    sleep,
    getIdFromUrl,
    escapeHtml,
    validateEmailAddress,
    parseEmail,
    getNameFromEmail,
    replaceSpecialChars,
    replaceKnownSpecialCharsWithUnderscore,
    matchWithinXPercent,
    checkType,
    flattenStructure,
    LevDis,
};

