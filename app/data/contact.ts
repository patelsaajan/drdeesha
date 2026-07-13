export interface DayHours {
  day: string
  /** 24hr "HH:MM", or null if closed that day */
  open: string | null
  close: string | null
}

// Confirm the opening hours below when they're settled.
export const practice = {
  name: 'Smart Smiles',
  location: 'Ystrad Mynach',
  bookingHref: 'https://smartsmiles.portal.dental/',
  // 19 Bedwlwyn Rd, Ystrad Mynach, Hengoed CF82 7AA — via Nominatim/OSM.
  coordinates: { lat: 51.6419655, lng: -3.2360676 },
  hours: [
    { day: 'Monday', open: '09:00', close: '17:30' },
    { day: 'Tuesday', open: '09:00', close: '17:30' },
    { day: 'Wednesday', open: '09:00', close: '17:30' },
    { day: 'Thursday', open: '09:00', close: '17:30' },
    { day: 'Friday', open: '09:00', close: '16:00' },
    { day: 'Saturday', open: null, close: null },
    { day: 'Sunday', open: null, close: null },
  ] satisfies DayHours[],
}
