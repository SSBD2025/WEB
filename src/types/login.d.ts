export interface LoginRequest {
    login: string;
    password: string;
}

export interface TwoFactorLoginRequest {
    login: string;
    code: string;
}
