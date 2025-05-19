import axios from "axios";
import i18n from "@/i18n"
import { toast } from "sonner";

export const axiosErrorHandler = (
  error: unknown,
  fallbackMessage = "An unexpected error occurred"
) => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      fallbackMessage;
      toast.error(i18n.t("exceptions." + message))
      console.log("Axios error:", error);
  } else {
    toast.error(fallbackMessage)
    console.log("Unknown error:", error);
  }
};
