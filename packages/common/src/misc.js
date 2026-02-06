
/* 
Function: getIdFromUrl
Purpose: Extracts the ID portion from the folder or file URL
Inputs: URL (string)
Output: ID (string)
Source: ChatGPT
*/
function getIdFromUrl(url) {
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


module.exports = { 
    getIdFromUrl,
};

