export interface AddressSuggestion {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  label: string;
}

const MOCK_ADDRESSES: AddressSuggestion[] = [
  {
    id: "1",
    street: "1200 Market Street",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    label: "1200 Market Street, San Francisco, CA 94102",
  },
  {
    id: "2",
    street: "455 Market Street",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    label: "455 Market Street, San Francisco, CA 94105",
  },
  {
    id: "3",
    street: "1 Ferry Building",
    city: "San Francisco",
    state: "CA",
    zip: "94111",
    label: "1 Ferry Building, San Francisco, CA 94111",
  },
  {
    id: "4",
    street: "2500 El Camino Real",
    city: "Palo Alto",
    state: "CA",
    zip: "94306",
    label: "2500 El Camino Real, Palo Alto, CA 94306",
  },
  {
    id: "5",
    street: "333 Post Street",
    city: "San Francisco",
    state: "CA",
    zip: "94108",
    label: "333 Post Street, San Francisco, CA 94108",
  },
  {
    id: "6",
    street: "500 Castro Street",
    city: "Mountain View",
    state: "CA",
    zip: "94041",
    label: "500 Castro Street, Mountain View, CA 94041",
  },
  {
    id: "7",
    street: "100 Main Street",
    city: "Los Altos",
    state: "CA",
    zip: "94022",
    label: "100 Main Street, Los Altos, CA 94022",
  },
  {
    id: "8",
    street: "2200 Broadway",
    city: "Redwood City",
    state: "CA",
    zip: "94063",
    label: "2200 Broadway, Redwood City, CA 94063",
  },
];

export function searchAddresses(query: string): AddressSuggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return MOCK_ADDRESSES.filter(
    (a) =>
      a.label.toLowerCase().includes(q) ||
      a.street.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.zip.includes(q),
  ).slice(0, 5);
}
