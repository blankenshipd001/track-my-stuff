export interface User {
  name: string;
  uid: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
  auth_time: number;
  firebase: {
    identities: object;
    sign_in_provider: string;
  };
}
