import PermanentSurveyView from "@/components/permanentSurveyView";
import { useGetPermanentSurvey } from "@/hooks/useSubmitPermanentSurvey";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/shared/BackButton";
import ROUTES from "@/constants/routes";


const PermanentSurveyPage = () => {
  const { data: survey } = useGetPermanentSurvey()
  const { t } = useTranslation()

  if (!survey) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <p className="text-muted-foreground">{t("permanent_survey_form.not_found")}</p>
      </div>
    )
  }

  return (
    <div className="flex-grow">
      <div className="container max-w-4xl mx-auto py-8">
        <div className="mb-6">
          <BackButton route={ROUTES.HOME} />
        </div>
        <div className="flex items-center justify-center">
          <PermanentSurveyView survey={survey} />
        </div>
      </div>
    </div>
  )
}

export default PermanentSurveyPage