export interface AccountData {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
}

export interface AccountUpdateData {
  firstName: string;
  lastName: string;
  telephone: string;
}

export interface AddressData {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  postCode: string;
  countryId: string;
  zoneId: string;
}