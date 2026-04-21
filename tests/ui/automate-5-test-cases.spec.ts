import { expect } from '@playwright/test';
import { test } from '../../pages/base-page';
import {
  createRandomAccount,
  createRandomAccountUpdate,
  createRandomAddress,
  createRandomPassword,
} from '../../data';

test('TC01 - Login successfully and view My Account dashboard', async ({ accountPage }) => {
  const account = createRandomAccount();

  await accountPage.register(account);
  await accountPage.logoutByRoute();
  await accountPage.login(account.email, account.password);

  await accountPage.assertMyAccountDashboard();
});

test('TC02 - Edit account information successfully', async ({ accountPage }) => {
  const account = createRandomAccount();
  const updateData = createRandomAccountUpdate();

  await accountPage.register(account);
  await accountPage.editAccount(updateData);
  await accountPage.assertAccountInfo(updateData);

  await expect(accountPage.inputEmail).toHaveValue(account.email);
});

test('TC03 - Change password successfully and re-login with new password', async ({ accountPage }) => {
  const account = createRandomAccount();
  const newPassword = createRandomPassword();

  await accountPage.register(account);
  await accountPage.changePassword(newPassword);
  await accountPage.logoutByRoute();
  await accountPage.login(account.email, newPassword);
});

test('TC04 - Add new address successfully', async ({ accountPage }) => {
  const account = createRandomAccount();
  const address = createRandomAddress();

  await accountPage.register(account);
  await accountPage.addAddress(address);
});

test('TC05 - Logout successfully from My Account page', async ({ accountPage }) => {
  const account = createRandomAccount();

  await accountPage.register(account);
  await accountPage.logoutBySidebar();
  await accountPage.assertLogoutContent();
  await accountPage.linkContinue.click();
});