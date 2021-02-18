export interface User {
  username: string;
  passwordHash: string;
  email: string;
  name?: string;
  imageUrl?: string;
  active?: boolean
}
