export interface userRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "GUEST_USER" | "PROPERTY_OWNER";
  phoneNumber?: string;
  address?: string;
  image?: string;
}
