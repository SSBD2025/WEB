import {useMutation} from "@tanstack/react-query";
import {axiosErrorHandler} from "@/lib/axiosErrorHandler.ts";
import {codelogin, codeloginRequest} from "@/api/codelogin.ts";

export const useCodeloginRequest = () => {
    return useMutation({
        mutationFn: codeloginRequest,
        onError: (error) => axiosErrorHandler(error),
    })
}

export const useCodelogin = () => {
    return useMutation({
        mutationFn: codelogin,
        onError: (error) => axiosErrorHandler(error, "Codelogin failed"),
    });
};