import dayjs from "dayjs";

export class BudgetService {
  totalAmount(start, end) {
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

export class Budget {
  constructor(yearMonth, amount) {
    this.yearMonth = yearMonth;
    this.amount = amount;
  }
}

export const BudgetRepo = [
  new Budget('202312', 310),
  new Budget('202402', 2900),
  new Budget('202406', 30000000),
  new Budget('202407', 3100),
  new Budget('202408', 31),
  new Budget('202409', 300000),
];
