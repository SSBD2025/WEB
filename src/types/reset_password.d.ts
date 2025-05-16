export interface PasswordResetRequest {
    email: string;
}
export interface PasswordReset {
    password: string;
}
export interface PasswordResetToken {
    token: string | undefined;
}