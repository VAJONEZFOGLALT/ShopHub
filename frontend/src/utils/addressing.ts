export interface CountryAddressConfig {
  code: string;
  name: string;
  regionLabel: string;
  postalLabel: string;
  regions?: string[];
  group: string;
}

export const COUNTRY_ADDRESS_GROUPS = [
  {
    label: 'Hungary',
    countries: [
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
        group: 'Hungary',
      },
    ],
  },
  {
    label: 'Europe',
    countries: [
      { code: 'AT', name: 'Austria', regionLabel: 'State', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'BE', name: 'Belgium', regionLabel: 'Province', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'BG', name: 'Bulgaria', regionLabel: 'Region', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'HR', name: 'Croatia', regionLabel: 'County', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'CY', name: 'Cyprus', regionLabel: 'District', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'CZ', name: 'Czechia', regionLabel: 'Region', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'DK', name: 'Denmark', regionLabel: 'Region', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'EE', name: 'Estonia', regionLabel: 'County', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'FI', name: 'Finland', regionLabel: 'Region', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'FR', name: 'France', regionLabel: 'Region', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'DE', name: 'Germany', regionLabel: 'State', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'GR', name: 'Greece', regionLabel: 'Region', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'IE', name: 'Ireland', regionLabel: 'County', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'IT', name: 'Italy', regionLabel: 'Province', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'LV', name: 'Latvia', regionLabel: 'Municipality', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'LT', name: 'Lithuania', regionLabel: 'County', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'LU', name: 'Luxembourg', regionLabel: 'District', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'MT', name: 'Malta', regionLabel: 'Region', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'NL', name: 'Netherlands', regionLabel: 'Province', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'PL', name: 'Poland', regionLabel: 'Voivodeship', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'PT', name: 'Portugal', regionLabel: 'District', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'RO', name: 'Romania', regionLabel: 'County', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'SK', name: 'Slovakia', regionLabel: 'Region', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'SI', name: 'Slovenia', regionLabel: 'Municipality', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'ES', name: 'Spain', regionLabel: 'Province', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'SE', name: 'Sweden', regionLabel: 'County', postalLabel: 'Postal code', group: 'Europe' },
      { code: 'GB', name: 'United Kingdom', regionLabel: 'County', postalLabel: 'Postal code', group: 'Europe' },
    ],
  },
  {
    label: 'Americas',
    countries: [
      { code: 'US', name: 'United States', regionLabel: 'State', postalLabel: 'ZIP code', group: 'Americas' },
      { code: 'CA', name: 'Canada', regionLabel: 'Province', postalLabel: 'Postal code', group: 'Americas' },
      { code: 'MX', name: 'Mexico', regionLabel: 'State', postalLabel: 'Postal code', group: 'Americas' },
      { code: 'BR', name: 'Brazil', regionLabel: 'State', postalLabel: 'Postal code', group: 'Americas' },
      { code: 'AR', name: 'Argentina', regionLabel: 'Province', postalLabel: 'Postal code', group: 'Americas' },
      { code: 'CL', name: 'Chile', regionLabel: 'Region', postalLabel: 'Postal code', group: 'Americas' },
    ],
  },
  {
    label: 'Asia',
    countries: [
      { code: 'CN', name: 'China', regionLabel: 'Province', postalLabel: 'Postal code', group: 'Asia' },
      { code: 'IN', name: 'India', regionLabel: 'State', postalLabel: 'Postal code', group: 'Asia' },
      { code: 'JP', name: 'Japan', regionLabel: 'Prefecture', postalLabel: 'Postal code', group: 'Asia' },
      { code: 'KR', name: 'South Korea', regionLabel: 'Province', postalLabel: 'Postal code', group: 'Asia' },
      { code: 'SG', name: 'Singapore', regionLabel: 'District', postalLabel: 'Postal code', group: 'Asia' },
      { code: 'TH', name: 'Thailand', regionLabel: 'Province', postalLabel: 'Postal code', group: 'Asia' },
      { code: 'VN', name: 'Vietnam', regionLabel: 'Province', postalLabel: 'Postal code', group: 'Asia' },
      { code: 'MY', name: 'Malaysia', regionLabel: 'State', postalLabel: 'Postal code', group: 'Asia' },
    ],
  },
  {
    label: 'Other',
    countries: [
      { code: 'AU', name: 'Australia', regionLabel: 'State/Territory', postalLabel: 'Postal code', group: 'Other' },
      { code: 'NZ', name: 'New Zealand', regionLabel: 'Region', postalLabel: 'Postal code', group: 'Other' },
      { code: 'TR', name: 'Turkey', regionLabel: 'Province', postalLabel: 'Postal code', group: 'Other' },
    ],
  },
];

export const COUNTRY_ADDRESS_CONFIGS: CountryAddressConfig[] = COUNTRY_ADDRESS_GROUPS.flatMap((group) => group.countries);

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
}, options?: { includeFullName?: boolean }) => {
  const city = (address.city || '').trim();
  const state = (address.state || '').trim();
  const zip = (address.zipCode || '').trim();

  const cityStateZipParts: string[] = [];
  if (city) {
    cityStateZipParts.push(city);
  }

  if (state && state.toLowerCase() !== city.toLowerCase()) {
    cityStateZipParts.push(state);
  }

  if (zip) {
    cityStateZipParts.push(zip);
  }

  const lineParts: string[] = [];
  if (options?.includeFullName && address.fullName) {
    lineParts.push(address.fullName);
  }
  if (address.street) {
    lineParts.push(address.street);
  }

  const cityStateZip = cityStateZipParts.join(' ');
  if (cityStateZip) {
    lineParts.push(cityStateZip);
  }
  if (address.country) {
    lineParts.push(address.country);
  }

  return lineParts.join(', ');
};
