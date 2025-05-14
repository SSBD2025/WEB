import { useAllAccounts } from "@/hooks/useAllAccounts";
import DataRenderer from "@/components/shared/DataRenderer";
import { ACCOUNTS_EMPTY } from "@/constants/states";

import { motion } from "framer-motion";
import AccountsTable from "@/components/tables/AccountsTable";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const AdminDashboard = () => {
  const { status, error, data } = useAllAccounts();

  return (
    <main className="flex-grow items-center justify-center flex">
      <motion.div
        className="relative w-full overflow-auto p-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <DataRenderer
          status={status}
          error={error}
          data={data}
          empty={ACCOUNTS_EMPTY}
          render={(accounts) => (
            <AccountsTable accounts={accounts} />
          )}
        />
      </motion.div>
    </main>
  );
};

export default AdminDashboard;
