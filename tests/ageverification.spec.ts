import { expect, test } from '@playwright/test';

const MODAL_HEADING = 'Are you 21 or older?';
const CONFIRM_BUTTON = "Yes, I'm 21+";
const DENY_BUTTON = "No, I'm Under 21";
const REDIRECT_URL = 'https://www.misterrogers.org';

test.describe('Age Verification Modal', () => {
  test('modal is visible on first visit (no localStorage)', async ({ page }) => {
    await page.goto('/');

    const heading = page.getByRole('heading', { name: MODAL_HEADING });
    await expect(heading).toBeVisible();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('clicking "Yes, I\'m 21+" dismisses the modal and sets localStorage', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: CONFIRM_BUTTON }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();

    const storageValue = await page.evaluate(() => sessionStorage.getItem('age-verified'));
    expect(storageValue).toBe('true');
  });

  test('modal does NOT appear when age-verified is already set in localStorage', async ({
    page
  }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('age-verified', 'true');
    });

    await page.goto('/');

    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('clicking "No, I\'m Under 21" redirects to misterrogers.org', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('dialog')).toBeVisible();

    const navigationPromise = page.waitForURL(new RegExp(REDIRECT_URL.replace('https://', '')), {
      timeout: 15000,
      waitUntil: 'domcontentloaded'
    });

    await page.getByRole('button', { name: DENY_BUTTON }).click();

    await navigationPromise;

    expect(page.url()).toContain('misterrogers.org');
  });

  test('modal is not shown again after confirming age and reloading', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: CONFIRM_BUTTON }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    await page.reload();

    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
