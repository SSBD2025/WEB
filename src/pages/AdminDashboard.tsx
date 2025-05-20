import { useAllAccounts } from "@/hooks/useAllAccounts";
import DataRenderer from "@/components/shared/DataRenderer";
import { ACCOUNTS_EMPTY } from "@/constants/states";

import { motion } from "framer-motion";
import AccountsTable from "@/components/tables/AccountsTable";
import Pagination from "@/components/shared/Pagination";
import { useSearchParams } from "react-router";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get("page") || "1";
  const page = parseInt(pageParam, 10);
  const { status, error, data } = useAllAccounts({ page: page - 1, size: 1 });

  return (
      <main className="flex-grow items-center justify-center flex flex-col">
        <div className="flex-grow flex items-center justify-center w-full">
          <motion.div
              className="relative w-full overflow-auto lg:p-16"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
          >
            <DataRenderer
                status={status}
                error={error}
                data={data?.content}
                empty={ACCOUNTS_EMPTY}
                render={(accounts) => <AccountsTable accounts={accounts} />}
            />
          </motion.div>
        </div>

        <Pagination
            page={page}
            isNext={!data?.last}
            containerClasses="p-6"
        />
      </main>
  );
};

export default AdminDashboard;