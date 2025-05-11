import {
  Apple,
  Brain,
  BriefcaseMedical,
  Utensils,
  Wheat,
} from "lucide-react";
import { GlowingEffect } from "@/components/aceternity/glowing-effect";
import { motion } from "motion/react";
import { forwardRef } from "react";

const GlowingEffectDemoSecond = forwardRef<HTMLElement, object>((_, ref) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 2.0 }}
      className="my-8"
      id="why"
      ref={ref}
    >
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-primary">
        Dlaczego warto?
      </h2>
      <ul className="grid grid-cols-1 grid-rows-none max-w-7xl mx-auto gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<Apple className="h-4 w-4" />}
          title="Spersonalizowana dieta, dopasowana do Ciebie"
          description="Twoje potrzeby są unikalne – Twój plan żywieniowy również. Dietetyk analizuje Twój tryb życia, cele i preferencje, by stworzyć jadłospis, który naprawdę działa."
        />

        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<BriefcaseMedical className="h-4 w-4" />}
          title="Poprawa wyników zdrowotnych"
          description="Cholesterol, cukier, ciśnienie – dzięki dobrze dobranej diecie możesz wspomóc organizm w walce z powszechnymi problemami zdrowotnymi."
        />

        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
          icon={<Utensils className="h-4 w-4" />}
          title="Naucz się jeść świadomie"
          description="Z pomocą dietetyka zrozumiesz, jak komponować posiłki, jak czytać etykiety i unikać żywieniowych pułapek."
        />

        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={<Wheat className="h-4 w-4" />}
          title="Dieta zgodna z Twoimi wartościami"
          description="Wege? Keto? Bezglutenowa? A może dieta przy Hashimoto? Dietetycy biorą pod uwagę Twoje potrzeby medyczne i światopoglądowe"
        />

        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
          icon={<Brain className="h-4 w-4" />}
          title="Lepsze samopoczucie i koncentracja"
          description="Odpowiednio dobrane składniki wpływają nie tylko na ciało, ale i na umysł. Poczuj różnicę już po kilku dniach zdrowego odżywiania."
        />
      </ul>
    </motion.section>
  );
})

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area} `}>
      <div className="relative bg-card h-full rounded-2xl border-2 border-primary/20 p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75  relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-primary/25 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance md:text-2xl/[1.875rem]">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-muted-foreground md:text-base/[1.375rem [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default GlowingEffectDemoSecond;