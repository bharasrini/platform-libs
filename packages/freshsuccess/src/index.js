require('dotenv').config({ path: __dirname + '/../.env' });

const { buildFSAccount } = require("./buildFSAccount");
const { getUserMetrics } = require("./freshsuccessMetrics");
const { fs_account } = require("./freshsuccess");

module.exports = 
{
  fs_account,
  buildFSAccount,
  getUserMetrics
};