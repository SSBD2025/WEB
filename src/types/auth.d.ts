export interface RegisterUserRequest {
    client?: Record<string, unknown>;
    account: {
        login: string;
        password: string;
        email: string;
        firstName: string;
        lastName: string;
        language: string;
    };
}