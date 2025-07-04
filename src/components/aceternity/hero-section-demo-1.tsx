import { motion } from "motion/react";
import { Button } from "../ui/button";
import { t } from "i18next";
import { Link } from "react-router";
import ROUTES from "@/constants/routes";
import useRole from "@/store";

export default function HeroSectionOne({ onClick }: { onClick: () => void }) {
  const { currentRole } = useRole();

  const renderButton = () => {
    switch (currentRole) {
      case "admin":
        return (
          <Button
            className="w-60 cursor-pointer transform rounded-lg  px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-75 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            asChild
          >
            <Link to={ROUTES.ADMIN_DASHBOARD}>{t('home.admin_dashboard')}</Link>
          </Button>
        );
      case "dietician":
        return (
          <Button
            className="w-60 cursor-pointer transform rounded-lg  px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-75 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            asChild
          >
            <Link to={ROUTES.DIETICIAN_DASHBOARD}>{t("home.dietitian_dashboard")}</Link>
          </Button>
        );
      case "client":
        return (
          <Button
            className="w-60 cursor-pointer transform rounded-lg  px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-75 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            asChild
          >
             <Link to={ROUTES.CLIENT_DASHBOARD}>{t("home.client_dashboard")}</Link>
          </Button>
        );
      default:
        return (
          <Button
            className="w-60 cursor-pointer transform rounded-lg  px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-75 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            asChild
          >
            <Link to={ROUTES.LOGIN}>{t("home.sign_in")}</Link>
          </Button>
        );
    }
  };

  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <div className="absolute inset-y-0 left-0 h-full w-px bg-muted">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-muted">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-muted">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-primary md:text-4xl lg:text-7xl">
          {t("home.title")
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-muted-foreground "
        >
          {t("home.info")}
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          {renderButton()}
          <Button
            onClick={onClick}
            variant="outline"
            className="w-60 cursor-pointer transform rounded-lg border border-gray-300 bg-secondary px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-75 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
          >
            {t("home.why_us")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
