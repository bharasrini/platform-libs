const csm_mapping = require("@fyle-ops/csm_mapping");

async function test_csm_mapping_get_fd_name()
{
    var email = "hemanth.s@fylehq.com";
    var csm_name = csm_mapping.returnFDCSMNameForEmail(email);
    console.log("CSM Name for email " + email + " is " + csm_name);
}

async function test_csm_mapping_get_email()
{
    var csm_name = "Hemanth Singanamalla";
    var email = csm_mapping.returnEmailForFDCSMName(csm_name);
    console.log("Email for CSM Name " + csm_name + " is " + email);
}


async function test_csm_mapping()
{
    if(process.env.RUN_TEST_CSM_MAPPING_GET_FD_NAME === "true") await test_csm_mapping_get_fd_name();
    if(process.env.RUN_TEST_CSM_MAPPING_GET_EMAIL === "true") await test_csm_mapping_get_email();
}

module.exports =
{
    test_csm_mapping
};