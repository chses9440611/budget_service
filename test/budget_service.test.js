const dayjs = require("dayjs");

class BudgetService{
    totalAmount(startdate, enddate) {

    }
}
class Budget {
    constructor(yearMonth, amount)  {
        this.yearMonth = yearMonth;
        this.amount = amount;
    }
}

const BudgetRepo = [
    new Budget('202406', 300000),
    new Budget('202407', 3100),
    new Budget('202408', 31),
]
describe('budget_service add', () => {
    it('positive dadd positive', () => {

        expect(dayjs('202407').daysInMonth).toBe(31);
    });
});

describe('Tennis init', () => {
});