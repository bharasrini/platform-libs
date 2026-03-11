const path = require("path");
require("dotenv").config();
require("dotenv").config({ path: __dirname + "/../.env" });

const { takeFreshsuccessBackup } = require("./daily_fs_backup");

(async () => 
{
    await takeFreshsuccessBackup();
})();