import { Route, Routes } from "react-router";
import {
  Home,
  Login,
  NotFound,
  ClientRegister,
  AdminRegister,
  DieticianRegister,
  AdminUserAccount,
  PasswordReset,
  NewPassword,
  AdminDashboard,
  ForceChangePasswordPage,
  CodeloginRequestPage,
  CodeloginPage,
  DieticianDashboard,
  ShowClientReports,
  ShowClientReportsByDietician,
  ClientDashboard,
  FoodPyramidsList,
  ClientPyramidsPage,
  DieticianClientPyramidsPage,
  DieticianMedicalChartsPage,
  ClientMedicalChartsPage,
  DieticianClientInsertBloodTestReportPage,
  ClientPeriodicSurveyListPage,
  DieticianPeriodicSurveyListPage,
  FoodPyramidDetails,
  DieticianOrderMedicalExaminations,
  PermanentSurveyPage,
  DieticianViewAllBloodOrdersPage,
  CreateDietProfilePage,
} from "./pages";
import { Toaster } from "./components/ui/sonner";
import ROUTES from "./constants/routes";
import { ThemeWrapper } from "./components/shared/ThemeWrapper";
import { useCurrentUser } from "./hooks/useCurrentUser";
import MeProfile from "./pages/MeProfile";
import Footer from "./components/shared/Footer";
import useRole from "./store";
import { useEffect } from "react";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import GuestRoute from "./components/shared/GuestRole";
import { Navbar } from "./components/shared/Navbar";
import Redirect from "./pages/Redirect";
import { AccessLevel } from "./types/user";
import { useTheme } from "./hooks/useTheme.ts";
import { SessionTimeout } from "./components/sessionTimeout";
import DieticianPermanentSurvey from "./pages/DieticianPermanentSurvey.tsx";
import { CheckoutForm, Return } from "./components/stripe-payment.tsx";

const Layout = () => {
  const { data: user } = useCurrentUser();
  const { currentRole, setCurrentRole } = useRole();
  const { userTheme, toggleTheme } = useTheme();

  const handleToggleTheme = () => {
    toggleTheme();
  };

  useEffect(() => {
    if (!user?.roles?.length) return;

    const firstRoleName = user.roles[0].roleName.toLowerCase() as AccessLevel;

    const roleNames = user.roles.map((r) =>
        r.roleName.toLowerCase()
    ) as AccessLevel[];

    const currentIsValid = currentRole && roleNames.includes(currentRole);

    if (!currentIsValid) {
      setCurrentRole(firstRoleName);
    }
  }, [user, currentRole, setCurrentRole]);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    localStorage.setItem("timezone", tz);
  }, []);

  return (
      <div className="min-h-screen flex flex-col relative">
        <ThemeWrapper role={currentRole || "client"} prefersDark={userTheme}>
          <Navbar onToggleTheme={handleToggleTheme} userTheme={userTheme} />
          <Routes>
            <Route path={ROUTES.REDIRECT} element={<Redirect />} />
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.PASSWORD_RESET} element={<PasswordReset />} />
            <Route path={ROUTES.NEW_PASSWORD} element={<NewPassword />} />
            <Route element={<GuestRoute />}>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.USER_REGISTER} element={<ClientRegister />} />
              <Route
                  path={ROUTES.FORCE_CHANGE_PASSWORD}
                  element={<ForceChangePasswordPage />}
              />
              <Route path={ROUTES.CODELOGIN} element={<CodeloginPage />} />
              <Route
                  path={ROUTES.CODELOGIN_REQUEST}
                  element={<CodeloginRequestPage />}
              />
              <Route
                  path={ROUTES.DIETICIAN_REGISTER}
                  element={<DieticianRegister />}
              />
            </Route>
            <Route
                element={
                  <ProtectedRoute allowedRoles={["client", "dietician", "admin"]} />
                }
            >
              <Route path={ROUTES.ME} element={<MeProfile />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
              <Route
                  path={ROUTES.CLIENT_BLOOD_REPORT}
                  element={<ShowClientReports />}
              />
              <Route
                  path={ROUTES.CLIENT_PERIODIC_SURVEY_LIST}
                  element={<ClientPeriodicSurveyListPage />}
              />
            </Route>
            <Route
                path={ROUTES.CLIENT_PERMANENT_SURVEY}
                element={<PermanentSurveyPage />}
            />
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route
                  path={ROUTES.ADMIN_USER_DETAILS}
                  element={<AdminUserAccount />}
              />
              <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
              <Route path={ROUTES.ADMIN_REGISTER} element={<AdminRegister />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["dietician"]} />}>
              <Route
                  path={ROUTES.DIETICIAN_DASHBOARD}
                  element={<DieticianDashboard />}
              />
              <Route
                  path={ROUTES.DIETICIAN_BLOOD_REPORT}
                  element={<ShowClientReportsByDietician />}
              />
              <Route path={ROUTES.FOOD_PYRAMIDS} element={<FoodPyramidsList />} />
              <Route
                  path={ROUTES.FOOD_PYRAMID_DETAILS}
                  element={<FoodPyramidDetails />}
              />
              <Route
                  path={ROUTES.DIETICIAN_CLIENT_PYRAMIDS}
                  element={<DieticianClientPyramidsPage />}
              />
              <Route
                  path={ROUTES.DIETICIAN_INSERT_BLOOD_TEST_REPORT}
                  element={<DieticianClientInsertBloodTestReportPage />}
              />
              <Route
                  path={ROUTES.DIETICIAN_PERIODIC_SURVEY_LIST}
                  element={<DieticianPeriodicSurveyListPage />}
              />
              <Route
                  path={ROUTES.DIETICIAN_MEDICAL_CHARTS}
                  element={<DieticianMedicalChartsPage />}
              />
              <Route
                  path={ROUTES.DIETICIAN_ORDER_MEDICAL_EXAMINATIONS}
                  element={<DieticianOrderMedicalExaminations />}
              />
              <Route
                  path={ROUTES.DIETICIAN_CREATE_DIET_PROFILE}
                  element={<CreateDietProfilePage />}
              />
            </Route>
            <Route
                path={ROUTES.DIETICIAN_PERMANENT_SURVEY}
                element={<DieticianPermanentSurvey />}
            />
            <Route
                path={ROUTES.DIETICIAN_MEDICAL_EXAMINATIONS_LIST}
                element={<DieticianViewAllBloodOrdersPage />}
            />
            <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
              <Route
                  path={ROUTES.CLIENT_DASHBOARD}
                  element={<ClientDashboard />}
              />
              <Route
                  path={ROUTES.CLIENT_ALL_PYRAMIDS}
                  element={<ClientPyramidsPage />}
              />
              <Route
                  path={ROUTES.CLIENT_MEDICAL_CHARTS}
                  element={<ClientMedicalChartsPage />}
              />
            </Route>
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/return" element={<Return />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <SessionTimeout />
          <Footer />
        </ThemeWrapper>
        <Toaster />
      </div>
  );
};

export default Layout;