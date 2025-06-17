import { getAllBloodTestOrders } from "@/api/dietician.api";
import { useQuery } from "@tanstack/react-query";
import type { BloodTestOrderWithClient } from "@/types/medical_examination";

export const useGetMedicalExaminations = () => {
    return useQuery<BloodTestOrderWithClient[]>({
        queryKey: ["medical-examinations"],
        queryFn: getAllBloodTestOrders,
    });
}