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
import { Dietician } from "@/types/user";
import { Link } from "react-router";

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

const ClientsTable = ({ dieticians }: { dieticians: Dietician[] }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        {t("dieticians_table.title")}
      </h2>
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            <TableHead>{t("dieticians_table.name")}</TableHead>
            <TableHead>{t("dieticians_table.email")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dieticians.map((dietician, i) => {
            const { firstName, lastName, email, id } = dietician.account;
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
                  <Link className="cursor-pointer" to={"/choose-dietician"}>
                    <Button variant="ghost">
                      {t("dieticians_table.choose_dietician")}
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
