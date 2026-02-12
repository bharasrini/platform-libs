require('dotenv').config({ path: __dirname + '/../.env' });

const { fetchFyleData, postFyleData, putFyleData } = require("./fyle_common");
const { fyle_auth } = require("./fyle_auth");

module.exports = 
{
    fetchFyleData, postFyleData, putFyleData,
    fyle_auth
};
