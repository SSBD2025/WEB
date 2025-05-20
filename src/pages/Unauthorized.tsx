import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ROUTES from "@/constants/routes";
import { ArrowRight, Lock, Salad } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const Unauthorized = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-grow items-center justify-center p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Lock className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {t("unauthorized.cardTitle")}
          </CardTitle>
          <CardDescription>{t("unauthorized.cardDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-lg bg-muted p-4">
            <div className="mb-3 flex justify-center">
              <Salad className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              {t("unauthorized.paragraph")}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full bg-primary hover:opacity-75">
            <Link to={ROUTES.HOME}>
              {t("unauthorized.loginButton")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unauthorized;
