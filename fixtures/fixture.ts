import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../Pages/loginPage';
import { DashboardPage } from '../Pages/dashboardPage';
import { PIMPage } from '../Pages/pimPage';
import { EmployeePage } from '../Pages/employeePage';

type MyFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    pimPage: PIMPage;
    employeePage: EmployeePage;
};

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
    pimPage: async ({ page }, use) => {
        await use(new PIMPage(page));
    },
    employeePage: async ({ page }, use) => {
        await use(new EmployeePage(page));
    }
});

export { expect };
