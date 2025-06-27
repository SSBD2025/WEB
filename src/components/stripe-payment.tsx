import { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Navigate } from "react-router";
import authClient from "@/lib/authClient";
import { Spinner } from "./ui/spinner";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const { t } = useTranslation();

    const fetchClientSecret = useCallback(async () => {
        try {
            const res = await authClient.post("/mod/payment/create-checkout-session");
            setClientSecret(res.data.clientSecret);
        } catch {
            toast.error(t("stripe.error"));
        }
    }, [t]);

    useEffect(() => {
        fetchClientSecret();
    }, [fetchClientSecret]);

    if (!clientSecret) {
        return (
            <div className="flex-grow flex justify-center items-center">
                <Spinner /> {t("common.loading")}
            </div>
        );
    }

    return (
        <div id="checkout" className="flex-grow">
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    );
};

const Return = () => {
  const [status, setStatus] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchSessionStatus = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get("session_id");

      const res = await authClient.get(`/mod/payment/session-status`, {
        params: { session_id: sessionId },
      });

      const data = res.data;

      setStatus(data.status);
    };

    fetchSessionStatus();
  }, []);

  if (status === "open") {
    return <Navigate to="/checkout" />;
  }

  if (status === "complete") {
    return (
      <section
        id="success"
        className="flex-grow flex items-center justify-center"
      >
        <p>{t("stripe.success")}</p>
      </section>
    );
  }

  return null;
};

export { CheckoutForm, Return };