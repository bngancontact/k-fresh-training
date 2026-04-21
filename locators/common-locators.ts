import { type Locator, type Page } from '@playwright/test';

export class CommonLocators {
  page: Page;

  headingH1!: Locator;
  contentContainer!: Locator;
  columnRight!: Locator;
  successAlert!: Locator;
  errorAlert!: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locatorInitialization();
  }

  setPage(page: Page): void {
    this.page = page;
    this.locatorInitialization();
  }

  locatorInitialization(): void {
    this.headingH1 = this.page.locator('h1');
    this.contentContainer = this.page.locator('#content');
    this.columnRight = this.page.locator('#column-right');
    this.successAlert = this.page.locator('.alert-success');
    this.errorAlert = this.page.locator('.alert-danger');
  }
}