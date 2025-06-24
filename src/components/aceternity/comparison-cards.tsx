import type React from "react";
import { t } from "i18next";

import {
  Apple,
  Calendar,
  LineChartIcon as ChartLine,
  ClipboardList,
  MessageSquare,
  Users,
  Utensils,
  FileText,
  Bell,
  BarChart,
  UserCog,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router";
import ROUTES from "@/constants/routes.ts";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-medium leading-none">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function ClientDieticianComparison() {
  const { data: user } = useCurrentUser();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
      className="max-w-7xl mx-auto py-8"
    >
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-primary">
        {t("home.role_info")}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Client Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <Card className="overflow-hidden border-2 border-primary/20 transition-all hover:shadow-md">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-center text-2xl">
                {t("home.client")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("home.client_description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 p-6">
              <FeatureItem
                icon={<Apple className="h-5 w-5" />}
                title={t("home.client_survey")}
                description={t("home.client_survey_info")}
              />
              <FeatureItem
                icon={<ChartLine className="h-5 w-5" />}
                title={t("home.client_stats")}
                description={t("home.client_stats_info")}
              />
              <FeatureItem
                icon={<Calendar className="h-5 w-5" />}
                title={t("home.client_review")}
                description={t("home.client_review_info")}
              />
              <FeatureItem
                icon={<MessageSquare className="h-5 w-5" />}
                title={t("home.client_access_plans")}
                description={t("home.client_access_plans_info")}
              />
              <FeatureItem
                icon={<ClipboardList className="h-5 w-5" />}
                title={t("home.client_view_results")}
                description={t("home.client_view_results_info")}
              />
              <FeatureItem
                icon={<Bell className="h-5 w-5" />}
                title={t("home.client_notifications")}
                description={t("home.client_notifications_info")}
              />
              {!user && (
                <Link to={ROUTES.USER_REGISTER} className="w-full block">
                  <Button className="w-full cursor-pointer transform rounded-lg px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-75 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                    {t("home.client_register")}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>
        {/* Dietician Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          <Card className="overflow-hidden border-2 border-primary/20 transition-all hover:shadow-md">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-center text-2xl">
                {t("home.dietitian")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("home.dietitian_description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 p-6">
              <FeatureItem
                icon={<Users className="h-5 w-5" />}
                title={t("home.dietitian_manage_clients")}
                description={t("home.dietitian_manage_clients_info")}
              />
              <FeatureItem
                icon={<Utensils className="h-5 w-5" />}
                title={t("home.dietitian_analyze_surveys")}
                description={t("home.dietitian_analyze_surveys_info")}
              />
              <FeatureItem
                icon={<BarChart className="h-5 w-5" />}
                title={t("home.dietitian_assign_plans")}
                description={t("home.dietitian_assign_plans_info")}
              />
              <FeatureItem
                icon={<FileText className="h-5 w-5" />}
                title={t("home.dietitian_lab_analysis")}
                description={t("home.dietitian_lab_analysis_info")}
              />
              <FeatureItem
                icon={<Calendar className="h-5 w-5" />}
                title={t("home.dietitian_feedback")}
                description={t("home.dietitian_feedback_info")}
              />
              <FeatureItem
                icon={<UserCog className="h-5 w-5" />}
                title={t("home.dietitian_reminders")}
                description={t("home.dietitian_reminders_info")}
              />
              {!user && (
                <Link to={ROUTES.DIETICIAN_REGISTER} className="w-full block">
                  <Button className="w-full cursor-pointer transform rounded-lg px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-75 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                    {t("home.dietitian_register")}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
