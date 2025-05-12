import LoginForm from "@/components/LoginForm"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

const Login = () => {
    return (
        <div className="flex items-center justify-center w-screen min-h-screen">
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
                        <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium ml-1">
                            Sign up
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Login
