import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVICES } from "@/lib/config";
import { Camera, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "../../shared/page-header";

const ICONS = {
  "Photo Printing": <Camera className="h-10 w-10 text-primary" />,
  "Album Printing": <BookOpen className="h-10 w-10 text-primary" />,
  "Acrylic Printing": <Layers className="h-10 w-10 text-primary" />,
};

export function ServicesHighlight() {
  return (
    <section className="bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Our Services"
          subtitle="What We Offer"
          description="From single prints to luxurious albums, we provide a range of services to meet all your photo printing needs with unmatched quality."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {SERVICES.map((service) => (
            <Link href="/services" key={service.title} className="group">
              <Card className="h-full text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
                <CardHeader className="items-center">
                  {ICONS[service.title as keyof typeof ICONS]}
                  <CardTitle className="font-headline mt-4">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
