import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { submitPeriodicSurvey } from '@/api/periodicSurvey.api';
import { axiosErrorHandler } from '@/lib/axiosErrorHandler';
import { toast } from 'sonner';

export const useSubmitPeriodicSurvey = () => {
    const { t } = useTranslation();

    return useMutation({
        mutationFn: submitPeriodicSurvey,
        onError: (error) => {
            axiosErrorHandler(error, t("periodic_survey.submit_error"));
        },
        onSuccess: () => {
            toast.success(t("periodic_survey.submit_success"));
        },
    });
};