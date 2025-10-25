import { Hero } from "@/components/sections/home/hero";
import { ServicesHighlight } from "@/components/sections/home/services-highlight";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ServicesHighlight />
    </div>
  );
}
