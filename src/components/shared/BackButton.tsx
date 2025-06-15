import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { t } from "i18next";

interface BackButtonProps {
    route: string;
    label?: string;
    className?: string;
}

export default function BackButton({ route, label, className }: BackButtonProps) {
    const navigate = useNavigate();
    return (
        <Button
            variant="ghost"
            className={`flex items-center gap-2 mb-4 ${className || ""}`}
            onClick={() => navigate(route)}
        >
            <ArrowLeft className="w-4 h-4" />
            {label || t("common.back")}
        </Button>
    );
}