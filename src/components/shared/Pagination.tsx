import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Props {
  page?: number | string;
  links?: {
    first?: { href: string };
    self: { href: string };
    next?: { href: string };
    last?: { href: string };
    prev?: { href: string };
  };
  pageInfo?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
  containerClasses?: string;
}

const extractPageFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("page") || "0";
  } catch {
    const match = url.match(/[?&]page=(\d+)/);
    return match ? match[1] : "0";
  }
};

const Pagination = ({ page = 1, links, pageInfo, containerClasses }: Props) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = (direction: "prev" | "next" | "first" | "last") => {
    let targetUrl: string | undefined;

    switch (direction) {
      case "prev":
        targetUrl = links?.prev?.href;
        break;
      case "next":
        targetUrl = links?.next?.href;
        break;
      case "first":
        targetUrl = links?.first?.href;
        break;
      case "last":
        targetUrl = links?.last?.href;
        break;
    }

    if (targetUrl) {
      const pageNumber = extractPageFromUrl(targetUrl);
      const uiPageNumber = (parseInt(pageNumber) + 1).toString();

      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", uiPageNumber);

      navigate(`?${newParams.toString()}`);
    }
  };

  const currentPage = Number(page);
  const hasPrev = !!links?.prev || (pageInfo && pageInfo.number > 0);
  const hasNext = !!links?.next || (pageInfo && pageInfo.number < pageInfo.totalPages - 1);

  return (
      <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.4, ease: "easeOut"}}
          className={cn(
              "flex w-full items-center justify-center gap-2 mt-5",
              containerClasses
          )}
      >
        {links?.first && currentPage > 1 && (
            <Button
                onClick={() => handleNavigation("first")}
                variant="outline"
                size="sm"
                className="flex min-h-[36px] items-center justify-center gap-2"
            >
              <p>{t("pagination.first")}</p>
            </Button>
        )}

        {hasPrev && (
            <Button
                onClick={() => handleNavigation("prev")}
                variant="secondary"
                className="flex min-h-[36px] items-center justify-center gap-2 border"
            >
              <p>{t("pagination.previous")}</p>
            </Button>
        )}

        <div
            className="rounded-md px-3.5 py-2 bg-primary text-primary-foreground text-sm leading-none font-medium font-mono">
          {pageInfo ? `${currentPage}/${pageInfo.totalPages}` : currentPage}
        </div>


        {hasNext && (
            <Button
                onClick={() => handleNavigation("next")}
                variant="secondary"
                className="flex min-h-[36px] items-center justify-center gap-2 border"
            >
              <p>{t("pagination.next")}</p>
            </Button>
        )}

        {links?.last && pageInfo && currentPage < pageInfo.totalPages && (
            <Button
                onClick={() => handleNavigation("last")}
                variant="outline"
                size="sm"
                className="flex min-h-[36px] items-center justify-center gap-2"
            >
              <p>{t("pagination.last")}</p>
            </Button>
        )}
      </motion.div>
  );
};

export default Pagination;