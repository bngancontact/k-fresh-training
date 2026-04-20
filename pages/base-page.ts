import { test as baseTest, type Page } from '@playwright/test';
import { AccountPage } from './account-page';
import { CommonPage } from './common-page';

export const test = baseTest.extend<{
  accountPage: AccountPage;
  commonPage: CommonPage;
}>({
  accountPage: async ({ page, context }, use) => {
    const instance = new AccountPage(page);
    context.on('page', (newPage: Page) => {
      instance.setPage(newPage);
    });
    await use(instance);
  },

  commonPage: async ({ page, context }, use) => {
    const instance = new CommonPage(page);
    context.on('page', (newPage: Page) => {
      instance.setPage(newPage);
    });
    await use(instance);
  },
});