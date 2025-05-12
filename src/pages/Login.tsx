import LoginForm from "@/components/LoginForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import ROUTES from "@/constants/routes";
import { Link } from "react-router";

const Login = () => {
  return (
    <div className="flex items-center justify-center w-full flex-grow">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold text-center">Sign In</h2>
          <p className="text-center text-muted-foreground">
            Log in to your account to start using the application
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <LoginForm />
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6">
          <p className="text-sm text-gray-600">
            Don’t have an account?
            <Link
              to={ROUTES.REGISTER}
              className="text-blue-600 hover:text-blue-800 font-medium ml-1"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
