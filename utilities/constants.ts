export class Constants {
  static readonly BASE_URL =
    process.env.BASE_URL || 'https://ecommerce-playground.lambdatest.io';

  static readonly ROUTE_PREFIX = `${Constants.BASE_URL}/index.php?route=`;

  static readonly ROUTES = {
    register: `${Constants.ROUTE_PREFIX}account/register`,
    login: `${Constants.ROUTE_PREFIX}account/login`,
    account: `${Constants.ROUTE_PREFIX}account/account`,
    editAccount: `${Constants.ROUTE_PREFIX}account/edit`,
    changePassword: `${Constants.ROUTE_PREFIX}account/password`,
    addAddress: `${Constants.ROUTE_PREFIX}account/address/add`,
    addressBook: `${Constants.ROUTE_PREFIX}account/address`,
    logout: `${Constants.ROUTE_PREFIX}account/logout`,
  } as const;

  static readonly VIETNAM_COUNTRY_ID = '230';
  static readonly DANANG_ZONE_ID = '3767';
}