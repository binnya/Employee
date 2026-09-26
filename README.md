# OrangeHRM Employee Lifecycle Automation

This project automates the OrangeHRM demo application using Playwright and TypeScript. It validates the full employee lifecycle: login, employee creation, profile upload, job updates, database/API verification, deletion, and logout.

## Overview

The project is built using a clean Page Object Model (POM) design so automated flows are easier to maintain, extend, and understand.

### Included features

- Login flow and dashboard validation
- Add employee flow with profile picture upload
- Employee search and update actions
- API validation for employee creation and deletion
- Descriptive assertions and consistent test steps
- Clean separation of UI logic into page objects

## Tech stack

- Playwright
- TypeScript
- Node.js
- OrangeHRM demo application

## Prerequisites

- Node.js 18 or higher
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install the required browser binaries:

```bash
npx playwright install --with-deps chromium
```

## Project structure

```text
PlaywrightAutomation/
├── data/
│   ├── employeeData.json
│   └── loginData.data.ts
├── fixtures/
│   └── fixture.ts
├── Pages/
│   ├── dashboardPage.ts
│   ├── employeePage.ts
│   ├── loginPage.ts
│   └── pimPage.ts
├── tests/
│   └── employeeE2E.spec.ts
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── README.md
├── playwright-report/
├── test-results/
└── ...
```

## Test flow

The main lifecycle test performs the following actions:

1. Open the OrangeHRM login page
2. Log in as admin
3. Navigate to the Add Employee form
4. Enter employee personal details
5. Upload a profile image
6. Save the employee
7. Fetch the created employee ID and validate it through the API
8. Search for the employee
9. Update job title and employment status
10. Confirm the update in the UI
11. Delete the employee
12. Validate the employee is no longer available via API
13. Log out and verify the login page appears

## Run the tests

Run the full suite:

```bash
npm test
```

Run in headed mode:

```bash
npm run test:headed
```

Run in debug mode:

```bash
npm run test:debug
```

Open the HTML report:

```bash
npm run test:report
```

Run Playwright UI mode:

```bash
npm run test:ui
```

## Notes

- Target app: https://opensource-demo.orangehrmlive.com/
- Default credentials used during automation: Admin / admin123
- Playwright reports are stored in the `playwright-report` folder
- Browser artifacts such as screenshots, traces, and videos are stored in `test-results`
- This project is designed as a reusable example for UI + API-based employee workflow automation
