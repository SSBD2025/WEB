import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import {useTranslation} from "react-i18next";

interface Props {
  page?: number | string;
  isNext: boolean;
  containerClasses?: string;
}

const formUrlQuery = ({
  params,
  key,
  value,
}: {
  params: URLSearchParams;
  key: string;
  value: string;
}) => {
  const newParams = new URLSearchParams(params);
  newParams.set(key, value);
  return `?${newParams.toString()}`;
};

const Pagination = ({ page = 1, isNext, containerClasses }: Props) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {t} = useTranslation();

  const handleNavigation = (direction: "prev" | "next") => {
    const currentPage = Number(page);
    const nextPageNumber =
      direction === "prev" ? currentPage - 1 : currentPage + 1;

    const newUrl = formUrlQuery({
      params: searchParams,
      key: "page",
      value: nextPageNumber.toString(),
    });

    navigate(newUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex w-full items-center justify-center gap-2 mt-5",
        containerClasses
      )}
    >
      {Number(page) > 1 && (
        <Button
          onClick={() => handleNavigation("prev")}
          variant="secondary"
          className="flex min-h-[36px] items-center justify-center gap-2 border"
        >
          <p>{t("pagination.previous")}</p>
        </Button>
      )}

      <div className="flex items-center justify-center rounded-md px-3.5 py-2 bg-primary text-primary-foreground">
        <p>{page}</p>
      </div>

      {isNext && (
        <Button
          onClick={() => handleNavigation("next")}
          variant="secondary"
          className="flex min-h-[36px] items-center justify-center gap-2 border"
        >
          <p>{t("pagination.next")}</p>
        </Button>
      )}
    </motion.div>
  );
};

export default Pagination;
