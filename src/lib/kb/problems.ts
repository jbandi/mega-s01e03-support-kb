// The problems #4471 holds. `parser` and `hint` are the causes causes.ts places a report in; `one-day`
// is the desk's own list of one-day moves (desk-notes.json), which a day/month flip cannot produce.
import type { Cause } from '#lib/kb/causes';

export type Problem = Cause | 'one-day' | 'unplaced';

export const PROBLEMS: Record<Problem, string> = {
  parser: 'the shared parser reads day-first dates month first',
  hint: 'booking-v3 prints MM/DD/YYYY under the date field of day-first tenants',
  'one-day': 'the booking lands one day early',
  unplaced: 'no tenant on file, or a month-first tenant',
};
