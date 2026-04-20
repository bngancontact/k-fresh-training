import { type Locator, type Page } from '@playwright/test';
import { CommonLocators } from './common-locators';

export class AccountLocators extends CommonLocators {
  inputFirstName!: Locator;
  inputLastName!: Locator;
  inputEmail!: Locator;
  inputTelephone!: Locator;
  inputPassword!: Locator;
  inputConfirmPassword!: Locator;
  checkboxAgree!: Locator;

  buttonContinue!: Locator;
  buttonLogin!: Locator;

  headingMyAccount!: Locator;
  headingAccountCreated!: Locator;
  headingChangePassword!: Locator;
  headingAddAddress!: Locator;
  headingAddressBook!: Locator;
  headingLogout!: Locator;
  headingMyAccountInformation!: Locator;

  linkContinue!: Locator;
  linkLogoutInSidebar!: Locator;

  inputCompany!: Locator;
  inputAddress1!: Locator;
  inputAddress2!: Locator;
  inputCity!: Locator;
  inputPostCode!: Locator;
  selectCountry!: Locator;
  selectZone!: Locator;
  optionDaNang!: Locator;
  defaultAddressNo!: Locator;

  constructor(page: Page) {
    super(page);
    this.locatorInitialization();
  }

  locatorInitialization(): void {
    super.locatorInitialization();

    this.inputFirstName = this.page.locator('#input-firstname');
    this.inputLastName = this.page.locator('#input-lastname');
    this.inputEmail = this.page.locator('#input-email');
    this.inputTelephone = this.page.locator('#input-telephone');
    this.inputPassword = this.page.locator('#input-password');
    this.inputConfirmPassword = this.page.locator('#input-confirm');
    this.checkboxAgree = this.page.locator('input[name="agree"]');

    this.buttonContinue = this.page.getByRole('button', { name: 'Continue' });
    this.buttonLogin = this.page.getByRole('button', { name: 'Login' });

    this.headingMyAccount = this.page.getByRole('heading', { name: 'My Account' });
    this.headingAccountCreated = this.page.getByRole('heading', {
      name: 'Your Account Has Been Created!',
    });
    this.headingChangePassword = this.page.getByRole('heading', { name: 'Change Password' });
    this.headingAddAddress = this.page.getByRole('heading', { name: 'Add Address' });
    this.headingAddressBook = this.page.getByRole('heading', { name: 'Address Book Entries' });
    this.headingLogout = this.page.getByRole('heading', { name: 'Account Logout' });
    this.headingMyAccountInformation = this.page.getByRole('heading', {
      name: 'My Account Information',
    });

    this.linkContinue = this.page.getByRole('link', { name: 'Continue' });
    this.linkLogoutInSidebar = this.page
      .locator('#column-right a[href*="route=account/logout"]')
      .first();

    this.inputCompany = this.page.locator('#input-company');
    this.inputAddress1 = this.page.locator('#input-address-1');
    this.inputAddress2 = this.page.locator('#input-address-2');
    this.inputCity = this.page.locator('#input-city');
    this.inputPostCode = this.page.locator('#input-postcode');
    this.selectCountry = this.page.locator('#input-country');
    this.selectZone = this.page.locator('#input-zone');
    this.optionDaNang = this.page.locator('#input-zone option[value="3767"]');
    this.defaultAddressNo = this.page.locator('input[name="default"][value="0"]');
  }
}