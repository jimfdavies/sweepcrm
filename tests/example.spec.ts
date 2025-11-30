import { _electron as electron, test } from '@playwright/test'
import path from 'path'
import fs from 'fs'

test('launch app and capture screenshot', async () => {
  const electronApp = await electron.launch({
    args: ['.'],
    env: { ...process.env, NODE_ENV: 'development' }
  })

  const window = await electronApp.firstWindow()
  await window.waitForLoadState('domcontentloaded')

  // Wait a bit for any animations or data loading
  await window.waitForTimeout(2000)

  const title = await window.title()
  console.log(`Window title: ${title}`)

  // Create screenshots directory if it doesn't exist
  const screenshotDir = path.join(__dirname, 'screenshots')
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir)
  }

  const screenshotPath = path.join(screenshotDir, 'main-window.png')
  await window.screenshot({ path: screenshotPath })
  console.log(`Screenshot saved to: ${screenshotPath}`)

  await electronApp.close()
})
