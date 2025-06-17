import {useMutation, useQuery} from "@tanstack/react-query";
import {getClientById, orderMedicalExaminations} from "@/api/dietician.api.ts";
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

export const useClientValidation = (clientId: string) => {
    return useQuery({
        queryKey: ["clientValidation", clientId],
        queryFn: () => getClientById(clientId),
        retry: false,
        enabled: !!clientId,
    });
};