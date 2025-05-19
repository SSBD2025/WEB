import { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import ChangeDataForm from "./changeDataForm";
import ChangeEmailForm from "./changeEmailForm";
import ChangePasswordForm from "./changePasswordForm";
import { useTranslation } from "react-i18next";
import Change2fa from "./change2fa";
import { motion } from "framer-motion";

const MeProfileDetails = ({ user }: { user: User }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="mx-auto shadow-xl rounded-2xl md:min-w-[750px] lg:min-w-[850px] md:min-h-[590px] m-4 md:m-0 lg:p-4">
        <CardHeader>
          <CardTitle className="text-xl md:mb-10">
            {t("profile.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dane" className="w-full">
            <div className="flex md:flex-row flex-col md:gap-6">
              <TabsList className="flex md:flex-col flex-row md:mr-5 md:gap-1 bg-muted md:p-2 rounded-xl h-full flex-wrap">
                <TabsTrigger
                  value="dane"
                  className="justify-start px-4 py-2 md:w-full cursor-pointer"
                >
                  {t("profile.tabs.details")}
                </TabsTrigger>
                <TabsTrigger
                  value="changeData"
                  className="justify-start px-4 py-2 md:w-full cursor-pointer"
                >
                  {t("profile.tabs.changeData")}
                </TabsTrigger>
                <TabsTrigger
                  value="changeEmail"
                  className="justify-start px-4 py-2 md:w-full cursor-pointer"
                >
                  {t("profile.tabs.changeEmail")}
                </TabsTrigger>
                <TabsTrigger
                  value="changePassword"
                  className="justify-start px-4 py-2 md:w-full cursor-pointer"
                >
                  {t("profile.tabs.changePassword")}
                </TabsTrigger>
                <TabsTrigger
                  value="2fa"
                  className="justify-start px-4 py-2 md:w-full md:break-words md:max-w-[140px] md:text-left md:whitespace-normal cursor-pointer"
                >
                  {t("profile.tabs.2fa")}
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 w-full">
                <TabsContent value="dane">
                  <Table className="min-w-[200px] text-sm sm:text-base overflow-x-auto">
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
                        <TableCell className="font-semibold break-words max-w-[200px]">
                          {t("profile.fields.active")}
                        </TableCell>
                        <TableCell>
                          {user.account.active
                            ? t("common.yes")
                            : t("common.no")}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          className="font-semibold max-w-[200px] break-words whitespace-normal leading-tight lg:max-w-none md:overflow-visible"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {t("profile.fields.2fa")}
                        </TableCell>
                        <TableCell>
                          {user.account.twoFactorAuth
                            ? t("common.yes")
                            : t("common.no")}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          className="font-semibold max-w-[200px] break-words whitespace-normal leading-tight lg:max-w-none md:overflow-visible"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {t("profile.fields.last_sucessful_login_ip")}
                        </TableCell>
                        <TableCell>
                          {user.account.lastSuccessfulLoginIp
                            ? user.account.lastSuccessfulLoginIp
                            : "-"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          className="font-semibold max-w-[200px] break-words whitespace-normal leading-tight lg:max-w-none lg:overflow-visible"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
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
                        <TableCell
                          className="font-semibold max-w-[200px] break-words whitespace-normal leading-tight lg:max-w-none lg:overflow-visible"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {t("profile.fields.last_failed_login_ip")}
                        </TableCell>
                        <TableCell>
                          {user.account.lastFailedLoginIp
                            ? user.account.lastFailedLoginIp
                            : "-"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          className="font-semibold max-w-[200px] break-words whitespace-normal leading-tight lg:max-w-none lg:overflow-visible"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
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
    </motion.div>
  );
};

export default MeProfileDetails;
