const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    ME: "/me",
    USER_REGISTER: "/user/register",
    DIETICIAN_REGISTER: "/dietician/register",
    ADMIN_USER_DETAILS: "/admin/dashboard/users/:id",
    getAdminUserDetails: (id: string) => `/admin/dashboard/users/${id}`,
    ADMIN_DASHBOARD: "/admin/dashboard",
    TWO_FACTOR: "/2fa-login"
}

export default ROUTES;
