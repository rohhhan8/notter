export type ProfileIntent = "personal" | "work" | "study";

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  username: string;
  intent: ProfileIntent;
}

export interface CreateProfileRequest {
  fullName: string;
  username: string;
  intent: ProfileIntent;
}
