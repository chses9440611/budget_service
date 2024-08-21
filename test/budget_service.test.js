const dayjs = require("dayjs");

class BudgetService{
    totalAmount(start, end) {
        // start = dayjs(start);
        // let startMon = start.month();
        // end = dayjs(end);
        // let endMon = end.month();
        // let startYear = start.year();
        // let endYear = end.year();
        // if(endMon !== startMon || (startYear !== endYear && endMon === startMon)) {
        //     let days_in_start_month = start.daysInMonth();
        //     let days_in_end_month = end.daysInMonth();
        //     let start_budget =  BudgetRepo.find(budget => budget.yearMonth === start.format('YYYYMM'))?.amount || 0;
        //     let end_budget = BudgetRepo.find(budget => budget.yearMonth === end.format('YYYYMM'))?.amount || 0;
        //     let firstMonthAmount = (days_in_start_month - start.date() + 1) * start_budget / days_in_start_month;
        //     let secondMonthAmount = (end.date()) * end_budget / days_in_end_month;
        //     let diffMon = endMon - startMon;
        //     if(diffMon > 1) {
        //         let middleAmount = 0;
        //         for(let i = 1; i < diffMon; i++) {
        //             let budget = BudgetRepo.find(budget => budget.yearMonth === start?.add(i, 'month').format('YYYYMM'))?.amount||0;
        //             middleAmount += budget;
        //         }
        //         return firstMonthAmount + secondMonthAmount + middleAmount;
        //     }
        //     return firstMonthAmount + secondMonthAmount;
        // }
        // let day_diff = end.diff(start, 'day');
        // if(day_diff >= 0) {
        //     let days_in_month = start.daysInMonth();
        //     let budget = BudgetRepo.find(budget => budget.yearMonth === start.format('YYYYMM'))?.amount || 0;
        //     return (day_diff+1) * budget / days_in_month;
        // }
        // if( day_diff < 0) {
        //     return 0;
        // }
        const startDate = dayjs(start);
        const endDate = dayjs(end);
        let totalAmount = 0;

        if (endDate.isBefore(startDate)) {
            return 0; // 如果結束日期在開始日期之前，返回0
        }

        let currentMonth = startDate.startOf('month');

        while (currentMonth.isBefore(endDate) || currentMonth.isSame(endDate, 'month')) {
            let budget = BudgetRepo.find(budget => budget.yearMonth === currentMonth.format('YYYYMM'))?.amount || 0;

            if (budget === undefined) {
                throw new Error(`Budget not found for the month: ${currentMonth.format('YYYYMM')}`);
            }

            if (currentMonth.isSame(startDate, 'month') && currentMonth.isSame(endDate, 'month')) {
// 如果開始和結束日期在同一個月份內
                let day_diff = endDate.diff(startDate, 'day') + 1;
                let days_in_month = currentMonth.daysInMonth();
                totalAmount += (day_diff * budget) / days_in_month;
            } else if (currentMonth.isSame(startDate, 'month')) {
// 處理開始月份
                let startMonthDaysUsed = currentMonth.daysInMonth() - startDate.date() + 1;
                totalAmount += (startMonthDaysUsed * budget) / currentMonth.daysInMonth();
            } else if (currentMonth.isSame(endDate, 'month')) {
// 處理結束月份
                let endMonthDaysUsed = endDate.date();
                totalAmount += (endMonthDaysUsed * budget) / currentMonth.daysInMonth();
            } else {
// 處理中間的完整月份
                totalAmount += budget;
            }

            // 移動到下個月
            currentMonth = currentMonth.add(1, 'month');
        }

        return totalAmount;
    }
}
class Budget {
    constructor(yearMonth, amount)  {
        this.yearMonth = yearMonth;
        this.amount = amount;
    }
}

const BudgetRepo = [
    new Budget('202312', 310),
    new Budget('202402', 2900),
    new Budget('202406', 30000000),
    new Budget('202407', 3100),
    new Budget('202408', 31),
    new Budget('202409', 300000),
]
describe('budget_service query', () => {
    it('api test', () => {

        expect(dayjs('20240720').diff(dayjs('20240720'), 'day')).toBe(0);
        expect(dayjs('20240720').diff(dayjs('20240716'), 'day')).toBe(4);
        expect(dayjs('20240716').daysInMonth()).toBe(31);
    });
    let service = new BudgetService();
    it('same month', () => {
        expect(service.totalAmount('20240721', '20240720')).toBe(0);
        expect(service.totalAmount('20240720', '20240720')).toBe(100);
        expect(service.totalAmount('20240720', '20240721')).toBe(200);
        expect(service.totalAmount('20240701', '20240731')).toBe(3100);
        // expect(service.totalAmount('20240720', '20240731')).toBe(0);
    })
    it('cross month', () => {
        expect(service.totalAmount('20240731', '20240801')).toBe(101);
        expect(service.totalAmount('20240701', '20240802')).toBe(3102);
        expect(service.totalAmount('20240701', '20240831')).toBe(3131);
        expect(service.totalAmount('20240701', '20240901')).toBe(13131);
        expect(service.totalAmount('20240601', '20240731')).toBe(30003100);
    })
    it('cross month exist no data', () => {
        expect(service.totalAmount('20240901', '20241030')).toBe(300000);
        expect(service.totalAmount('20240501', '20240630')).toBe(30000000);
        expect(service.totalAmount('20240411', '20240530')).toBe(0);
        expect(service.totalAmount('20241010', '20241111')).toBe(0);
        expect(service.totalAmount('20240101', '20241231')).toBe(30306031);
    })
    it('cross year', () => {
        expect(service.totalAmount('20231201', '20240131')).toBe(310);
        expect(service.totalAmount('20231221', '20240220')).toBe(2110);
    })
});

describe('Tennis init', () => {
});