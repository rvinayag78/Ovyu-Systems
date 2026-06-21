// Lightweight reference data for History form typeaheads.
// Kept static and bundled (free, offline) per the Flow 2 spec. Swap the place
// list for a Places autocomplete API later if a fuller dataset is needed.

export const LANGUAGES: string[] = [
  "English", "Mandarin Chinese", "Hindi", "Spanish", "French", "Standard Arabic",
  "Bengali", "Portuguese", "Russian", "Urdu", "Indonesian", "German", "Japanese",
  "Swahili", "Marathi", "Telugu", "Turkish", "Tamil", "Yue Chinese (Cantonese)",
  "Vietnamese", "Korean", "Italian", "Hausa", "Thai", "Gujarati", "Polish",
  "Ukrainian", "Persian (Farsi)", "Malayalam", "Kannada", "Dutch", "Greek",
  "Hebrew", "Punjabi", "Romanian", "Tagalog (Filipino)", "Czech", "Swedish",
  "Hungarian", "Sinhala", "Nepali", "Burmese", "Khmer", "Norwegian", "Danish",
  "Finnish", "Malay", "Pashto", "Amharic", "Somali", "Zulu", "Afrikaans",
];

// A compact "City, Country" seed list — common origins for typeahead.
// This is intentionally short; replace with GeoNames/Places for full coverage.
export const PLACES: string[] = [
  "London, United Kingdom", "Manchester, United Kingdom", "Dublin, Ireland",
  "New York, United States", "Los Angeles, United States", "Chicago, United States",
  "San Francisco, United States", "Boston, United States", "Seattle, United States",
  "Toronto, Canada", "Vancouver, Canada", "Montreal, Canada",
  "Mexico City, Mexico", "São Paulo, Brazil", "Rio de Janeiro, Brazil",
  "Buenos Aires, Argentina", "Lima, Peru", "Bogotá, Colombia",
  "Paris, France", "Berlin, Germany", "Munich, Germany", "Madrid, Spain",
  "Barcelona, Spain", "Rome, Italy", "Milan, Italy", "Amsterdam, Netherlands",
  "Brussels, Belgium", "Zurich, Switzerland", "Vienna, Austria", "Lisbon, Portugal",
  "Stockholm, Sweden", "Oslo, Norway", "Copenhagen, Denmark", "Helsinki, Finland",
  "Warsaw, Poland", "Prague, Czechia", "Budapest, Hungary", "Athens, Greece",
  "Istanbul, Turkey", "Moscow, Russia", "Kyiv, Ukraine",
  "Cairo, Egypt", "Lagos, Nigeria", "Nairobi, Kenya", "Accra, Ghana",
  "Johannesburg, South Africa", "Cape Town, South Africa", "Casablanca, Morocco",
  "Tel Aviv, Israel", "Dubai, United Arab Emirates", "Riyadh, Saudi Arabia",
  "Mumbai, India", "Delhi, India", "Bengaluru, India", "Chennai, India",
  "Kolkata, India", "Hyderabad, India", "Karachi, Pakistan", "Lahore, Pakistan",
  "Dhaka, Bangladesh", "Colombo, Sri Lanka", "Kathmandu, Nepal",
  "Beijing, China", "Shanghai, China", "Hong Kong, China", "Tokyo, Japan",
  "Osaka, Japan", "Seoul, South Korea", "Singapore, Singapore",
  "Bangkok, Thailand", "Jakarta, Indonesia", "Kuala Lumpur, Malaysia",
  "Manila, Philippines", "Ho Chi Minh City, Vietnam", "Hanoi, Vietnam",
  "Sydney, Australia", "Melbourne, Australia", "Auckland, New Zealand",
];

// Validate MM/DD/YYYY and that it is a real calendar date.
export function isValidMMDDYYYY(value: string): boolean {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!m) return false;
  const month = Number(m[1]);
  const day = Number(m[2]);
  const year = Number(m[3]);
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > 2100) return false;
  const daysInMonth = new Date(year, month, 0).getDate();
  return day >= 1 && day <= daysInMonth;
}

// Auto-insert slashes as the user types digits → MM/DD/YYYY.
export function maskMMDDYYYY(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join("/");
}
