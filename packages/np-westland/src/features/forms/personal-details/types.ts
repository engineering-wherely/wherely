/** Public-facing professional details; excludes residential addresses and phone numbers. */
export type PersonalDetails = {
  firstName: string;
  lastName: string;
  professionalTitle: string;
  /** City/region and country only. */
  location: string;
  emailAddress: string;
  rightToWork: string;
  linkedInUrl?: string;
  /** URL of a CV suitable for public sharing. */
  cvUrl?: string;
};
