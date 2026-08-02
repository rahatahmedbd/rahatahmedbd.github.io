/**
 * Data handed to RahatVerse from the server — the *same* Supabase rows the
 * classic website renders. One database, two presentations.
 */
export interface VerseData {
  projects: any[];
  services: any[];
  skills: any[];
  faqs: any[];
  testimonials: any[];
}

export const emptyVerseData: VerseData = {
  projects: [],
  services: [],
  skills: [],
  faqs: [],
  testimonials: [],
};
