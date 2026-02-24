const { formatInTimeZone } = require("date-fns-tz");
const path = require("path");
const common = require("@fyle-ops/common");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_sleep()
{
    console.log("Sleeping for 3 seconds...");
    await common.sleep(3000);
    console.log("Awake now!");
}

async function test_getIdFromUrl()
{
    var url = "https://drive.google.com/drive/folders/1LNU3tU8F3gRoncR1kpGCfJad9zTvTteW";
    var id = common.getIdFromUrl(url);
    console.log("Extracted ID: ", id);
}


async function test_escapeHtml()
{
    var html_str = "<div>Hello & welcome to <b>Fyle</b>!</div>";
    var escaped_str = common.escapeHtml(html_str);
    console.log("Escaped HTML: ", escaped_str);
}

async function test_validateEmailAddress()
{
    var email = "test@example.com";
    var is_valid = common.validateEmailAddress(email);
    console.log("Set1: Is valid email: ", is_valid);

    email = "invalid-email";
    is_valid = common.validateEmailAddress(email);
    console.log("Set2: Is valid email: ", is_valid);
}

async function test_parseEmail()
{
    var email_list = "bharadwaj.srinivasan@fyle.in, bharasrini@yahoo.com, test.user@domain";
    var email_out = [];
    common.parseEmail(email_list, email_out);
    console.log("Parsed email: ", email_out);
}

async function test_getNameFromEmail()
{
    var email = "bharadwaj.srinivasan@fyle.in";
    var name = common.getNameFromEmail(email);
    console.log("Extracted name: ", name);
}

async function test_replaceSpecialChars()
{
    var str = "Hello, World/2024(Test)?";
    const special_chars_list = [' ', ',', ':', ';', '.', '(', ')', '{', '}', '/', '\\', '"', '<', '>', '?', '&', '-'];
    const char_to_replace_with = '+';
    var replaced_str = common.replaceSpecialChars(str, special_chars_list, char_to_replace_with);
    console.log("Replaced string: ", replaced_str);
}

async function test_replaceKnownSpecialCharsWithUnderscore()
{
    var str = "Hello, World/2024(Test)?";
    var replaced_str = common.replaceKnownSpecialCharsWithUnderscore(str);
    console.log("Replaced string: ", replaced_str);
}

async function test_matchWithinXPercent()
{
    var num1 = 100;
    var num2 = 105;
    var percent = 0.1; // 10%
    var is_within = common.matchWithinXPercent(num1, num2, percent);
    console.log("Set 1: Num1: ", num1, ", Num2: ", num2, ", Percent: ", percent, ", Is within: ", is_within);

    num1 = 100;
    num2 = 120;
    percent = 0.1;  // 10%
    is_within = common.matchWithinXPercent(num1, num2, percent);
    console.log("Set 2: Num1: ", num1, ", Num2: ", num2, ", Percent: ", percent, ", Is within: ", is_within);
}

async function test_checkType()
{
    var value = [1,2,3];
    var is_type = common.checkType(value);
    console.log("Set 1: Value: ", value, ", Is type: ", is_type);

    var object_value = {key: "value"};
    is_type = common.checkType(object_value);
    console.log("Set 2: Value: ", object_value, ", Is type: ", is_type);

    var date_value = new Date();
    is_type = common.checkType(date_value);
    console.log("Set 3: Value: ", date_value, ", Is type: ", is_type);
}

async function test_flattenStructure()
{
    var nested_object = {key: "value", arr: [1,2,3], obj: {nested_key: "nested_value"}};
    var flattenedHeaders = {};
    var new_data_array = [];
    var result = common.flattenStructure(nested_object, '', {});
    console.log("Result: ", result);
}

async function test_convertNestedDatato2DArray()
{
    const data_array = 
    [
        {
            id: 101,
            name: "Bharadwaj",
            contact: 
            {
                email: "bharadwaj.srinivasan@fyle.in",
                phone: "99999"
            },
            tags: ["cs", "india"],
            addresses: 
            [
                { type: "home", city: "Bangalore", pin: 560001 },
                { type: "office", city: "ECity", pin: 560100 }
            ],
            active: true
        },
        {
            id: 102,
            name: "John Doe",
            contact: 
            {
                email: "john.doe@example.com",
                phone: null       // tests null handling
            },
            tags: ["cs", "usa"],
            addresses: [],
            active: false
        }
    ];

    const [headers, ...rows] = common.convertNestedDatato2DArray(data_array);
    console.log("Headers: ", headers);
    console.log("Rows: ", rows);
}

