export interface CountryAddressConfig {
  code: string;
  name: string;
  regionLabel: string;
  postalLabel: string;
  regions?: string[];
}

export const COUNTRY_ADDRESS_CONFIGS: CountryAddressConfig[] = [
  {
    code: 'HU',
    name: 'Hungary',
    regionLabel: 'County',
    postalLabel: 'Postal code',
    regions: [
      'Bacs-Kiskun',
      'Baranya',
      'Bekes',
      'Borsod-Abauj-Zemplen',
      'Csongrad-Csanad',
      'Fejer',
      'Gyor-Moson-Sopron',
      'Hajdu-Bihar',
      'Heves',
      'Jasz-Nagykun-Szolnok',
      'Komarom-Esztergom',
      'Nograd',
      'Pest',
      'Somogy',
      'Szabolcs-Szatmar-Bereg',
      'Tolna',
      'Vas',
      'Veszprem',
      'Zala',
      'Budapest',
    ],
  },
  {
    code: 'US',
    name: 'United States',
    regionLabel: 'State',
    postalLabel: 'ZIP code',
  },
  {
    code: 'DE',
    name: 'Germany',
    regionLabel: 'State',
    postalLabel: 'Postal code',
  },
  {
    code: 'AT',
    name: 'Austria',
    regionLabel: 'State',
    postalLabel: 'Postal code',
  },
  {
    code: 'SK',
    name: 'Slovakia',
    regionLabel: 'Region',
    postalLabel: 'Postal code',
  },
  {
    code: 'RO',
    name: 'Romania',
    regionLabel: 'County',
    postalLabel: 'Postal code',
  },
  {
    code: 'PL',
    name: 'Poland',
    regionLabel: 'Voivodeship',
    postalLabel: 'Postal code',
  },
];

export const DEFAULT_COUNTRY_CODE = 'HU';

export const getCountryAddressConfig = (countryCode?: string): CountryAddressConfig => {
  const normalized = (countryCode || DEFAULT_COUNTRY_CODE).toUpperCase();
  return COUNTRY_ADDRESS_CONFIGS.find((cfg) => cfg.code === normalized) || COUNTRY_ADDRESS_CONFIGS[0];
};

export const formatAddressSingleLine = (address: {
  fullName?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}) => {
  const cityStateZip = [address.city, address.state, address.zipCode].filter(Boolean).join(' ');
  return [address.fullName, address.street, cityStateZip, address.country].filter(Boolean).join(', ');
};
