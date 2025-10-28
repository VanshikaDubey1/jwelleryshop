
import { PageHeader } from "@/components/shared/page-header";
import {
  ACRYLIC_PRINTING_DETAILS,
  PHOTO_ALBUM_DETAILS,
  PHOTO_PRINTING_DETAILS,
  SERVICES,
} from "@/lib/config";
import type { Metadata } from "next";
import { ServiceCard } from "./_components/service-card";
import { ServiceDetailsDialog } from "./_components/service-details-dialog";


export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore our services: high-quality photo printing, custom album printing, and stunning acrylic prints. Find the perfect way to preserve your memories.",
};

export default function ServicesPage() {
  const acrylicService = SERVICES.find(s => s.title === "Acrylic Printing");
  const photoService = SERVICES.find(s => s.title === "Photo Printing");
  const albumService = SERVICES.find(s => s.title === "Album Printing");


  return (
    <div className="fade-in bg-background">
      <section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Our Printing Services"
            subtitle="What We Do Best"
            description="We offer a curated selection of printing services, each executed with the highest standards of quality and attention to detail. Find the perfect fit for your memories."
          />

          <div className="mt-20 space-y-8">
            {acrylicService && (
              <ServiceCard 
                  title={acrylicService.title}
                  description={ACRYLIC_PRINTING_DETAILS.description}
                  image={acrylicService.image}
              >
                <ServiceDetailsDialog 
                  serviceTitle={acrylicService.title}
                  details={ACRYLIC_PRINTING_DETAILS}
                />
              </ServiceCard>
            )}

            {photoService && (
              <ServiceCard 
                  title={photoService.title}
                  description={PHOTO_PRINTING_DETAILS.description}
                  image={photoService.image}
              >
                 <ServiceDetailsDialog 
                  serviceTitle={photoService.title}
                  details={PHOTO_PRINTING_DETAILS}
                />
              </ServiceCard>
            )}
            
            {albumService && (
              <ServiceCard 
                  title={albumService.title}
                  description={PHOTO_ALBUM_DETAILS.description}
                  image={albumService.image}
              >
                <ServiceDetailsDialog 
                  serviceTitle={albumService.title}
                  details={PHOTO_ALBUM_DETAILS}
                />
              </ServiceCard>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
