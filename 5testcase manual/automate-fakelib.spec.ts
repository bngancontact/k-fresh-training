import { faker } from '@faker-js/faker';
import { expect, test, type Page } from '@playwright/test';

const BASE_ROUTE = 'https://ecommerce-playground.lambdatest.io/index.php?route=';
const ROUTES = {
  register: `${BASE_ROUTE}account/register`,
  login: `${BASE_ROUTE}account/login`,
  account: `${BASE_ROUTE}account/account`,
  editAccount: `${BASE_ROUTE}account/edit`,
  changePassword: `${BASE_ROUTE}account/password`,
  addAddress: `${BASE_ROUTE}account/address/add`,
  addressBook: `${BASE_ROUTE}account/address`,
  logout: `${BASE_ROUTE}account/logout`,
};

type AccountData = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
};

const randomWord = (length = 8): string => faker.string.alpha({ length, casing: 'lower' });

const generatePassword = (): string => {
  const upper = faker.string.alpha({ length: 2, casing: 'upper' });
  const lower = faker.string.alpha({ length: 3, casing: 'lower' });
  const number = faker.string.numeric(4);
  return `${upper}@${lower}${number}`;
};

const generateAccountData = (): AccountData => {
  const firstName = `auto${randomWord(6)}`;
  const lastName = `user${randomWord(6)}`;

  return {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName, provider: 'mailinator.com' }).toLowerCase(),
    telephone: `09${faker.string.numeric(8)}`,
    password: generatePassword(),
  };
};

const login = async (page: Page, email: string, password: string): Promise<void> => {
  await page.goto(ROUTES.login);
  await expect(page.locator('#input-email')).toBeVisible();
  await page.locator('#input-email').fill(email);
  await page.locator('#input-password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/route=account\/account/);
  await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
};

const logout = async (page: Page): Promise<void> => {
  await page.goto(ROUTES.logout);
  await expect(page.getByRole('heading', { name: 'Account Logout' })).toBeVisible();
};

const registerAccount = async (page: Page, account: AccountData): Promise<void> => {
  await page.goto(ROUTES.register);
  await expect(page.locator('#input-firstname')).toBeVisible();

  await page.locator('#input-firstname').fill(account.firstName);
  await page.locator('#input-lastname').fill(account.lastName);
  await page.locator('#input-email').fill(account.email);
  await page.locator('#input-telephone').fill(account.telephone);
  await page.locator('#input-password').fill(account.password);
  await page.locator('#input-confirm').fill(account.password);
  await page.locator('input[name="agree"]').setChecked(true, { force: true });

  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'Your Account Has Been Created!' })).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page).toHaveURL(/route=account\/account/);
};

test.describe('Automation 5 test cases with Faker data', () => {
  test.describe.configure({ mode: 'serial' });

  let account: AccountData;
  let currentPassword: string;

  test.beforeAll(async ({ browser }) => {
    account = generateAccountData();
    currentPassword = account.password;

    const page = await browser.newPage();
    await registerAccount(page, account);
    await logout(page);
    await page.close();
  });

  test('TC01 - Login successfully and view My Account dashboard', async ({ page }) => {
    await login(page, account.email, currentPassword);

    await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
    await expect(page.locator('#content')).toContainText('Edit your account information');
    await expect(page.locator('#content')).toContainText('View your order history');
    await expect(page.locator('#column-right')).toContainText('My Account');
    await expect(page.locator('.alert-danger')).toHaveCount(0);
  });

  test('TC02 - Edit account information successfully', async ({ page }) => {
    await login(page, account.email, currentPassword);

    const updatedFirstName = `up${randomWord(6)}`;
    const updatedLastName = `dt${randomWord(6)}`;
    const updatedPhone = `09${faker.string.numeric(8)}`;

    await page.goto(ROUTES.editAccount);
    await expect(page.getByRole('heading', { name: 'My Account Information' })).toBeVisible();

    await page.locator('#input-firstname').fill(updatedFirstName);
    await page.locator('#input-lastname').fill(updatedLastName);
    await page.locator('#input-telephone').fill(updatedPhone);
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page).toHaveURL(/route=account\/account/);
    await expect(page.locator('.alert-success')).toContainText(
      'Success: Your account has been successfully updated.',
    );

    await page.goto(ROUTES.editAccount);
    await expect(page.locator('#input-firstname')).toHaveValue(updatedFirstName);
    await expect(page.locator('#input-lastname')).toHaveValue(updatedLastName);
    await expect(page.locator('#input-telephone')).toHaveValue(updatedPhone);
  });

  test('TC03 - Change password successfully and re-login with new password', async ({ page }) => {
    await login(page, account.email, currentPassword);

    const newPassword = generatePassword();

    await page.goto(ROUTES.changePassword);
    await expect(page.getByRole('heading', { name: 'Change Password' })).toBeVisible();

    await page.locator('#input-password').fill(newPassword);
    await page.locator('#input-confirm').fill(newPassword);
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page).toHaveURL(/route=account\/account/);
    await expect(page.locator('.alert-success')).toContainText(
      'Success: Your password has been successfully updated.',
    );

    currentPassword = newPassword;

    await logout(page);
    await login(page, account.email, currentPassword);
  });

  test('TC04 - Add new address successfully', async ({ page }) => {
    await login(page, account.email, currentPassword);

    const addressFirstName = `addr${randomWord(5)}`;
    const addressLastName = `user${randomWord(5)}`;
    const address1 = `${faker.location.streetAddress()} ${faker.location.street()}`;
    const address2 = `Block ${faker.string.numeric(2)}`;
    const city = 'Danang';
    const postCode = faker.string.numeric(5);

    await page.goto(ROUTES.addAddress);
    await expect(page.getByRole('heading', { name: 'Add Address' })).toBeVisible();

    await page.locator('#input-firstname').fill(addressFirstName);
    await page.locator('#input-lastname').fill(addressLastName);
    await page.locator('#input-company').fill(`Company ${randomWord(5)}`);
    await page.locator('#input-address-1').fill(address1);
    await page.locator('#input-address-2').fill(address2);
    await page.locator('#input-city').fill(city);
    await page.locator('#input-postcode').fill(postCode);
    await page.locator('#input-country').selectOption('230');
    await page.locator('#input-zone option[value="3767"]').waitFor({ state: 'attached' });
    await page.locator('#input-zone').selectOption('3767');

    const defaultAddressNo = page.locator('input[name="default"][value="0"]');
    if (await defaultAddressNo.count()) {
      await defaultAddressNo.check();
    }

    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page).toHaveURL(/route=account\/address/);
    await expect(page.getByRole('heading', { name: 'Address Book Entries' })).toBeVisible();
    await expect(page.locator('.alert-success')).toContainText('Your address has been successfully added');
    await expect(page.locator('#content')).toContainText(city);
  });

  test('TC05 - Logout successfully from My Account page', async ({ page }) => {
    await login(page, account.email, currentPassword);

    const logoutLink = page.locator('#column-right a[href*="route=account/logout"]').first();
    await expect(logoutLink).toBeVisible();
    await logoutLink.click();

    await expect(page).toHaveURL(/route=account\/logout/);
    await expect(page.getByRole('heading', { name: 'Account Logout' })).toBeVisible();
    await expect(page.locator('#content')).toContainText(
      'You have been logged off your account. It is now safe to leave the computer.',
    );
    await expect(page.locator('#content')).toContainText('Your shopping cart has been saved');

    const continueButton = page.getByRole('link', { name: 'Continue' });
    await expect(continueButton).toBeVisible();
    await continueButton.click();
  });
});