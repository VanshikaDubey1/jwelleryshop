import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { BUSINESS_INFO } from "@/lib/config";

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-2');

  return (
    <section className="relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white p-0">
      <div className="absolute inset-0 z-0">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 fade-in">
        <h1 className="text-4xl font-headline font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          {BUSINESS_INFO.tagline}
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-lg text-neutral-200 sm:max-w-3xl">
          High-quality printing for your most precious moments. From photo prints to luxury albums, we bring your memories to life.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/booking">Book Your Print</Link>
          </Button>
           <Button asChild size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white hover:text-black">
            <Link href="/services">View Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
