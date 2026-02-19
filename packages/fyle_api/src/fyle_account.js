const common = require("@fyle-ops/common");

const { fetchFyleData, postFyleData, putFyleData } = require("./fyle_common");
const { fyle_auth } = require("./fyle_auth");
const { fyle_category } = require("./fyle_category");
const { fyle_project } = require("./fyle_project");
const { fyle_employee } = require("./fyle_employee");
const { fyle_department } = require("./fyle_department");
const { fyle_expense } = require("./fyle_expense");
const { fyle_expense_field } = require("./fyle_expense_field");
const { fyle_receipt } = require("./fyle_receipt");
const { fyle_card_transaction } = require("./fyle_card_transaction");


// Class to manage Fyle Account
class fyle_account
{
    constructor()
    {
        _initFyleAccount(this);
    }
}



/* 
Function: _initFyleAccount
Purpose: Initializes the 'fyle_account' instance
Pre-requisite: None
Inputs: fyle_account instance
Output: 0 on success, -1 on failure
*/
function _initFyleAccount(fyle_acc)
{
    fyle_acc.auth = new fyle_auth(fyle_acc);
    fyle_acc.category = new fyle_category(fyle_acc);
    fyle_acc.project = new fyle_project(fyle_acc);
    fyle_acc.employee = new fyle_employee(fyle_acc);
    fyle_acc.department = new fyle_department(fyle_acc);
    fyle_acc.expense = new fyle_expense(fyle_acc);
    fyle_acc.expense_field = new fyle_expense_field(fyle_acc);
    fyle_acc.receipt = new fyle_receipt(fyle_acc);
    fyle_acc.card_transaction = new fyle_card_transaction(fyle_acc);

    // Nothing else to do, return success
    return 0;
}

// Export the class
module.exports =
{
    fyle_account
};