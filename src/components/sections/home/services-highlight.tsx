import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVICES_HOME } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "../../shared/page-header";

export function ServicesHighlight() {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Our Services"
          subtitle="What We Offer"
          description="From simple prints to elaborate albums, we provide a range of services to meet your needs."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES_HOME.map((service) => (
             <Card key={service.title} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group bg-card border-border">
                <div className="relative aspect-w-4 aspect-h-3">
                  <Image
                    src={service.image.imageUrl}
                    alt={service.image.description}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={service.image.imageHint}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline relative text-xl">
                    {service.title}
                  </CardTitle>
                   <CardDescription>{service.specs}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                   <p className="font-semibold text-lg text-primary">{service.priceRange}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Link href="/booking">Order Now</Link>
                  </Button>
                </CardFooter>
              </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
            <Button asChild>
                <Link href="/services">View All Services</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
