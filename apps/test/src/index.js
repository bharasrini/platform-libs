require("dotenv").config();
require("dotenv").config({ path: __dirname + "/../.env" });

require("./account_mapping");
require("./billing");
require("./common");
require("./csm_mapping");
require("./freshdesk");
require("./freshsuccess");
require("./fyle_api");

