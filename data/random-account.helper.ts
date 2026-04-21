import type { AccountData, AccountUpdateData, AddressData } from '../models';
import { Constants } from '../utilities/constants';

const randomText = (prefix: string, length = 6): string => {
  const value = Math.random().toString(36).slice(2, 2 + length);
  return `${prefix}${value}`;
};

const randomDigits = (length: number): string => {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
};

export function createRandomAccount(): AccountData {
  const stamp = Date.now();

  return {
    firstName: randomText('AutoFN'),
    lastName: randomText('AutoLN'),
    email: `autotest_${stamp}_${randomDigits(4)}@mailinator.com`,
    telephone: `09${randomDigits(8)}`,
    password: `Pw@${randomDigits(8)}Aa`,
  };
}

export function createRandomAccountUpdate(): AccountUpdateData {
  return {
    firstName: randomText('UpdatedFN'),
    lastName: randomText('UpdatedLN'),
    telephone: `09${randomDigits(8)}`,
  };
}

export function createRandomAddress(): AddressData {
  return {
    firstName: randomText('AddrFN'),
    lastName: randomText('AddrLN'),
    company: 'Company Auto',
    address1: `${randomDigits(3)} Nguyen Thuong Hien`,
    address2: `Block ${randomDigits(2)}`,
    city: 'Danang',
    postCode: randomDigits(5),
    countryId: Constants.VIETNAM_COUNTRY_ID,
    zoneId: Constants.DANANG_ZONE_ID,
  };
}

export function createRandomPassword(): string {
  return `NewPw@${randomDigits(8)}Aa`;
}