import authClient from "@/lib/authClient";

export const confirmEmail = async (token: string) => {
  const res = await authClient.get("/account/confirm-email", {
    params: {
      token,
    },
  });
  return res.data;
};

export const revertMail = async (token: string) => {
  const res = await authClient.get("/account/revert-email-change", {
    params: {
      token,
    },
  });
  return res.data;
};

export const verifyMail = async (token: string) => {
  const res = await authClient.get("/account/verify", {
    params: {
      token,
    },
  });
  return res.data;
};
