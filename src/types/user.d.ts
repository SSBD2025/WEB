export type Account = {
  id: string;
  version: number;
  login: string;
  email: string;
  active: boolean;
  verified: boolean;
  firstName: string;
  lastName: string;
  lastSuccessfulLogin: string | null;
  lastFailedLogin: string | null;
  language: string | null;
  lastSuccessfulLoginIp: string | null;
  lastFailedLoginIp: string | null;
};

export type Role = {
  active: boolean;
  roleName: string;
};

export type User = {
  account: Account;
  lockToken: string;
  roles: Role[];
};

export type AccountWithRoles = {
  accountDTO: Account;
  userRoleDTOS: Role[];
};
