import PermanentSurveyView from "@/components/permanentSurveyView";
import { useGetPermanentSurvey } from "@/hooks/useSubmitPermanentSurvey";
import { useTranslation } from "react-i18next";

//TODO Komponent do przeniesienia 
const TempSurveyPage = () => {
  const { data: survey } = useGetPermanentSurvey();
  const { t } = useTranslation();

  if(!survey) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <p className="text-muted-foreground">{t("permanent_survey_form.not_found")}</p>
      </div> 
      );
  }

  return (
    <div className="flex-grow flex items-center justify-center">
      {survey && <PermanentSurveyView survey={survey} />}
    </div>
  );
};

export default TempSurveyPage;
