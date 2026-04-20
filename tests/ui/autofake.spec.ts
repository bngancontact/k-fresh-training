import { test } from '../../pages/base-page';
import {
  createFakerAccount,
  createFakerAccountUpdate,
  createFakerAddress,
  createFakerPassword,
} from '../../data';
import type { AccountData } from '../../models';
import { AccountPage } from '../../pages/account-page';

test.describe('Automation 5 test cases with Faker data', () => {
  test.describe.configure({ mode: 'serial' });

  let account: AccountData;
  let currentPassword: string;

  test.beforeAll(async ({ browser }) => {
    account = createFakerAccount();
    currentPassword = account.password;

    const page = await browser.newPage();
    const setup = new AccountPage(page);

    await setup.register(account);
    await setup.logoutByRoute();

    await page.close();
  });

  test('TC01 - Login successfully and view My Account dashboard', async ({ accountPage }) => {
    await accountPage.login(account.email, currentPassword);
    await accountPage.assertMyAccountDashboard();
  });

  test('TC02 - Edit account information successfully', async ({ accountPage }) => {
    const updateData = createFakerAccountUpdate();

    await accountPage.login(account.email, currentPassword);
    await accountPage.editAccount(updateData);
    await accountPage.assertAccountInfo(updateData);
  });

  test('TC03 - Change password successfully and re-login with new password', async ({ accountPage }) => {
    const newPassword = createFakerPassword();

    await accountPage.login(account.email, currentPassword);
    await accountPage.changePassword(newPassword);

    currentPassword = newPassword;

    await accountPage.logoutByRoute();
    await accountPage.login(account.email, currentPassword);
  });

  test('TC04 - Add new address successfully', async ({ accountPage }) => {
    const address = createFakerAddress();

    await accountPage.login(account.email, currentPassword);
    await accountPage.addAddress(address);
  });

  test('TC05 - Logout successfully from My Account page', async ({ accountPage }) => {
    await accountPage.login(account.email, currentPassword);
    await accountPage.logoutBySidebar();
    await accountPage.assertLogoutContent();
    await accountPage.linkContinue.click();
  });
});
