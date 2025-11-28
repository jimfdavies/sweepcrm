const { _electron: electron } = require('playwright');
const { test, expect } = require('@playwright/test');
const path = require('path');

test('launch app', async () => {
  const electronApp = await electron.launch({
    args: [path.join(__dirname, '../electron/main.js')],
  });

  const window = await electronApp.firstWindow();
  await expect(window).toHaveTitle('SweepCRM');

  // Login Flow
  await window.fill('input[type="password"]', 'sweep123');
  await window.click('button[type="submit"]');
  
  // Check for the welcome message
  const welcomeText = await window.textContent('h1');
  expect(welcomeText).toBe('Welcome to SweepCRM');

  await electronApp.close();
});
