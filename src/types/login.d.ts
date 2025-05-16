export interface LoginRequest {
    login: string;
    password: string;
}

export interface TwoFactorLoginRequest {
    code: string;
    access2FAToken: string;
}
