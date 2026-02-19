const { formatInTimeZone } = require("date-fns-tz");

const { fd_company, createNewCompanyonFD } = require("@fyle-ops/freshdesk");
const { fd_group } = require("@fyle-ops/freshdesk");
const { fd_agent } = require("@fyle-ops/freshdesk");
const { fd_business_hours } = require("@fyle-ops/freshdesk");
const { fd_tickets } = require("@fyle-ops/freshdesk");
const { fd_ticket_fields } = require("@fyle-ops/freshdesk");
const { setTicketField } = require("@fyle-ops/freshdesk");
const { fd_contacts, updateContact, addContact } = require("@fyle-ops/freshdesk");
const { fd_ratings } = require("@fyle-ops/freshdesk");

async function test_fd_get_tickets()
{
    const tickets = new fd_tickets();
    await tickets.getTickets(null, null, null, "2025-09-01T00:00:00Z");
    console.log("Tickets read successfully !!!");
    console.log("Total tickets read: ", tickets.num_tickets);
}

async function test_fd_get_ticket_fields()
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

async function test_fd_get_agents()
{
    const agent = new fd_agent();
    await agent.getAgents();
    console.log("Agents read successfully !!!");
}

async function test_fd_get_business_hours()
{
    const business_hours = new fd_business_hours();
    await business_hours.getBusinessHours();
    console.log("Business hours read successfully !!!");
}

async function test_fd_get_groups()
{
    const group = new fd_group();
    await group.getGroups();
    console.log("Groups read successfully !!!");
}

async function test_fd_get_companies()
{
    const company = new fd_company();
    await company.getCompanies();
    console.log("Companies read successfully !!!");
}

async function test_fd_createNewCompany()
{
    var company_details = 
    {
        "org_id": "orvsqbHlOV2V6233",
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
    const data = await company.updateAccountName("orvsqbHlOV2V623", "TCARE Inc16667");
    console.log("Company name updated successfully !!!");
}


async function test_fd_updateCSM()
{
    const company = new fd_company();
    await company.getCompanies();
    const data = await company.updateCSM("orvsqbHlOV2V623", "Bharadwaj Srinivasan");
    console.log("CSM updated successfully !!!");
}


async function test_fd_updateAccountTier()
{
    const company = new fd_company();
    await company.getCompanies();
    const data = await company.updateAccountTier("orvsqbHlOV2V623", "Gold: ARR $3-5K");
    console.log("Account tier updated successfully !!!");
}


async function test_fd_updateAccountDomains()
{
    const company = new fd_company();
    await company.getCompanies();
    const data = await company.updateAccountDomains("orvsqbHlOV2V623", ["tcare.ai6c"]);
    console.log("Account domains updated successfully !!!");
}


async function test_fd_updateAccountARR()
{
    const company = new fd_company();
    await company.getCompanies();
    const data = await company.updateARR("orvsqbHlOV2V623", 3000);
    console.log("Account ARR updated successfully !!!");
}


async function test_fd_updateAccountSource()
{
    const company = new fd_company();
    await company.getCompanies();
    const data = await company.updateSource("orvsqbHlOV2V623", "Reseller");
    console.log("Account Source updated successfully !!!");
}

async function test_fd_updateAccountPartner()
{
    const company = new fd_company();
    await company.getCompanies();
    const data = await company.updatePartner("orvsqbHlOV2V623", "Baker Tilly");
    console.log("Account Partner updated successfully !!!");
}

async function test_fd_set_ticket_data()
{
    var ret = {};
    var ticket_id = 83222; // promotions ticket
    var responder_id = 9030391174; // Jahaber Sathik
    var due_by = "2025-09-30T12:00:00Z";
    var status = 7; // Waiting on Third Party
    await setTicketField(ticket_id, "responder_id", responder_id, ret);
    await setTicketField(ticket_id, "due_by", due_by, ret);
    await setTicketField(ticket_id, "status", status, ret);
    console.log("Ticket fields updated successfully !!!");
}

async function test_fd_get_contacts()
{
    const contact = new fd_contacts();
    await contact.getContacts();
    console.log("Contacts read successfully !!!");
}

async function test_fd_add_contact()
{
    var name = "Bharadwaj"
    var email = "bharasrinihello123@yahoo.com";
    var role = "Root Admin";
    await addContact(name, email, role);
    console.log("Contact added successfully !!!");
}

async function test_fd_update_contact()
{
    var curr_email = "bharasrini123@yahoo.com";
    var new_name = "Bharadwaj Srinivasan 123"
    var new_email = "bharasrini1234@yahoo.com";
    var new_role = "Super Duper Admin";
    await updateContact(curr_email, new_name, new_email, new_role);
    console.log("Contact updated successfully !!!");
}
 

async function test_fd_get_ratings()
{
    const ratings = new fd_ratings();
    var created_since_date = new Date(2025, 0, 1);
    var created_since = formatInTimeZone(created_since_date, 'UTC', 'yyyy-MM-dd');
    await ratings.getRatings(created_since);
    console.log("Ratings read successfully !!!");
    console.log("Total ratings read: ", ratings.num_ratings);
}

async function test_fd()
{
    if(process.env.RUN_TEST_FD_GET_TICKETS === "true") await test_fd_get_tickets();
    if(process.env.RUN_TEST_FD_GET_TICKET_FIELDS === "true") await test_fd_get_ticket_fields();
    if(process.env.RUN_TEST_FD_GET_AGENTS === "true") await test_fd_get_agents();
    if(process.env.RUN_TEST_FD_GET_BUSINESS_HOURS === "true") await test_fd_get_business_hours();
    if(process.env.RUN_TEST_FD_GET_GROUPS === "true") await test_fd_get_groups();
    if(process.env.RUN_TEST_FD_GET_COMPANIES === "true") await test_fd_get_companies();
    if(process.env.RUN_TEST_FD_CREATE_NEW_COMPANY === "true") await test_fd_createNewCompany();
    if(process.env.RUN_TEST_FD_UPDATE_COMPANY_NAME === "true") await test_fd_updateCompanyName();
    if(process.env.RUN_TEST_FD_UPDATE_CSM === "true") await test_fd_updateCSM();
    if(process.env.RUN_TEST_FD_UPDATE_ACCOUNT_TIER === "true") await test_fd_updateAccountTier();
    if(process.env.RUN_TEST_FD_UPDATE_ACCOUNT_DOMAINS === "true") await test_fd_updateAccountDomains();
    if(process.env.RUN_TEST_FD_UPDATE_ACCOUNT_ARR === "true") await test_fd_updateAccountARR();
    if(process.env.RUN_TEST_FD_UPDATE_ACCOUNT_SOURCE === "true") await test_fd_updateAccountSource();
    if(process.env.RUN_TEST_FD_UPDATE_ACCOUNT_PARTNER === "true") await test_fd_updateAccountPartner();
    if(process.env.RUN_TEST_FD_SET_TICKET_DATA === "true") await test_fd_set_ticket_data();
    if(process.env.RUN_TEST_FD_GET_CONTACTS === "true") await test_fd_get_contacts();
    if(process.env.RUN_TEST_FD_ADD_CONTACT === "true") await test_fd_add_contact();
    if(process.env.RUN_TEST_FD_UPDATE_CONTACT === "true") await test_fd_update_contact();
    if(process.env.RUN_TEST_FD_GET_RATINGS === "true") await test_fd_get_ratings();
}


// Export functions
module.exports =
{
    test_fd
};

