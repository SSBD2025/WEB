import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ROUTES from "@/constants/routes";
import { getRoleBadges, getStatusBadge } from "@/lib/badges";
import { AccountWithRoles } from "@/types/user";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { t } from "i18next";

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

const AccountsTable = ({
  accounts,
  sortBy,
  sortOrder,
  onSortChange,
}: {
  accounts: AccountWithRoles[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (field: string) => void;
}) => {
  const navigate = useNavigate();

  const renderSortArrow = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="w-[250px]"
            onClick={() => onSortChange("firstName")}
          >
            {t("accountsTable.tableRow.name")}
            {renderSortArrow("firstName")}
          </TableHead>
          <TableHead>
            {t("accountsTable.tableRow.roles")}
          </TableHead>
          <TableHead>
            {t("accountsTable.tableRow.status")}
          </TableHead>
          <TableHead
            onClick={() => onSortChange("lastSuccessfulLogin")}
            className="hidden md:table-cell"
          >
            {t("accountsTable.tableRow.lastLoggedIn")}
            {renderSortArrow("lastSuccessfulLogin")}
          </TableHead>
          <TableHead
            onClick={() => onSortChange("lastLoggedInIp")}
            className="hidden md:table-cell"
          >
            {t("accountsTable.tableRow.lastLoggedInIp")}
            {renderSortArrow("lastLoggedInIp")}
          </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map(({ accountDTO, userRoleDTOS }, i) => {
          const isClickableRow = window.innerWidth < 768;

          const handleRowClick = () => {
            if (isClickableRow) {
              navigate(ROUTES.getAdminUserDetails(accountDTO.id));
            }
          };

          return (
            <motion.tr
              key={accountDTO.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              onClick={handleRowClick}
              className={isClickableRow ? "cursor-pointer" : ""}
            >
              <TableCell className="font-medium">
                <div>
                  <div className="font-medium">{`${accountDTO.firstName} ${accountDTO.lastName}`}</div>
                  <div className="text-xs text-muted-foreground">
                    {accountDTO.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getRoleBadges(
                  userRoleDTOS
                    .filter((role) => role.active)
                    .map((role) => {
                      const name = role.roleName.toLowerCase()
                      return t(`roles.${name}`)
                    }),
                )}
              </TableCell>
              <TableCell>
                {getStatusBadge({
                  active: accountDTO.active,
                  verified: accountDTO.verified,
                })}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span>
                  {accountDTO.lastSuccessfulLogin
                    ? new Date(accountDTO.lastSuccessfulLogin).toLocaleString()
                    : t("accountsTable.tableData.neverLoggedIn")}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {accountDTO.lastSuccessfulLoginIp ||
                  t("accountsTable.tableData.neverLoggedIn")}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Link
                  className="cursor-pointer"
                  to={ROUTES.getAdminUserDetails(accountDTO.id)}
                >
                  <Button variant="ghost">
                    {t("accountsTable.buttons.editAccount")}
                  </Button>
                </Link>
              </TableCell>
            </motion.tr>
          );
        })}
      </TableBody>
    </Table>
  )
}

export default AccountsTable
