import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce.ts";
import { useGetAllAvailableDieticians } from "@/hooks/useGetAllAvailableDieticians";
import { useClientStatus } from "@/hooks/useAssignDietician";
import { t } from "i18next";
import { Search, Users, FileText } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { motion, type Variants } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataRenderer from "@/components/shared/DataRenderer.tsx";
import { DIETICIANS_EMPTY } from "@/constants/states.ts";
import DieticiansTable from "@/components/tables/DieticiansTable.tsx";
import PermanentSurveyForm from "@/components/permanentSurveyForm.tsx";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

type View = "dieticians" | "permanent_survey";

const ClientDashboard = () => {
  const [activeView, setActiveView] = useState<View>("dieticians");
  const [searchPhrase, setSearchPhrase] = useState("");
  const debouncedSearchPhrase = useDebounce(searchPhrase, 300);
  const { data, status } = useGetAllAvailableDieticians(debouncedSearchPhrase);
  const { data: clientStatus, isLoading: isClientStatusLoading } = useClientStatus();

  const handleSearch = (value: string) => {
    setSearchPhrase(value);
  };

  return (
    <main className="flex-grow items-center justify-center flex flex-col bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-6xl px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {t("client_dashboard.dashboard_title")}
          </h1>
        </motion.div>

        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as View)}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="dieticians" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("dieticians_table.title")}
            </TabsTrigger>
            <TabsTrigger
              value="permanent_survey"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {t("client_dashboard.permanent_survey")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dieticians" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t("client_dashboard.available_dieticians")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="search"
                    type="text"
                    placeholder={t("client_dashboard.search")}
                    value={searchPhrase}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <motion.div
                  className="relative w-full"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <DataRenderer
                    status={status}
                    data={data}
                    empty={DIETICIANS_EMPTY}
                    render={(dieticians) => (
                      <DieticiansTable
                        dieticians={dieticians}
                        hasAssignedDietician={
                          clientStatus?.hasAssignedDietician === true
                        }
                        isLoadingStatus={isClientStatusLoading}
                      />
                    )}
                  />
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permanent_survey">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t("client_dashboard.permanent_survey")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <PermanentSurveyForm />
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default ClientDashboard;
