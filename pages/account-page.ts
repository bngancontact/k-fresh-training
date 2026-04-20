import test, { expect, type Page } from '@playwright/test';
import { AccountLocators } from '../locators/account-locators';
import type { AccountData, AccountUpdateData, AddressData } from '../models';
import { Constants } from '../utilities/constants';

export class AccountPage extends AccountLocators {
  constructor(page: Page) {
    super(page);
  }

  async register(account: AccountData): Promise<void> {
    await test.step('Register account', async () => {
      await this.page.goto(Constants.ROUTES.register);

      await expect(this.inputFirstName).toBeVisible();
      await this.inputFirstName.fill(account.firstName);
      await this.inputLastName.fill(account.lastName);
      await this.inputEmail.fill(account.email);
      await this.inputTelephone.fill(account.telephone);
      await this.inputPassword.fill(account.password);
      await this.inputConfirmPassword.fill(account.password);
      await this.checkboxAgree.setChecked(true, { force: true });

      await this.buttonContinue.click();
      await expect(this.headingAccountCreated).toBeVisible();

      await this.linkContinue.click();
      await expect(this.page).toHaveURL(/route=account\/account/);
      await expect(this.headingMyAccount).toBeVisible();
    });
  }

  async login(email: string, password: string): Promise<void> {
    await test.step(`Login with ${email}`, async () => {
      await this.page.goto(Constants.ROUTES.login);
      await expect(this.inputEmail).toBeVisible();

      await this.inputEmail.fill(email);
      await this.inputPassword.fill(password);
      await this.buttonLogin.click();

      await expect(this.page).toHaveURL(/route=account\/account/);
      await expect(this.headingMyAccount).toBeVisible();
    });
  }

  async logoutByRoute(): Promise<void> {
    await test.step('Logout via route', async () => {
      await this.page.goto(Constants.ROUTES.logout);
      await expect(this.headingLogout).toBeVisible();
    });
  }

  async logoutBySidebar(): Promise<void> {
    await test.step('Logout from sidebar', async () => {
      await expect(this.linkLogoutInSidebar).toBeVisible();
      await this.linkLogoutInSidebar.click();
      await expect(this.page).toHaveURL(/route=account\/logout/);
      await expect(this.headingLogout).toBeVisible();
    });
  }

  async assertMyAccountDashboard(): Promise<void> {
    await test.step('Verify My Account dashboard', async () => {
      await expect(this.headingMyAccount).toBeVisible();
      await expect(this.contentContainer).toContainText('Edit your account information');
      await expect(this.contentContainer).toContainText('View your order history');
      await expect(this.columnRight).toContainText('My Account');
      await expect(this.errorAlert).toHaveCount(0);
    });
  }

  async editAccount(data: AccountUpdateData): Promise<void> {
    await test.step('Edit account info', async () => {
      await this.page.goto(Constants.ROUTES.editAccount);
      await expect(this.headingMyAccountInformation).toBeVisible();

      await this.inputFirstName.fill(data.firstName);
      await this.inputLastName.fill(data.lastName);
      await this.inputTelephone.fill(data.telephone);
      await this.buttonContinue.click();

      await expect(this.page).toHaveURL(/route=account\/account/);
      await expect(this.successAlert).toContainText('Success: Your account has been successfully updated.');
    });
  }

  async assertAccountInfo(data: AccountUpdateData): Promise<void> {
    await test.step('Verify edited account info', async () => {
      await this.page.goto(Constants.ROUTES.editAccount);
      await expect(this.inputFirstName).toHaveValue(data.firstName);
      await expect(this.inputLastName).toHaveValue(data.lastName);
      await expect(this.inputTelephone).toHaveValue(data.telephone);
    });
  }

  async changePassword(newPassword: string): Promise<void> {
    await test.step('Change account password', async () => {
      await this.page.goto(Constants.ROUTES.changePassword);
      await expect(this.headingChangePassword).toBeVisible();

      await this.inputPassword.fill(newPassword);
      await this.inputConfirmPassword.fill(newPassword);
      await this.buttonContinue.click();

      await expect(this.page).toHaveURL(/route=account\/account/);
      await expect(this.successAlert).toContainText(
        'Success: Your password has been successfully updated.',
      );
    });
  }

  async addAddress(data: AddressData): Promise<void> {
    await test.step('Add new address', async () => {
      await this.page.goto(Constants.ROUTES.addAddress);
      await expect(this.headingAddAddress).toBeVisible();

      await this.inputFirstName.fill(data.firstName);
      await this.inputLastName.fill(data.lastName);
      await this.inputCompany.fill(data.company);
      await this.inputAddress1.fill(data.address1);
      await this.inputAddress2.fill(data.address2);
      await this.inputCity.fill(data.city);
      await this.inputPostCode.fill(data.postCode);
      await this.selectCountry.selectOption(data.countryId);
      await this.optionDaNang.waitFor({ state: 'attached' });
      await this.selectZone.selectOption(data.zoneId);

      if (await this.defaultAddressNo.count()) {
        await this.defaultAddressNo.check();
      }

      await this.buttonContinue.click();

      await expect(this.page).toHaveURL(/route=account\/address/);
      await expect(this.headingAddressBook).toBeVisible();
      await expect(this.successAlert).toContainText('Your address has been successfully added');
      await expect(this.contentContainer).toContainText(data.city);
    });
  }

  async assertLogoutContent(): Promise<void> {
    await test.step('Verify logout page content', async () => {
      await expect(this.headingLogout).toBeVisible();
      await expect(this.contentContainer).toContainText(
        'You have been logged off your account. It is now safe to leave the computer.',
      );
      await expect(this.contentContainer).toContainText('Your shopping cart has been saved');
      await expect(this.linkContinue).toBeVisible();
    });
  }
}