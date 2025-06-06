import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce.ts";
import { useGetAllAvailableDieticians } from "@/hooks/useGetAllAvailableDieticians";
import { t } from "i18next";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { motion } from "framer-motion";
import DataRenderer from "@/components/shared/DataRenderer.tsx";
import { DIETICIANS_EMPTY } from "@/constants/states.ts";
import DieticiansTable from "@/components/tables/DieticiansTable.tsx";
import { Button } from "@/components/ui/button.tsx";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const ClientDashboard = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [showDieticians, setShowDieticians] = useState(false);
  const debouncedSearchPhrase = useDebounce(searchPhrase, 300);
  const { data, status } = useGetAllAvailableDieticians(debouncedSearchPhrase);

  const handleSearch = (value: string) => {
    setSearchPhrase(value);
  };

  const toggleDieticiansList = () => {
    setShowDieticians((prev) => !prev);
  };

  return (
    <main className="flex-grow items-center justify-center flex flex-col">
      <div className="w-full max-w-4xl px-4 py-6">
        <h2 className="text-xl font-semibold mb-6">
          {t("client_dashboard.dashboard_title")}
        </h2>
        <div className="mb-6">
          <Button onClick={toggleDieticiansList}>
            {showDieticians
              ? t("client_dashboard.hide_dieticians_list")
              : t("client_dashboard.show_dieticians_list")}
          </Button>
        </div>

        {showDieticians && (
          <>
            <div className="relative mb-4 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="search"
                type="text"
                placeholder={t("client_dashboard.search")}
                value={searchPhrase}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            <motion.div
              className="relative w-full overflow-auto"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <DataRenderer
                status={status}
                data={data}
                empty={DIETICIANS_EMPTY}
                render={(dieticians) => (
                  <DieticiansTable dieticians={dieticians} />
                )}
              />
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
};

export default ClientDashboard;
