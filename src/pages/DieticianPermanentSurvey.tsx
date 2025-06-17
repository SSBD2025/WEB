import PermanentSurveyView from "@/components/permanentSurveyView";
import { useGetClientPermanentSurvey } from "@/hooks/useSubmitPermanentSurvey";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";

const DieticianPermanentSurvey = () => {
  const params = useParams<{ clientId: string }>();
  const id = params.clientId;
  const { t } = useTranslation();

  const { data, isLoading } = useGetClientPermanentSurvey(id ?? "");

  if (isLoading) {
    return (
      <main className="flex-grow flex justify-center items-center">
        <Spinner />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex-grow flex justify-center items-center">
        <p className="text-muted-foreground">{t("permanent_survey_form.not_found")}</p>
      </main>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center">
      {data && <PermanentSurveyView survey={data} />}
    </div>
  );
};

export default DieticianPermanentSurvey;
