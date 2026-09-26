import { Locator, Page, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardHeader: Locator;
  readonly pimMenu: Locator;
  readonly userDropdown: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardHeader = page.getByRole('heading', { name: 'Dashboard' });
    this.pimMenu = page.getByRole('link', { name: 'PIM' });
    this.userDropdown = page.locator('.oxd-userdropdown').first();
    this.logoutButton = page.getByRole('menuitem', { name: /Logout/i }).first();
  }

  async verifyDashboardVisible() {
    await expect(this.dashboardHeader, 'Dashboard should be visible after a successful login.').toBeVisible({ timeout: 30000 });
    return await this.dashboardHeader.isVisible();
  }

  async goToPIM() {
    await expect(this.pimMenu, 'PIM menu should be available in the sidebar.').toBeVisible({ timeout: 30000 });
    await this.pimMenu.click();
  }

  async logout() {
    await expect(this.userDropdown, 'User dropdown should be visible to log out.').toBeVisible({ timeout: 30000 });
    await this.userDropdown.click();
    await expect(this.logoutButton, 'Logout option should be visible in the dropdown menu.').toBeVisible({ timeout: 30000 });
    await this.logoutButton.click();
    await this.page.waitForURL(/\/auth\/login/, { timeout: 30000 });
  }

  async verifyLogout() {
    await expect(this.page, 'User should be redirected to the login page after logout.').toHaveURL(/\/auth\/login/, { timeout: 30000 });
  }
}
