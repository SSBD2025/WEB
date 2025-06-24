import axios from "axios";
import i18n from "@/i18n";
import { toast } from "sonner";

export const axiosErrorHandler = (
  error: unknown,
  fallbackMessage = "unexpected"
) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 500) {
      toast.error(i18n.t("exceptions.unexpected"));
      return;
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      fallbackMessage;

    toast.error(i18n.t("exceptions." + message));
  }
};
