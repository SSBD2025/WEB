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