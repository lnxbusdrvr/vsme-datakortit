const { test, describe, expect } = require('@playwright/test')

describe('Note app', () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:3001')

    const locator = page.getByText('Kirjaudu')
    await expect(locator).toBeVisible()
    await expect(page.getByText('VSME, ESG Account Oy 2026')).toBeVisible()
  })
})
