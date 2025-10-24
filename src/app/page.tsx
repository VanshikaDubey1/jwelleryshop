import { Hero } from "@/components/sections/home/hero";
import { ServicesHighlight } from "@/components/sections/home/services-highlight";
import { MiniGallery } from "@/components/sections/home/mini-gallery";
import { Testimonials } from "@/components/sections/home/testimonials";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ServicesHighlight />
      <MiniGallery />
      <Testimonials />
    </div>
  );
}
