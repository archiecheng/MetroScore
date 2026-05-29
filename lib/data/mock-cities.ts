export type MockCity = {
  slug: string;
  name: string;
  state: string;
  label: string;
};

export const MOCK_CITIES: MockCity[] = [
  { slug: "san-jose-ca", name: "San Jose", state: "CA", label: "San Jose, CA" },
  { slug: "san-francisco-ca", name: "San Francisco", state: "CA", label: "San Francisco, CA" },
  { slug: "los-angeles-ca", name: "Los Angeles", state: "CA", label: "Los Angeles, CA" },
  { slug: "irvine-ca", name: "Irvine", state: "CA", label: "Irvine, CA" },
  { slug: "san-diego-ca", name: "San Diego", state: "CA", label: "San Diego, CA" },
  { slug: "austin-tx", name: "Austin", state: "TX", label: "Austin, TX" },
  { slug: "dallas-tx", name: "Dallas", state: "TX", label: "Dallas, TX" },
  { slug: "phoenix-az", name: "Phoenix", state: "AZ", label: "Phoenix, AZ" },
  { slug: "las-vegas-nv", name: "Las Vegas", state: "NV", label: "Las Vegas, NV" },
  { slug: "colorado-springs-co", name: "Colorado Springs", state: "CO", label: "Colorado Springs, CO" },
  { slug: "raleigh-nc", name: "Raleigh", state: "NC", label: "Raleigh, NC" },
  { slug: "tampa-fl", name: "Tampa", state: "FL", label: "Tampa, FL" },
];

export const PURPOSE_OPTIONS = [
  { value: "move", label: "Moving / Relocation" },
  { value: "primary_home", label: "Primary Home Purchase" },
  { value: "rental_investment", label: "Rental Investment" },
  { value: "long_term_investment", label: "Long-Term Investment" },
] as const;
