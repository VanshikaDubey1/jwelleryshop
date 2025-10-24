import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { BUSINESS_INFO } from "@/lib/config";

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-1');

  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white p-0">
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
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 fade-in">
        <h1 className="text-4xl font-headline font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {BUSINESS_INFO.tagline}
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-lg text-neutral-200 sm:max-w-3xl">
          High-quality photo printing, custom albums, and stunning acrylics. We bring your cherished moments to life.
        </p>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/booking">Book Your Print Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
