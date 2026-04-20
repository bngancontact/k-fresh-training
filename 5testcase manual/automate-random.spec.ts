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

const randomText = (prefix: string, length = 6): string => {
  const value = Math.random().toString(36).slice(2, 2 + length);
  return `${prefix}${value}`;
};

const randomDigits = (length: number): string => {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
};

const generateAccountData = (): AccountData => {
  const stamp = Date.now();
  return {
    firstName: randomText('AutoFN'),
    lastName: randomText('AutoLN'),
    email: `autotest_${stamp}_${randomDigits(4)}@mailinator.com`,
    telephone: `09${randomDigits(8)}`,
    password: `Pw@${randomDigits(8)}Aa`,
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

const registerNewAccount = async (page: Page): Promise<AccountData> => {
  const account = generateAccountData();

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

  return account;
};

test('TC01 - Login successfully and view My Account dashboard', async ({ page }) => {
  const account = await registerNewAccount(page);

  await logout(page);
  await login(page, account.email, account.password);

  await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  await expect(page.locator('#content')).toContainText('Edit your account information');
  await expect(page.locator('#content')).toContainText('View your order history');
  await expect(page.locator('#column-right')).toContainText('My Account');
  await expect(page.locator('.alert-danger')).toHaveCount(0);
});

test('TC02 - Edit account information successfully', async ({ page }) => {
  const account = await registerNewAccount(page);
  const updatedFirstName = randomText('UpdatedFN');
  const updatedLastName = randomText('UpdatedLN');
  const updatedPhone = `09${randomDigits(8)}`;

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

  await expect(page.locator('#input-email')).toHaveValue(account.email);
});

test('TC03 - Change password successfully and re-login with new password', async ({ page }) => {
  const account = await registerNewAccount(page);
  const newPassword = `NewPw@${randomDigits(8)}Aa`;

  await page.goto(ROUTES.changePassword);
  await expect(page.getByRole('heading', { name: 'Change Password' })).toBeVisible();

  await page.locator('#input-password').fill(newPassword);
  await page.locator('#input-confirm').fill(newPassword);
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/route=account\/account/);
  await expect(page.locator('.alert-success')).toContainText(
    'Success: Your password has been successfully updated.',
  );

  await logout(page);
  await login(page, account.email, newPassword);
});

test('TC04 - Add new address successfully', async ({ page }) => {
  await registerNewAccount(page);

  const addressFirstName = randomText('AddrFN');
  const addressLastName = randomText('AddrLN');
  const address1 = `${randomDigits(3)} Nguyen Thuong Hien`;
  const address2 = `Block ${randomDigits(2)}`;
  const city = 'Danang';
  const postCode = randomDigits(5);

  await page.goto(ROUTES.addAddress);
  await expect(page.getByRole('heading', { name: 'Add Address' })).toBeVisible();

  await page.locator('#input-firstname').fill(addressFirstName);
  await page.locator('#input-lastname').fill(addressLastName);
  await page.locator('#input-company').fill('Company Auto');
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
  await expect(page.locator('#content')).toContainText(address1);
  await expect(page.locator('#content')).toContainText(city);
});

test('TC05 - Logout successfully from My Account page', async ({ page }) => {
  await registerNewAccount(page);

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
