import { useGetClientsByDietician } from "@/hooks/useGetClientsByDietician";
import { motion } from "framer-motion";
import DataRenderer from "@/components/shared/DataRenderer";
import { CLIENTS_EMPTY } from "@/constants/states";
import ClientsTable from "@/components/tables/ClientsTable.tsx";

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

const DieticianDashboard = () => {
    const { data, status } = useGetClientsByDietician();

    return (
        <main className="flex-grow items-center justify-center flex flex-col">
            <div className="w-full max-w-4xl px-4 py-6">
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
                        render={(clients) => (<ClientsTable clients={clients} />)}
                    />
                </motion.div>
            </div>
        </main>
    );
};

export default DieticianDashboard;
