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
  twoFactorAuth: boolean;
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

export type AccessLevel = "admin" | "client" | "dietician";

export type AllAccounts = {
  _embedded: {
    accountWithRolesDTOList: AccountWithRoles[];
  };
  _links: {
    first?: { href: string };
    self: { href: string };
    next?: { href: string };
    last?: { href: string };
    prev?: { href: string };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface Client {
  client: {
    id: string;
  },
  account: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Dietician {
  dietician: {
    id: string;
  },
  account: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface AccountData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}