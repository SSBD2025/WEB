import { useAllAccounts } from "@/hooks/useAllAccounts";
import DataRenderer from "@/components/shared/DataRenderer";
import { ACCOUNTS_EMPTY } from "@/constants/states";
import { motion, Variants } from "framer-motion";
import AccountsTable from "@/components/tables/AccountsTable";
import Pagination from "@/components/shared/Pagination";
import { useSearchParams } from "react-router";
import useStoredSettings from "@/hooks/useStoredSettings";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { AccountSearchAutocomplete } from "@/components/accountSearchAutocomplete";

const containerVariants: Variants = {
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

  const [settings, setSettings] = useStoredSettings()
  const [searchParams] = useSearchParams()
  const pageParam = searchParams.get("page") || "1"
  const page = Number.parseInt(pageParam, 10)

  const sortBy = settings.sortBy
  const sortOrder = settings.sortOrder
  const pageSize = settings.pageSize

  const { status, error, data, isFetching } = useAllAccounts({
    searchPhrase: debouncedSearchPhrase,
    page: page - 1,
    size: pageSize,
    sortBy,
    sortOrder,
  });

  const handleSearch = (value: string) => {
    setSearchPhrase(value)
  }

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
            <AccountSearchAutocomplete
                accounts={data?._embedded?.accountWithRolesDTOList}
                onSearch={handleSearch}
                searchPhrase={searchPhrase}
                isLoading={isFetching}
            />
            {searchPhrase && (
                <p className="text-sm text-muted-foreground mt-2">
                  {t("accountsTable.search.results", { count: data?.page?.totalElements || 0 })}
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
                data={data?._embedded?.accountWithRolesDTOList}
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

        <Pagination
            page={page}
            links={data?._links}
            pageInfo={data?.page}
            containerClasses="p-6"
        />
      </main>
  );
};

export default AdminDashboard;