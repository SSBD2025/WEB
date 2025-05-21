import { useAllAccounts } from "@/hooks/useAllAccounts";
import DataRenderer from "@/components/shared/DataRenderer";
import { ACCOUNTS_EMPTY } from "@/constants/states";
import { motion } from "framer-motion";
import AccountsTable from "@/components/tables/AccountsTable";
import Pagination from "@/components/shared/Pagination";
import { useSearchParams } from "react-router";
import useStoredSettings from "@/hooks/useStoredSettings";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const AdminDashboard = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const debouncedSearchPhrase = useDebounce(searchPhrase, 300);
  const { t } = useTranslation();

  const [settings, setSettings] = useStoredSettings();
  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get("page") || "1";
  const page = parseInt(pageParam, 10);

  const sortBy = settings.sortBy;
  const sortOrder = settings.sortOrder;
  const pageSize = settings.pageSize;

  const { status, error, data } = useAllAccounts({
    searchPhrase: debouncedSearchPhrase,
    page: page - 1,
    size: pageSize,
    sortBy,
    sortOrder,
  });

  const handleSortChange = (newSortBy: string) => {
    setSettings((prev) => {
      const newSortOrder =
        prev.sortBy === newSortBy && prev.sortOrder === "asc" ? "desc" : "asc";
      return {
        ...prev,
        sortBy: newSortBy,
        sortOrder: newSortOrder,
      };
    });
  };

  return (
    <main className="flex-grow items-center justify-center flex flex-col">
      <div className="w-full max-w-6xl px-4 py-6">
        <div className="mb-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("accountsTable.search.placeholder")}
              value={searchPhrase}
              onChange={(event) => setSearchPhrase(event.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
          {searchPhrase && (
            <p className="text-sm text-muted-foreground mt-2">
              {t("accountsTable.search.results", { count: data?.totalElements || 0 })}
            </p>
          )}
        </div>

        <motion.div
          className="relative w-full overflow-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <DataRenderer
            status={status}
            error={error}
            data={data?.content}
            empty={ACCOUNTS_EMPTY}
            render={(accounts) => (
              <AccountsTable
                accounts={accounts}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
            )}
          />
        </motion.div>
      </div>

      <Pagination page={page} isNext={!data?.last} containerClasses="p-6" />
    </main>
  );
};

export default AdminDashboard;