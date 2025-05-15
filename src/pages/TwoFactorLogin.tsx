import TwoFactorLoginForm from "@/components/twoFactorLoginForm.tsx";
import {t} from "i18next"

const TwoFactorLoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {t("2fa.enter_code")}
                </h2>
                <TwoFactorLoginForm />
            </div>
        </div>
    );
};

export default TwoFactorLoginPage;
