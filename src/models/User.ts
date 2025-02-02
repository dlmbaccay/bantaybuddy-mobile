export interface User {
  uid: string;
  email: string;
  signInMethod: string[];

  username?: string;
  displayName?: string;
  photoURL?: string;
  coverPhotoURL?: string;
  birthdate?: string;
  sex?: string;

  location?: string;
  phoneNumber?: string;
  bio?: string;

  following?: string[];
  followers?: string[];

  posts?: string[];
  pets?: string[];
}