async function test_getLastRowAndCol()
{
    const data1 = 
    [
        ["id", "name", "age"],
        [1, "Alice", 30],
        [2, "Bob", 25],
        [3, "Charlie", 35]
    ];

    const data2 = 
    [
        ["id", "name", "email", "phone"],
        [1, "Alice"],
        [2, "Bob", "bob@example.com"],
        [3]
    ];

    const data3 = 
    [
        ["A", "B", "C"],
        [],
        ["X", "Y"],
        [],
        ["P", "Q", "R", "S"]
    ];

    const {lastRow: num_rows1, lastColumn: num_cols1} = common.getLastRowAndCol(data1);
    console.log("Data 1: ", data1, ", Last Row: ", num_rows1, ", Last Col: ", num_cols1);

    const {lastRow: num_rows2, lastColumn: num_cols2} = common.getLastRowAndCol(data2);
    console.log("Data 2: ", data2, ", Last Row: ", num_rows2, ", Last Col: ", num_cols2);

    const {lastRow: num_rows3, lastColumn: num_cols3} = common.getLastRowAndCol(data3);
    console.log("Data 3: ", data3, ", Last Row: ", num_rows3, ", Last Col: ", num_cols3);
}

async function test_sameStringSet()
{
    var set1 = ["a", "b", "c"];
    var set2 = ["c", "b", "a"];
    var are_same = common.sameStringSet(set1, set2);
    console.log("Set 1: ", set1, ", Set 2: ", set2, ", Are same sets: ", are_same);

    set1 = ["a", "b", "c"];
    set2 = ["a", "b", "d"];
    are_same = common.sameStringSet(set1, set2);
    console.log("Set 1: ", set1, ", Set 2: ", set2, ", Are same sets: ", are_same);
}


async function test_levDistance()
{
    var str1 = "kitten";
    var str2 = "sitting";
    var distance = common.LevDis(str1, str2);
    console.log("String 1: ", str1, ", String 2: ", str2, ", Levenshtein Distance: ", distance);

    str1 = "flaw";
    str2 = "lawn";
    distance = common.LevDis(str1, str2);
    console.log("String 1: ", str1, ", String 2: ", str2, ", Levenshtein Distance: ", distance);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function test_common_misc()
{
    // Misc functions
    if(process.env.RUN_TEST_COMMON_SLEEP === "true") await test_sleep();
    if(process.env.RUN_TEST_COMMON_GET_ID_FROM_URL === "true") await test_getIdFromUrl();
    if(process.env.RUN_TEST_COMMON_ESCAPE_HTML === "true") await test_escapeHtml();
    if(process.env.RUN_TEST_COMMON_VALIDATE_EMAIL_ADDRESS === "true") await test_validateEmailAddress();
    if(process.env.RUN_TEST_COMMON_PARSE_EMAIL === "true") await test_parseEmail();
    if(process.env.RUN_TEST_COMMON_GET_NAME_FROM_EMAIL === "true") test_getNameFromEmail();
    if(process.env.RUN_TEST_COMMON_REPLACE_SPECIAL_CHARS === "true") test_replaceSpecialChars();
    if(process.env.RUN_TEST_COMMON_REPLACE_KNOWN_SPECIAL_CHARS_WITH_UNDERSCORE === "true") test_replaceKnownSpecialCharsWithUnderscore();
    if(process.env.RUN_TEST_COMMON_MATCH_WITHIN_X_PERCENT === "true") test_matchWithinXPercent();
    if(process.env.RUN_TEST_COMMON_CHECK_TYPE === "true") test_checkType();
    if(process.env.RUN_TEST_COMMON_FLATTEN_STRUCTURE === "true") test_flattenStructure();
    if(process.env.RUN_TEST_COMMON_CONVERT_NESTED_DATA_TO_2D_ARRAY === "true") test_convertNestedDatato2DArray();
    if(process.env.RUN_TEST_COMMON_GET_LAST_ROW_AND_COL === "true") test_getLastRowAndCol();
    if(process.env.RUN_TEST_COMMON_SAME_STRING_SET === "true") test_sameStringSet();
    if(process.env.RUN_TEST_COMMON_LEV_DIS === "true") test_levDistance();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = 
{
    test_common_misc
};