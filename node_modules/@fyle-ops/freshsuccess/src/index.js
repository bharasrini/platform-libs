require('dotenv').config({ path: __dirname + '/../.env' });

const { fs_account, postRecordsToFS, removeCSMMappingfromFS } = require("./fs_account");
const {postContactsToFS} = require("./fs_contact");

module.exports = 
{
    fs_account,
    postRecordsToFS,
    removeCSMMappingfromFS,
    postContactsToFS
};