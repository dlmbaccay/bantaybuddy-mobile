export interface User {
  uid: string;
  email: string;
  signInMethod: string[];

  username?: string;
  displayName?: string;
  photoURL?: string;

  coverPhotoURL?: string; // can remove
  birthdate?: string; // can remove
  sex?: string; // can remove

  location?: string; // can remove
  phoneNumber?: string; // can remove
  bio?: string; // limit to 120 characters.

  following?: string[];
  followers?: string[];

  posts?: string[];
  pets?: string[];
}