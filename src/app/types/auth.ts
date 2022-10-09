export interface ApiAuthSession {
  id: number;
  name: string;
}

export interface ApiCreateAuthSessionRequest {
  email: string;
  password: string;
}
