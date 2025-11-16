// @ts-check
import { test, expect } from '@playwright/test';

test.describe('SauceDemo – basic checkout flow', () => {
  const USERNAME = 'standard_user';
  const PASSWORD = 'secret_sauce';
  const PRODUCT_NAME = 'Sauce Labs Backpack';

  test('Login → add item → verify → logout', async ({ page }) => {

    // Open the login page
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');
    await page.waitForTimeout(1500);  

    // Type username
    const userField = page.getByPlaceholder('Username');
    await userField.waitFor();
    await userField.pressSequentially(USERNAME, { delay: 150 });
    await page.waitForTimeout(800);

    // Type password
    const passField = page.getByPlaceholder('Password');
    await passField.waitFor();
    await passField.pressSequentially(PASSWORD, { delay: 150 });
    await page.waitForTimeout(800);

    // Login
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(1200);

    // landed on the products page
    await expect(page).toHaveURL(/inventory/);
    await page.waitForSelector('.inventory_item');

    // Add the product
    const item = page.locator('.inventory_item', { hasText: PRODUCT_NAME });
    await item.waitFor();
    await item.getByRole('button', { name: 'Add to cart' }).click();
    await page.waitForTimeout(1200);

    // cart
    await page.locator('.shopping_cart_link').click();
    await page.waitForTimeout(1200);

    await expect(page.locator('.title')).toHaveText('Your Cart');

    const cartItem = page.locator('.cart_item', { hasText: PRODUCT_NAME });
    await cartItem.waitFor();
    await expect(cartItem.locator('.inventory_item_name')).toHaveText(PRODUCT_NAME);
    await page.waitForTimeout(1200);

    // sidebar
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.waitForTimeout(800);

    // Log out 
    await page.getByRole('link', { name: 'Logout' }).click();
    await page.waitForTimeout(1200);
  });
});
