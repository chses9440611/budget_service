import { BudgetService, BudgetRepo } from "../src/services/budget_service";
import dayjs from "dayjs";

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
  });

  it('cross month', () => {
    expect(service.totalAmount('20240731', '20240801')).toBe(101);
    expect(service.totalAmount('20240701', '20240802')).toBe(3102);
    expect(service.totalAmount('20240701', '20240831')).toBe(3131);
    expect(service.totalAmount('20240701', '20240901')).toBe(13131);
    expect(service.totalAmount('20240601', '20240731')).toBe(30003100);
  });

  it('cross month exist no data', () => {
    expect(service.totalAmount('20240901', '20241030')).toBe(300000);
    expect(service.totalAmount('20240501', '20240630')).toBe(30000000);
    expect(service.totalAmount('20240411', '20240530')).toBe(0);
    expect(service.totalAmount('20241010', '20241111')).toBe(0);
    expect(service.totalAmount('20240101', '20241231')).toBe(30306031);
  });

  it('cross year', () => {
    expect(service.totalAmount('20231201', '20240131')).toBe(310);
    expect(service.totalAmount('20231221', '20240220')).toBe(2110);
  });
});
