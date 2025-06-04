const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    ME: "/me",
    USER_REGISTER: "/user/register",
    DIETICIAN_REGISTER: "/dietician/register",
    ADMIN_REGISTER: "/admin/register",
    PASSWORD_RESET: "/reset/password",
    NEW_PASSWORD: "/reset/password/:token",
    ADMIN_USER_DETAILS: "/admin/dashboard/users/:id",
    getAdminUserDetails: (id: string) => `/admin/dashboard/users/${id}`,
    ADMIN_DASHBOARD: "/admin/dashboard",
    TWO_FACTOR: "/2fa-login",
    REDIRECT: "/redirect",
    DIETICIAN_DASHBOARD: "/dietician/dashboard",
    CLIENT_DASHBOARD: "/client/dashboard",
    CODELOGIN_REQUEST: "/codelogin/request",
    CODELOGIN: "/codelogin",
    FORCE_CHANGE_PASSWORD: "/password/change",
}

export default ROUTES;
