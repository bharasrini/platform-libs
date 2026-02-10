const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");
const { fetchFreshdeskData } = require('./fd_common');


// Freshdesk Agent class
class fd_agent
{
    constructor()
    {
      _initAgent(this);
    }

    getAgents()
    {
        return _getAgents(this);
    }

    getAgentName(agent_id)
    {
        return _getAgentName(this, agent_id);
    }

    getAgentEmail(agent_id)
    {
        return _getAgentEmail(this, agent_id);
    }

    getAgentId(agent_email)
    {
        return _getAgentId(this, agent_email);
    }
    
}


/* 
Function: _initAgent
Purpose: Initializes the Freshdesk 'agent' functionality
Inputs: Freshdesk agent instance
Output: 0 on success, -1 on failure
*/
function _initAgent(agent)
{
    // Initialize an array to store the agent list
    agent.agent_list = [];

    // Initialize number of agents
    agent.num_agents = 0;
    
    // Nothing else to do, return success
    return 0;
}



/* 
Function: _getAgents
Purpose: Gets the list of all agents from Freshdesk
Inputs: agent instance
Output: List of agents stored in agent.agent_list[]. Returns 0 on success, -1 on failure
*/
async function _getAgents(agent)
{
    // URL path for fetching agents
    var path = "agents";

    // Initialize the page and record count
    var page = process.env.FRESHDESK_START_PAGE || 1;
    const per_page = process.env.FRESHDESK_MAX_AGENTS_PER_PAGE || 100;
    var link = "";

    do
    {
        // Fetch data for the current page
        try
        {
            const {headers,data} = await fetchFreshdeskData
            ({
                path: path,
                current_page: page,
                per_page: per_page
            });

            // Check if we have a link header for pagination
            link = headers.get("link");
            link = (link   ?? "").toString().trim();

            // Initialize loop counters 
            var i = 0;  

            // Load all accounts received in this response to the account_list []
            for(i = 0; i < data.length; i++)
            {
                var agent_info = 
                {
                    "id": data[i]["id"] ? data[i]["id"] : "",
                    "name": data[i]["contact"] && data[i]["contact"]["name"]? data[i]["contact"]["name"] : "",
                    "email": data[i]["contact"] && data[i]["contact"]["email"]? data[i]["contact"]["email"] : "",
                };

                agent.agent_list.push(agent_info);

                // Increment counter
                agent.num_agents++
            }

            if(link)
            {
                page++;
            }
    /*
            if((page % 5) == 0)
            {
                common.statusMessage(arguments.callee.name, "Processing page: " + page + ", agents processed: " + agent.num_agents);
            }
    */
            // set a sleep here for 100 ms so that we don't exceed the throttle
            common.sleep(100);
        }
        catch(e)
        {
            common.statusMessage(arguments.callee.name, "Failed to get list of agents. Error:" + e.message);
            return -1;
        }

    }while(link);

    common.statusMessage(arguments.callee.name, "Successfully fetched agents. Number of agents = "+ agent.num_agents);

    return 0;
}



/* 
Function: _getAgentName
Purpose: Returns the agent name associated with the agent id passed in. Pre-requisite: getAgents() to be run prior
Inputs: agent instance, agent id (string)
Output: agent name (string)
*/
function _getAgentName(agent, agent_id)
{
    var i = 0;
    var ret = "";

    // Sanity check
    if(agent.num_agents == 0)
    {
        common.statusMessage(arguments.callee.name, "No agents to read, possibly getAgents() not called ?");
        return ret;
    }

    // Loop through the agent list to find the matching Freshdesk agent id and return the name
    for(i = 0; i < agent.num_agents; i++)
    {
        if(agent.agent_list[i].id == agent_id)
        {
            ret = agent.agent_list[i].name;
            break;
        }
    }

    return ret;
}



/* 
Function: _getAgentEmail
Purpose: Returns the agent name associated with the agent id passed in. Pre-requisite: getAgents() to be run prior
Inputs: agent instance, agent id (string)
Output: agent email (string)
*/
function _getAgentEmail(agent, agent_id)
{
    var i = 0;
    var ret = "";

    // Sanity check
    if(agent.num_agents == 0)
    {
        common.statusMessage(arguments.callee.name, "No agents to read, possibly getAgents() not called ?");
        return ret;
    }

    // Loop through the agent list to find the matching Freshdesk agent id and return the email
    for(i = 0; i < agent.num_agents; i++)
    {
        if(agent.agent_list[i].id == agent_id)
        {
            ret = agent.agent_list[i].email;
            break;
        }
    }

    return ret;
}



/* 
Function: _getAgentId
Purpose: Returns the agent ID associated with the email passed in. Pre-requisite: getAgents() to be run prior
Inputs: agent instance, agent id (string)
Output: agent email (string)
*/
function _getAgentId(agent, agent_email)
{
    var i = 0;
    var ret = "";

    // Sanity check
    if(agent.num_agents == 0)
    {
        common.statusMessage(arguments.callee.name, "No agents to read, possibly getAgents() not called ?");
        return ret;
    }

    // Loop through the agent list to find the matching Freshdesk agent email and return the id
    for(i = 0; i < agent.num_agents; i++)
    {
        if(agent.agent_list[i].email == agent_email)
        {
            ret = agent.agent_list[i].id;
            break;
        }
    }

    return ret;
}



// Exporting the class
module.exports = 
{
    fd_agent
};
