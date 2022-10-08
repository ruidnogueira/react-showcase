export interface ApiAuthSession {
  name: string;
}

export interface ApiCreateAuthSessionRequest {
  email: string;
  password: string;
}
