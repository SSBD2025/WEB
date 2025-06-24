import {useMutation, useQuery} from "@tanstack/react-query";
import {getClientById, getLastBloodTestOrder, orderMedicalExaminations} from "@/api/dietician.api.ts";
import {axiosErrorHandler} from "@/lib/axiosErrorHandler.ts";
import {t} from "i18next";
import {toast} from "sonner";
import {BloodOrder} from "@/types/blood_test_report";

export const GET_LAST_BLOOD_ORDER = "get_last_blood_order"

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

export const useGetLastBloodTestOrder = (clientId: string) => {
    return useQuery<BloodOrder>({
        queryKey: [GET_LAST_BLOOD_ORDER, clientId],
        queryFn: () =>  getLastBloodTestOrder(clientId),
        retry: false,
        enabled: !!clientId,
    });
}