import { ArrowLeft, Salad } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center  p-4 text-center">
      <div className="rounded-full bg-green-100 p-6">
        <Salad className="h-16 w-16 text-primary" />
      </div>

      <h1 className="mt-8 text-4xl font-bold tracking-tight text-primary">
        Page not found
      </h1>

      <p className="mt-4 max-w-md text-lg text-gray-600">
        Oops! Looks like this page is missing from your meal plan.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4">
        <div className="text-sm text-gray-500">
          Error 404: The requested page could not be found
        </div>

        <Button asChild className="mt-2 gap-2 bg-primary hoveropacity-75">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home page
          </Link>
        </Button>  
      </div>
    </div>
  );
}
