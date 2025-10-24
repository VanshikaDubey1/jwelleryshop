import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { SERVICES } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore our services: high-quality photo printing, custom album printing, and stunning acrylic prints. Find the perfect way to preserve your memories.',
};

export default function ServicesPage() {
  return (
    <div className="fade-in bg-background">
      <section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Our Printing Services"
            subtitle="What We Do Best"
            description="We offer a curated selection of printing services, each executed with the highest standards of quality and attention to detail. Find the perfect fit for your memories."
          />

          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <Card key={service.title} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group bg-card border-border">
                <div className="relative aspect-w-4 aspect-h-3">
                  <Image
                    src={service.image.imageUrl}
                    alt={service.image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={service.image.imageHint}
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <CardHeader>
                  <CardTitle className="font-headline relative">
                    {service.title}
                     <span className="absolute bottom-0 left-0 h-0.5 bg-primary w-16 transition-all duration-300 group-hover:w-24"></span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4">
                  <p className="font-semibold text-foreground text-lg">{service.priceRange}</p>
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-foreground hover:text-background">
                    <Link href="/booking">Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
