import { test, expect } from '../fixtures/fixture';
import { loginData } from '../data/loginData.data';

const orangeHrmBaseUrl = 'https://opensource-demo.orangehrmlive.com';
const employeeApiUrl = (empNumber: number | string) =>
  `${orangeHrmBaseUrl}/web/index.php/api/v2/pim/employees/${empNumber}`;

const employeeData = require('../data/employeeData.json');
let createdEmployeeId = '';
let createdEmpNumber: number | null = null;

test.describe('Employee Life Cycle', () => {
  test('complete Employee Lifecycle Management ', async ({ page, loginPage, dashboardPage, pimPage, employeePage }) => {
    const employee = employeeData[0];

    await test.step('Login and verify dashboard', async () => {
      await loginPage.openLoginPage();
      await loginPage.loginAs(loginData.userName, loginData.password);
      await dashboardPage.verifyDashboardVisible();
    });

    await test.step('Add a new employee and validate the created record', async () => {
      await pimPage.navigateToAddEmployee();
      await employeePage.enterEmployeeDetails(employee.firstName, employee.lastName);
      await employeePage.uploadProfilePicture(employee.profilePicture);
      await employeePage.saveEmployee();

      const empNumber = Number(page.url().match(/\/empNumber\/(\d+)/)?.[1]);
      expect(empNumber, 'Created employee should have a valid empNumber in the URL.').toBeTruthy();

      const apiResponse = await page.request.get(employeeApiUrl(empNumber));

      expect(apiResponse.status(), `Expected employee GET API to return 200 for empNumber ${empNumber}.`).toBe(200);
      const apiBody = await apiResponse.json();
      createdEmployeeId = String(apiBody.data.employeeId || apiBody.data.empNumber || empNumber);

      console.log(`Generated Employee ID: ${createdEmployeeId}`);
      await employeePage.verifyEmployeeCreated();
    });

    await test.step('Update Job Title and Employment Status to the employee data', async () => {
      await pimPage.goToEmployeeList();
      await pimPage.searchEmployeeById(createdEmployeeId);
      await employeePage.openJobSection();
      await employeePage.updateEmployeeJobDetails(employee.jobTitle, employee.employmentStatus);
      await employeePage.verifyEmployeeUpdate(employee.jobTitle, employee.employmentStatus);
      console.log(`Employee updated successfully: ${createdEmployeeId}`);
    });

    await test.step('Validate employee API using the created employeeId', async () => {
      expect(createdEmployeeId, 'Generated employee ID should be populated after saving a new employee.').toBeTruthy();

      const empNumber = page.url().match(/\/empNumber\/(\d+)/)?.[1] || createdEmployeeId;
      console.log(`Employee ID field: ${createdEmployeeId}`);
      console.log(`API empNumber: ${empNumber}`);

      const response = await page.request.get(employeeApiUrl(empNumber));

      expect(response.status(), `Expected employee GET API to return 200 for empNumber ${empNumber}.`).toBe(200);

      const responseBody = await response.json();
      console.log(responseBody);
      expect(responseBody.data, 'Employee API response should include employee data.').toBeTruthy();
      expect(responseBody.data.empNumber || responseBody.data.id, 'Employee API response should contain a valid empNumber or id.').toBeTruthy();

      createdEmpNumber = Number(responseBody.data.empNumber ?? responseBody.data.id);
      console.log(`Stored API empNumber for delete validation: ${createdEmpNumber}`);
    });

    await test.step('Delete employee details', async () => {
      await pimPage.deleteEmployee(createdEmployeeId);
      await pimPage.verifyEmployeeDeleted(createdEmployeeId);
      console.log(`Employee deleted successfully from UI: ${createdEmployeeId}`);
    });

    await test.step('API verification for employee delete action', async () => {
      const empNumber = createdEmpNumber ?? Number(createdEmployeeId);
      const response = await page.request.get(employeeApiUrl(empNumber));

      expect([404, 422], `After deletion, employee GET should fail for empNumber ${empNumber}.`).toContain(response.status());
      console.log(`Employee deleted successfully and API response is ${response.status()} for empNumber ${empNumber}`);
    });

    await test.step('Logout from the application', async () => {
      await dashboardPage.logout();
      await dashboardPage.verifyLogout();
      console.log('User logged out successfully and login page is displayed.');
    });
  });
});