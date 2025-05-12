import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ROUTES from "@/constants/routes";
import React from "react";
import { useLocation } from "react-router";

const Footer = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter((part) => part);

  const breadcrumbItems = pathParts.map((part, index) => {
    const path = "/" + pathParts.slice(0, index + 1).join("/");
    return { label: decodeURIComponent(part), path };
  });

  const isHome = breadcrumbItems.length === 0;

  return (
    <footer className="w-full border-t bg-card">
      <div className="flex justify-between items-center md:max-w-7xl mx-auto max-w-5xl">
        <Breadcrumb>
          <BreadcrumbList>
            {isHome ? (
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink to={ROUTES.HOME}>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumbItems.map((item, index) => {
                  const isLast = index === breadcrumbItems.length - 1;
                  return (
                    <React.Fragment key={item.path}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>
                            {item.label.charAt(0).toUpperCase() +
                              item.label.slice(1)}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink to={item.path}>
                            {item.label.charAt(0).toUpperCase() +
                              item.label.slice(1)}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Bartosz Podemski. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
