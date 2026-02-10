const { fd_company, createNewCompanyonFD } = require("@fyle-ops/freshdesk");
const { fd_group } = require("@fyle-ops/freshdesk");
const { fd_agent } = require("@fyle-ops/freshdesk");
const { fd_business_hours } = require("@fyle-ops/freshdesk");
const { fd_tickets } = require("@fyle-ops/freshdesk");
const { fd_ticket_fields } = require("@fyle-ops/freshdesk");


async function test_fd_tickets()
{
    const tickets = new fd_tickets();
    await tickets.getTickets(null, null, null, "2025-09-01T00:00:00Z");
    console.log("Tickets read successfully !!!");
    console.log("Total tickets read: ", tickets.num_tickets);
}

async function test_fd_ticket_fields()
{
    const ticket_fields = new fd_ticket_fields();
    await ticket_fields.getTicketFields();
    const status_label = await ticket_fields.getTicketStatusVal(15);
    const status_code = await ticket_fields.getTicketStatusCode("Waiting on Customer");
    const source_label = await ticket_fields.getTicketSourceVal(7);
    const source_code = await ticket_fields.getTicketSourceCode("Chat");
    const priority_label = await ticket_fields.getTicketPriorityVal(3);
    const priority_code = await ticket_fields.getTicketPriorityCode("Urgent");
    console.log("Ticket fields read successfully !!!");
}

async function test_fd_business_hours()
{
    const business_hours = new fd_business_hours();
    await business_hours.getBusinessHours();
    console.log("Business hours read successfully !!!");
}

async function test_fd_agent()
{
    const agent = new fd_agent();
    await agent.getAgents();
    console.log("Agents read successfully !!!");
}

async function test_fd_group()
{
    const group = new fd_group();
    await group.getGroups();
    console.log("Groups read successfully !!!");
}

async function test_fd_company()
{
    const company = new fd_company();
    await company.getCompanies();
    console.log("Companies read successfully !!!");
}

async function test_createNewCompanyonFD()
{
    var company_details = 
    {
        "org_id": "orvsqbHlOV2V623",
        "parent_org_id": "orvsqbHlOV2V634",
        "crm_account_id": "TCARE Inc1654",
        "org_domain": ["tcare.ai6a"],
        "csm_name": "Bency Ann Varghese",
        "account_tier": "Silver: ARR $1-3K",
        "arr": 2000,
        "source": "Referral",
        "partner": "MDK",
        "id": "",
    };
    await createNewCompanyonFD(company_details);
}


async function test_fd_updateCompanyName()
{
    const company = new fd_company();
    await company.getCompanies();
    const data = await company.updateAccountName("orvsqbHlOV2V623", "TCARE Inc1666");
    console.log("Company name updated successfully !!!");
}


async function test_fd()
{
    if(process.env.RUN_TEST_FD_TICKETS === "true") await test_fd_tickets();
    if(process.env.RUN_TEST_FD_TICKET_FIELDS === "true") await test_fd_ticket_fields();
    if(process.env.RUN_TEST_FD_BUSINESS_HOURS === "true") await test_fd_business_hours();
    if(process.env.RUN_TEST_FD_AGENT === "true") await test_fd_agent();
    if(process.env.RUN_TEST_FD_GROUP === "true") await test_fd_group();
    if(process.env.RUN_TEST_FD_COMPANY === "true") await test_fd_company();
    if(process.env.RUN_TEST_CREATE_NEW_COMPANY_ON_FD === "true") await test_createNewCompanyonFD();
    if(process.env.RUN_TEST_UPDATE_COMPANY_NAME_ON_FD === "true") await test_fd_updateCompanyName();
}

module.exports =
{
    test_fd
};