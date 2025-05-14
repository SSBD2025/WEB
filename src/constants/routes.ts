const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    USER_REGISTER: "/user/register",
    DIETICIAN_REGISTER: "/dietician/register",
    ADMIN_USER_DETAILS: "/admin/users/:id",
    getAdminUserDetails: (id: string) => `/admin/users/${id}`,
}

export default ROUTES;
