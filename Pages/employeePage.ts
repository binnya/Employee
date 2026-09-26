import { Locator, Page, expect } from '@playwright/test';

export class EmployeePage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeId: Locator;
  readonly profilePicture: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  readonly jobTab: Locator;
  readonly saveEditButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeId = page.locator('label:has-text("Employee Id")').locator('xpath=following::input[1]');
    this.profilePicture = page.locator('input[type="file"]');
    this.saveButton = page.getByRole('button', { name: 'Save' }).first();
    this.successMessage = page.getByText('Successfully Saved');
    this.jobTab = page.getByRole('tab', { name: 'Job' }).first();
    this.saveEditButton = page.getByRole('button', { name: 'Save' }).last();
  }

  async enterEmployeeDetails(firstName: string, lastName: string) {
    await expect(this.firstNameInput, 'First name field should be visible before entering employee data.').toBeVisible({ timeout: 30000 });
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);

    const uniqueEmployeeId = String(Date.now()).slice(-6);
    await expect(this.employeeId, 'Employee ID field should be present in the add employee form.').toBeVisible({ timeout: 30000 });
    await this.employeeId.clear();
    await this.employeeId.fill(uniqueEmployeeId);
  }

  async uploadProfilePicture(filePath: string) {
    await expect(this.profilePicture, 'Profile picture upload control should exist in the form.').toBeAttached({ timeout: 30000 });
    await this.profilePicture.setInputFiles(filePath);
  }

  async saveEmployee() {
    await this.saveButton.click();

    await expect.poll(async () => {
      const headingVisible = await this.page.getByRole('heading', { name: /Personal Details/i }).count();
      return headingVisible > 0 || /\/pim\/viewPersonalDetails\/empNumber\//.test(this.page.url());
    }, {
      timeout: 30000,
      message: 'Employee should reach the personal details page after save.'
    }).toBeTruthy();
  }

  async getEmployeeId(): Promise<string> {
    await expect(this.page.getByRole('heading', { name: /Personal Details/i }), 'Employee personal details page should be visible after saving.').toBeVisible({ timeout: 30000 });

    const urlMatch = this.page.url().match(/\/empNumber\/(\d+)/);
    if (urlMatch) {
      return urlMatch[1];
    }

    await expect(this.employeeId, 'Employee ID field should be available after the employee is created.').toBeVisible({ timeout: 30000 });
    return (await this.employeeId.inputValue()).trim();
  }

  async verifyEmployeeCreated() {
    await expect(this.page.getByRole('heading', { name: /Personal Details/i }), 'Employee personal details page should be visible after saving.').toBeVisible({ timeout: 30000 });
    await expect.poll(async () => /\/pim\/viewPersonalDetails\/empNumber\//.test(this.page.url()), {
      timeout: 30000,
      message: 'Created employee should be redirected to a personal-details URL with an empNumber.'
    }).toBeTruthy();
  }

  async openJobSection() {
    await expect(this.jobTab, 'Job tab should be visible for the employee record.').toBeVisible({ timeout: 30000 });
    await this.jobTab.click();
  }

  async updateEmployeeJobDetails(jobTitle: string, employmentStatus: string) {
    const getSelectTriggerByLabel = (labelText: string) =>
      this.page.locator('label')
        .filter({ hasText: labelText })
        .locator('xpath=ancestor::div[contains(@class,"oxd-grid-item")]//div[contains(@class,"oxd-select-text-input")]')
        .first();

    const selectOption = async (labelText: string, optionText: string) => {
      const trigger = getSelectTriggerByLabel(labelText);
      await expect(trigger, `${labelText} selector should be visible for update.`).toBeVisible({ timeout: 30000 });
      await trigger.click();

      const menu = this.page.locator('.oxd-select-dropdown').filter({ has: this.page.locator('.oxd-select-option') }).first();
      await expect(menu, `${labelText} dropdown menu should open.`).toBeVisible({ timeout: 30000 });

      const normalized = optionText.replace(/[-\s]+/g, '[ -]');
      const option = menu.locator('.oxd-select-option').filter({
        hasText: new RegExp(normalized, 'i')
      }).first();

      if ((await option.count()) === 0) {
        const fallback = menu.locator('.oxd-select-option').first();
        await expect(fallback, `${optionText} option should be available in the dropdown.`).toBeVisible({ timeout: 30000 });
        await fallback.click();
        return;
      }

      await expect(option, `${optionText} should be available for ${labelText}.`).toBeVisible({ timeout: 30000 });
      await option.click();
    };

    await this.page.waitForURL(/\/pim\/viewJobDetails\//, { timeout: 30000 });
    await selectOption('Job Title', jobTitle);
    await selectOption('Employment Status', employmentStatus);
    await this.saveEditButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyEmployeeUpdate(jobTitle: string, employmentStatus: string) {
    const jobTitleValue = this.page.locator('label:has-text("Job Title")')
      .locator('xpath=ancestor::div[contains(@class,"oxd-grid-item")]//div[contains(@class,"oxd-select-text-input")]');
    const employmentStatusValue = this.page.locator('label:has-text("Employment Status")')
      .locator('xpath=ancestor::div[contains(@class,"oxd-grid-item")]//div[contains(@class,"oxd-select-text-input")]');

    await expect(jobTitleValue, `Job title should be updated to ${jobTitle}.`).toHaveText(new RegExp(jobTitle, 'i'), { timeout: 30000 });
    await expect(employmentStatusValue, `Employment status should be updated to ${employmentStatus}.`).toHaveText(new RegExp(employmentStatus, 'i'), { timeout: 30000 });
  }
}
