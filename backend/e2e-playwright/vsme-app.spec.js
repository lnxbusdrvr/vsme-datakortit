const { test, describe, expect } = require('@playwright/test')

const E2E_TEST_USER = require('../utils/config').E2E_TEST_USER;
const E2E_TEST_PASSWD = require('../utils/config').E2E_TEST_PASSWD;

const URL = 'http://localhost:3001'

describe('VSME app', () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto(URL)

    const locator = page.getByText('VSME Raportointi - ESG Account Oy')
    await expect(locator).toBeVisible()
    await expect(page.getByText('VSME, ESG Account Oy')).toBeVisible()
  })

  test('can be login', async ({ page }) => {
    await page.goto(URL)

    await page.getByRole('textbox').first().fill(E2E_TEST_USER)
    await page.getByRole('textbox').last().fill(E2E_TEST_PASSWD)
    await page.getByRole('button', { name: 'Kirjaudu sisään' }).click()

    await expect(page.getByText('Tervetuloa takaisin, Test E2E User!')).toBeVisible()
  })

})
