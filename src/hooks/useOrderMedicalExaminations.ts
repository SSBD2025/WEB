import {useMutation} from "@tanstack/react-query";
import {orderMedicalExaminations} from "@/api/dietician.api.ts";
import {axiosErrorHandler} from "@/lib/axiosErrorHandler.ts";
import {t} from "i18next";
import {toast} from "sonner";

export const useOrderMedicalExaminations = () => {
    return useMutation({
        mutationFn: orderMedicalExaminations,
        onError: (error) => axiosErrorHandler(error, t("order_medical_examinations.error")),
        onSuccess: () => {
            toast.success(t("order_medical_examinations.success"));
        }
    })
}