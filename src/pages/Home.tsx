import ClientDieticianComparison from "@/components/aceternity/comparison-cards";
import HeroSectionOne from "@/components/aceternity/hero-section-demo-1";
import GlowingEffectDemoSecond from "@/components/shared/GlowingEffect";
import { animate } from "motion/react";
import { useRef } from "react";

const Home = () => {
  const whyRef = useRef<HTMLElement | null>(null);

  const scrollToWhy = () => {
    if (!whyRef.current) return;

    const offsetTop = whyRef.current.offsetTop;

    animate(window.scrollY, offsetTop, {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (val) => window.scrollTo(0, val),
    });
  };

  return (
    <main>
      <HeroSectionOne onClick={scrollToWhy} />
      <ClientDieticianComparison />
      <GlowingEffectDemoSecond ref={whyRef} />
    </main>
  );
};

export default Home;
