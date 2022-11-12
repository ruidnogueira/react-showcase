export interface ApiAuthSession {
  id: number;
  username: string;
}

export interface ApiCreateAuthSessionRequest {
  email: string;
  password: string;
}
