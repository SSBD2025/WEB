import { Badge } from "@/components/ui/badge";
import { t } from "i18next";

export const getRoleBadges = (roles: string[]) => {
  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((role) => {
        let badgeClass = "";

        switch (role) {
          case "Admin":
            badgeClass =
              "bg-[hsl(204,30%,85%)] text-[hsl(242,5%,35%)] border-[hsl(242,30%,50%)]";
            break;
          case "Dietician":
            badgeClass =
              "bg-[hsl(-7,30%,85%)] text-[hsl(31,5%,35%)] border-[hsl(31,30%,50%)]";
            break;
          case "Client":
            badgeClass =
              "bg-[hsl(112,30%,85%)] text-[hsl(150,5%,35%)] border-[hsl(150,30%,50%)]";
            break;
          default:
            badgeClass = "bg-gray-50 text-gray-700 border-gray-200";
        }

        return (
          <Badge key={role} variant="outline" className={badgeClass}>
            {role}
          </Badge>
        );
      })}
    </div>
  );
};

export const getStatusBadge = ({
  active,
  verified,
}: {
  active: boolean;
  verified: boolean;
}) => {
  if (active && verified) {
    return (
      <Badge
        variant="outline"
        className="bg-emerald-50 text-emerald-700 border-emerald-200"
      >
        {t("accountsTable.badges.active")}
      </Badge>
    );
  }
  if (!active && verified) {
    return (
      <Badge
        variant="outline"
        className="bg-rose-50 text-rose-700 border-rose-200"
      >
        {t("accountsTable.badges.blocked")}
      </Badge>
    );
  }
  if (!verified) {
    return (
      <Badge
        variant="outline"
        className="bg-slate-50 text-slate-700 border-slate-200"
      >
        {t("accountsTable.badges.inactive")}
      </Badge>
    );
  }
};
