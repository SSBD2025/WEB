import { confirmEmail, revertMail, verifyMail } from "@/api/redirect.api";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

const Redirect = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      if (!token || !type) {
        navigate("/")
        return;
      } 

      try {
        if (type === "confirm") {
          await confirmEmail(token);
        } else if (type === "revert") {
          await revertMail(token);
        } else if (type === "verify") {
          await verifyMail(token);
        }
      } catch (err) {
        console.log(err);
      } finally {
        navigate("/");
      }
    };

    handleRedirect();
  }, [token, type, navigate]);

  return <div className="flex-grow flex">Redirecting...</div>;
};

export default Redirect;
