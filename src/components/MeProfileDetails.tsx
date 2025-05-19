import { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import ChangeDataForm from "./changeDataForm";
import ChangeEmailForm from "./changeEmailForm";
import ChangePasswordForm from "./changePasswordForm";
import { useTranslation } from "react-i18next";
import Change2fa from "./change2fa";

const MeProfileDetails = ({ user }: { user: User }) => {
  const { t } = useTranslation();

  return (
    <Card className="w-1/2 mx-auto shadow-xl h-4/5 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl mb-10">{t("profile.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dane" className="w-full">
          <div className="flex flex-row gap-6">
            <TabsList className="flex flex-col mr-5 gap-1 bg-muted p-2 rounded-xl w-1/6 h-full">
              <TabsTrigger
                value="dane"
                className="justify-start px-4 py-2 w-full"
              >
                {t("profile.tabs.details")}
              </TabsTrigger>
              <TabsTrigger
                value="changeData"
                className="justify-start px-4 py-2 w-full"
              >
                {t("profile.tabs.changeData")}
              </TabsTrigger>
              <TabsTrigger
                value="changeEmail"
                className="justify-start px-4 py-2 w-full"
              >
                {t("profile.tabs.changeEmail")}
              </TabsTrigger>
              <TabsTrigger
                value="changePassword"
                className="justify-start px-4 py-2 w-full"
              >
                {t("profile.tabs.changePassword")}
              </TabsTrigger>
              <TabsTrigger
                value="2fa"
                className="justify-start px-4 py-2 w-full"
              >
                {t("profile.tabs.2fa")}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 w-full">
              <TabsContent value="dane">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">
                        {t("profile.fields.firstName")}
                      </TableCell>
                      <TableCell>{user.account.firstName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        {t("profile.fields.lastName")}
                      </TableCell>
                      <TableCell>{user.account.lastName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        {t("profile.fields.login")}
                      </TableCell>
                      <TableCell>{user.account.login}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        {t("profile.fields.email")}
                      </TableCell>
                      <TableCell>{user.account.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        {t("profile.fields.verified")}
                      </TableCell>
                      <TableCell>
                        {user.account.verified
                          ? t("common.yes")
                          : t("common.no")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        {t("profile.fields.active")}
                      </TableCell>
                      <TableCell>
                        {user.account.active ? t("common.yes") : t("common.no")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        {t("profile.fields.2fa")}
                      </TableCell>
                      <TableCell>
                        {user.account.twoFactorAuth
                          ? t("common.yes")
                          : t("common.no")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        {t("profile.fields.last_sucessful_login_ip")}
                      </TableCell>
                      <TableCell>
                        {user.account.lastSuccessfulLoginIp
                          ? user.account.lastSuccessfulLoginIp
                          : "-"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        {t("profile.fields.last_sucessful_login_date")}
                      </TableCell>
                      <TableCell>
                        {user.account.lastSuccessfulLogin
                          ? new Date(
                              user.account.lastSuccessfulLogin
                            ).toLocaleString()
                          : "-"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        {t("profile.fields.last_failed_login_ip")}
                      </TableCell>
                      <TableCell>
                        {user.account.lastFailedLoginIp
                          ? user.account.lastFailedLoginIp
                          : "-"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        {t("profile.fields.last_failed_login_date")}
                      </TableCell>
                      <TableCell>
                        {user.account.lastFailedLogin
                          ? new Date(
                              user.account.lastFailedLogin
                            ).toLocaleString()
                          : "-"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="changeData">
                <ChangeDataForm
                  firstName={user.account.firstName}
                  lastName={user.account.lastName}
                  lockToken={user.lockToken}
                />
              </TabsContent>

              <TabsContent value="changeEmail">
                <ChangeEmailForm />
              </TabsContent>

              <TabsContent value="changePassword">
                <ChangePasswordForm />
              </TabsContent>
              <TabsContent value="2fa">
                <Change2fa status={user.account.twoFactorAuth} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MeProfileDetails;
