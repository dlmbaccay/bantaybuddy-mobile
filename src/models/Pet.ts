export interface Pet {
  uid: string;
  name: string;
  owners: string[];
  breed: string;
  sex: string;
  photoURL: string;
  birthdate: string;
  birthplace: string;

  favoriteFood?: string[];
  hobbies?: string[];

  taggedPosts?: string[];
  followers?: string[];
  following?: string[];
}