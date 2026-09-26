import { Locator, Page, expect } from '@playwright/test';

export class PIMPage {
  readonly page: Page;
  readonly addEmployeeMenu: Locator;
  readonly employeeListButton: Locator;
  readonly searchEmployeeIdInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addEmployeeMenu = page.getByRole('link', { name: 'Add Employee' }).first();
    this.employeeListButton = page.getByRole('link', { name: 'Employee List' }).first();
    this.searchEmployeeIdInput = page.locator('label:has-text("Employee Id")').locator('xpath=following::input[1]');
    this.searchButton = page.getByRole('button', { name: /Search|Submit/i }).first();
  }

  async navigateToAddEmployee() {
    await expect(this.page.getByRole('link', { name: 'PIM' }), 'PIM menu should be available in the navigation.').toBeVisible({ timeout: 30000 });
    await this.page.getByRole('link', { name: 'PIM' }).click();
    await expect(this.addEmployeeMenu, 'Add Employee link should be visible under the PIM menu.').toBeVisible({ timeout: 30000 });
    await this.addEmployeeMenu.click();
  }

  async goToEmployeeList() {
    await expect(this.page.getByRole('link', { name: 'PIM' }), 'PIM menu should be available to navigate to employee list.').toBeVisible({ timeout: 30000 });
    await this.page.getByRole('link', { name: 'PIM' }).click();
    await expect(this.employeeListButton, 'Employee List should be visible in the submenu.').toBeVisible({ timeout: 30000 });
    await this.employeeListButton.click();
  }

  async searchEmployeeById(employeeId: string) {
    await expect(this.searchEmployeeIdInput, `Employee ID search field should be visible for ${employeeId}.`).toBeVisible({ timeout: 30000 });
    await this.searchEmployeeIdInput.fill(employeeId.trim());
    await this.searchButton.click();

    await expect.poll(
      async () => await this.page.locator('.oxd-table-card').filter({ hasText: employeeId.trim() }).count(),
      `Employee row with ID ${employeeId} should be visible in the table.`
    ).toBeGreaterThan(0);

    const row = this.page.locator('.oxd-table-card').filter({ hasText: employeeId.trim() }).first();
    await expect(row, `Employee row for ${employeeId} should be visible before opening it.`).toBeVisible({ timeout: 30000 });
    await row.click({ force: true });
    await this.page.waitForLoadState('networkidle');
    return row;
  }

  async searchEmployeeForDelete(employeeId: string) {
    await this.goToEmployeeList();
    await expect(this.searchEmployeeIdInput, `Search input should be visible before deleting ${employeeId}.`).toBeVisible({ timeout: 30000 });
    await this.searchEmployeeIdInput.fill(employeeId.trim());
    await this.searchButton.click();

    await expect.poll(
      async () => await this.page.locator('.oxd-table-card').filter({ hasText: employeeId.trim() }).count(),
      `Employee ${employeeId} should exist before confirmation is sent for deletion.`
    ).toBeGreaterThan(0);

    return this.page.locator('.oxd-table-card').filter({ hasText: employeeId.trim() }).first();
  }

  async deleteEmployee(employeeId: string) {
    const row = await this.searchEmployeeForDelete(employeeId);
    const deleteButton = row.locator('button').last();
    await expect(deleteButton, `Delete button should be available for employee ${employeeId}.`).toBeVisible({ timeout: 30000 });
    await deleteButton.evaluate((button) => button.scrollIntoView({ block: 'center', inline: 'center' }));
    await deleteButton.click({ force: true });

    const confirmDeleteButton = this.page.getByRole('button', { name: /Yes, Delete|Delete/i }).last();
    await expect(confirmDeleteButton, 'Confirmation dialog should appear before the employee is permanently deleted.').toBeVisible({ timeout: 30000 });
    await confirmDeleteButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyEmployeeDeleted(employeeId: string) {
    await this.goToEmployeeList();
    await expect.poll(
      async () => await this.page.locator('.oxd-table-card').filter({ hasText: employeeId }).count(),
      `Employee ${employeeId} should not appear in the employee list after deletion.`
    ).toBe(0);
  }
}
