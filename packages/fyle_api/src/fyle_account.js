
const { fyle_auth } = require("./fyle_auth");

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
    fyle_acc.auth = new fyle_auth();
    fyle_acc.categories = new fyle_category();
    fyle_acc.projects = new fyle_project();
    fyle_acc.employees = new fyle_employee();
    fyle_acc.departments = new fyle_department();
    fyle_acc.expenses = new fyle_expense();
    fyle_acc.expense_fields = new fyle_expense_fields();
    fyle_acc.blobs = new fyle_blobs();
    fyle_acc.card_transactions = new fyle_card_transactions();

    // Nothing else to do, return success
    return 0;
}

