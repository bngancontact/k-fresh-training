import { faker } from '@faker-js/faker';
import type { AccountData, AccountUpdateData, AddressData } from '../models';
import { Constants } from '../utilities/constants';

const randomWord = (length = 8): string => faker.string.alpha({ length, casing: 'lower' });

export function createFakerPassword(): string {
  const upper = faker.string.alpha({ length: 2, casing: 'upper' });
  const lower = faker.string.alpha({ length: 3, casing: 'lower' });
  const number = faker.string.numeric(4);
  return `${upper}@${lower}${number}`;
}

export function createFakerAccount(): AccountData {
  const firstName = `auto${randomWord(6)}`;
  const lastName = `user${randomWord(6)}`;

  return {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName, provider: 'mailinator.com' }).toLowerCase(),
    telephone: `09${faker.string.numeric(8)}`,
    password: createFakerPassword(),
  };
}

export function createFakerAccountUpdate(): AccountUpdateData {
  return {
    firstName: `up${randomWord(6)}`,
    lastName: `dt${randomWord(6)}`,
    telephone: `09${faker.string.numeric(8)}`,
  };
}

export function createFakerAddress(): AddressData {
  return {
    firstName: `addr${randomWord(5)}`,
    lastName: `user${randomWord(5)}`,
    company: `Company ${randomWord(5)}`,
    address1: `${faker.location.buildingNumber()} ${faker.location.street()}`,
    address2: `Block ${faker.string.numeric(2)}`,
    city: 'Danang',
    postCode: faker.string.numeric(5),
    countryId: Constants.VIETNAM_COUNTRY_ID,
    zoneId: Constants.DANANG_ZONE_ID,
  };
}