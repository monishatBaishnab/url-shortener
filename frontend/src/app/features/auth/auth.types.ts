export interface UserData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  created_at: string;
  updated_at: string;
}

export type LoginResponse = {
  accessToken: string;
};

export interface AuthInitialState {
  accessToken?: string;
  profileInfo?: UserData;
}
