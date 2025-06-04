import { useGetClientsByDietician } from "@/hooks/useGetClientsByDietician";
import { motion } from "framer-motion";
import DataRenderer from "@/components/shared/DataRenderer";
import { CLIENTS_EMPTY } from "@/constants/states";
import ClientsTable from "@/components/tables/ClientsTable.tsx";
import { useDebounce } from "@/hooks/useDebounce.ts";
import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { t } from "i18next";
import { Search } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const DieticianDashboard = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const debouncedSearchPhrase = useDebounce(searchPhrase, 300);
  const { data, status } = useGetClientsByDietician(debouncedSearchPhrase);

  const handleSearch = (value: string) => {
    setSearchPhrase(value);
  };

  return (
    <main className="flex-grow items-center justify-center flex flex-col">
      <div className="w-full max-w-4xl px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">
          {t("dietician_dashboard.clients_list_title")}
        </h2>
        <div className="relative mb-4 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="search"
            type="text"
            placeholder={t("dietician_dashboard.search")}
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
            empty={CLIENTS_EMPTY}
            render={(clients) => <ClientsTable clients={clients} />}
          />
        </motion.div>
      </div>
    </main>
  );
};

export default DieticianDashboard;
