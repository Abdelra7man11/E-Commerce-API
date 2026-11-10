export interface User {
  email: string;
  displayName: string;
  token: string;
  userName?: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  country: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  displayName: string;
  email: string;
  password: string;
  userName?: string;
  phoneNumber?: string;
}
