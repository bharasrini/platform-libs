const path = require("path");
require("dotenv").config();
require("dotenv").config({ path: __dirname + "/../.env" });

const { takeFreshdeskBackup } = require("./daily_fd_backup");

(async () => 
{
    await takeFreshdeskBackup();
})();