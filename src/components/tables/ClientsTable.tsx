import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { Client } from "@/types/user";
import { Link } from "react-router";
import ROUTES from "@/constants/routes.ts";

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
};

const ClientsTable = ({ clients }: { clients: Client[] }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">{t("clients_table.title")}</h2>
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            <TableHead>{t("clients_table.name")}</TableHead>
            <TableHead>{t("clients_table.email")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client, i) => {
            const { firstName, lastName, email, id } = client.account;
            return (
              <motion.tr
                key={id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">
                  {firstName} {lastName}
                </TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>
                  <Link className="cursor-pointer" to={ROUTES.CLIENT_DETAILS}>
                    <Button variant="ghost">
                      {t("clients_table.view_details")}
                    </Button>
                  </Link>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default ClientsTable;
