import apiClient from "@/lib/apiClient";

export const getCurrentUser = async () => {
  const res = await apiClient.get("/account/me");
  return res.data;
};

export const changeUserData = async (data: {
  firstName: string;
  lastName: string;
  lockToken: string;
} ) => {
  const res = await apiClient.put("/account/me", data);
  return res.data;
};

export const changeUserPassword = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  const res = await apiClient.post("/account/changePassword", data);
  return res.data;
};

export const changeUserEmail = async (data: {
  email: string;
}) => {
  const res = await apiClient.post("/account/change-email", data);
  return res.data;
}


export const enable2FA = async () => {
  const res = await apiClient.post("/account/me/enable2f");
  return res.data;
}

export const disable2FA = async () => {
  const res = await apiClient.post("/account/me/disable2f");
  return res.data;
}

export const logRoleChange = async (data: { previousRole: string | null; newRole: string }) => {
  const res = await apiClient.post("/account/log-role-change", data)
  return res.data
}

export const resendEmailChangeEmail = async () => {
  const res = await apiClient.post("/account/resend-change-email");
  return res.data;
}