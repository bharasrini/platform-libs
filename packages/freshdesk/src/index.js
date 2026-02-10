require('dotenv').config({ path: __dirname + '/../.env' });

const { fd_company, createNewCompanyonFD } = require("./fd_company");
const { fd_group } = require("./fd_group");
const { fd_agent } = require("./fd_agent");
const { fd_business_hours } = require("./fd_business_hours");
const { fd_ticket_fields } = require("./fd_ticket_fields");
const { fd_tickets } = require("./fd_tickets");

module.exports = 
{
    fd_company, createNewCompanyonFD,
    fd_group,
    fd_agent,
    fd_business_hours,
    fd_ticket_fields,
    fd_tickets,
};
