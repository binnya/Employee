import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly userName: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userName = page.locator('input[name="username"]');
        this.password = page.locator('input[name="password"]');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async openLoginPage() {
        await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await expect(this.userName, 'Login form should be visible before entering credentials.').toBeVisible({ timeout: 30000 });
    }

    async loginAs(username: string, password: string) {
        await expect(this.userName, 'Username input should be visible.').toBeVisible({ timeout: 30000 });
        await this.userName.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }

    async Login(username: string, password: string) {
        await this.loginAs(username, password);
    }
}