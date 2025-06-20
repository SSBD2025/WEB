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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { t } from "i18next";
import type { Dietician } from "@/types/user";
import { useAssignDietician } from "@/hooks/useAssignDietician";
import { UserCheck, Mail, User, CheckCircle } from "lucide-react";

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

interface DieticiansTableProps {
  dieticians: Dietician[];
  hasAssignedDietician: boolean;
  isLoadingStatus?: boolean;
}

const DieticiansTable = ({
  dieticians,
  hasAssignedDietician,
  isLoadingStatus = false,
}: DieticiansTableProps) => {
  const assignDieticianMutation = useAssignDietician();

  const handleAssign = (dieticianId: string) => {
    assignDieticianMutation.mutate(dieticianId);
  };

  const isButtonDisabled =
    hasAssignedDietician ||
    assignDieticianMutation.isPending ||
    isLoadingStatus;

  return (
    <div className="rounded-lg border bg-card">
      {hasAssignedDietician && (
        <div className="border-b border-green-200 p-4 rounded-t-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">
              {t("dieticians_table.already_assigned")}
            </span>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">
              {t("dieticians_table.dietician")}
            </TableHead>
            <TableHead className="font-semibold">
              {t("dieticians_table.contact")}
            </TableHead>
            <TableHead className="font-semibold text-right">
              {t("dieticians_table.action")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dieticians.map((dietician, i) => {
            const { firstName, lastName, email } = dietician.account;
            const { id } = dietician.dietician;

            return (
              <motion.tr
                key={id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                className="group hover:bg-muted/50 transition-colors"
              >
                <TableCell className="w-[40%]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium leading-none">
                        {firstName} {lastName}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t("dieticians_table.dietician")}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="w-[35%]">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{email}</span>
                  </div>
                </TableCell>

                <TableCell className="text-right w-[25%]">
                  {hasAssignedDietician ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled
                      className="opacity-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t("dieticians_table.already_chosen")}
                    </Button>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          disabled={isButtonDisabled}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          {isLoadingStatus
                            ? t("dieticians_table.loading")
                            : t("dieticians_table.choose_dietician")}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            {t("dieticians_table.confirm")}
                          </AlertDialogTitle>
                          <AlertDialogDescription className="space-y-2">
                            <span className="block">
                              {t("dieticians_table.are_you_sure1")}{" "}
                              <strong>
                                {firstName} {lastName}
                              </strong>{" "}
                              {t("dieticians_table.are_you_sure2")}
                            </span>
                            <span className="block bg-muted p-3 rounded-lg">
                              <span className="flex items-center gap-2 mb-2">
                                <span className="block">
                                  <span className="font-medium text-sm block">
                                    {firstName} {lastName}
                                  </span>
                                  <span className="text-xs text-muted-foreground block">
                                    {email}
                                  </span>
                                </span>
                              </span>
                            </span>
                            <span className="block text-sm text-muted-foreground">
                              {t("dieticians_table.after_confirm")}
                            </span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t("dieticians_table.cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleAssign(id)}
                            disabled={assignDieticianMutation.isPending}
                            className="bg-primary hover:bg-primary/90"
                          >
                            {assignDieticianMutation.isPending
                              ? t("dieticians_table.assigning")
                              : t("dieticians_table.confirm")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DieticiansTable;
