export type RegisterUserRequest =
    | {
    account: AccountDetails;
    client: Record<string, unknown>;
}
    | {
    account: AccountDetails;
    dietician: Record<string, unknown>;
}

interface AccountDetails {
    login: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    language: string;
}
