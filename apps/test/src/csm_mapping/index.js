const { test_csm_mapping } = require("./test_csm_mapping");

(async () => 
{
    // CS Mapping functions
    if (process.env.RUN_CSM_MAPPING_TEST === "true") await test_csm_mapping();
})();