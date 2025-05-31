export interface LoginUser {
  access: string;
  refresh: string;
  email?: string;
  password?: string;
}

export interface LoginSchema {
  email: string;
  password: string;
}
