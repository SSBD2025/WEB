import type React from "react";

import {
  Apple,
  Calendar,
  LineChartIcon as ChartLine,
  ClipboardList,
  MessageSquare,
  Users,
  Utensils,
  FileText,
  Bell,
  BarChart,
  UserCog,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { motion } from "motion/react";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router";
import ROUTES from "@/constants/routes.ts";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-medium leading-none">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function ClientDieticianComparison() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
      className="max-w-7xl mx-auto py-8"
    >
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-primary">
        Co może klient, a co dietetyk?
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Client Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <Card className="overflow-hidden border-2 border-primary/20 transition-all hover:shadow-md">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-center text-2xl">Klient</CardTitle>
              <CardDescription className="text-center">
                Dla osób poszukujących wskazówek żywieniowych i planowania
                posiłków
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 p-6">
              <FeatureItem
                icon={<Apple className="h-5 w-5" />}
                title="Wypełnianie ankiet zdrowotnych"
                description="Podaj swoje parametry i nawyki, by otrzymać spersonalizowaną dietę"
              />
              <FeatureItem
                icon={<ChartLine className="h-5 w-5" />}
                title="Podgląd postępów i statystyk"
                description="Obserwuj zmiany w swojej wadze, składzie ciała i efektach diety"
              />
              <FeatureItem
                icon={<Calendar className="h-5 w-5" />}
                title="Ocena otrzymanego profilu dietetycznego"
                description="Wyraź swoją opinię o diecie i pomóż ją doskonalić"
              />
              <FeatureItem
                icon={<MessageSquare className="h-5 w-5" />}
                title="Dostęp do przypisanych planów dietetycznych"
                description="Korzystaj z profili dietetycznych przygotowanych specjalnie dla Ciebie"
              />
              <FeatureItem
                icon={<ClipboardList className="h-5 w-5" />}
                title="Podgląd wyników badań"
                description="Sprawdź, co mówią Twoje wyniki i jakie mają znaczenie dla diety"
              />
              <FeatureItem
                icon={<Bell className="h-5 w-5" />}
                title="Otrzymywanie przypomnień"
                description="Nie zapomnij o badaniach i kolejnych ankietach"
              />
              <Link to={ROUTES.USER_REGISTER} className="w-full block">
                <Button className="w-full cursor-pointer transform rounded-lg px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-75 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  Zostań klientem
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
        {/* Dietician Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          <Card className="overflow-hidden border-2 border-primary/20 transition-all hover:shadow-md">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-center text-2xl">Dietetyk</CardTitle>
              <CardDescription className="text-center">
                Dla specjalistów ds. żywienia zarządzających klientami i
                udzielających wskazówek
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 p-6">
              <FeatureItem
                icon={<Users className="h-5 w-5" />}
                title="Zarządzanie listą klientów"
                description="Przeglądaj, filtruj i wybieraj osoby, z którymi współpracujesz"
              />
              <FeatureItem
                icon={<Utensils className="h-5 w-5" />}
                title="Analiza ankiet i parametrów"
                description="Oceniaj odpowiedzi klientów i buduj ich profil żywieniowy"
              />
              <FeatureItem
                icon={<BarChart className="h-5 w-5" />}
                title="Tworzenie i przypisywanie profili dietetycznych"
                description="Projektuj indywidualne plany dostosowane do potrzeb klientów"
              />
              <FeatureItem
                icon={<FileText className="h-5 w-5" />}
                title="Zlecanie i analizowanie badań"
                description="Pomagaj klientom zrozumieć ich wyniki i wdrażaj odpowiednie zmiany"
              />
              <FeatureItem
                icon={<Calendar className="h-5 w-5" />}
                title="Przegląd opinii klientów"
                description="Zbieraj informacje zwrotne i ulepszaj swoje podejście"
              />
              <FeatureItem
                icon={<UserCog className="h-5 w-5" />}
                title="Wysyłanie przypomnień"
                description="Zachęcaj klientów do regularnych pomiarów i aktualizacji"
              />
              <Link to={ROUTES.DIETICIAN_REGISTER} className="w-full block">
                <Button className="w-full cursor-pointer transform rounded-lg px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-75 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  Zostań dietetykiem
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
