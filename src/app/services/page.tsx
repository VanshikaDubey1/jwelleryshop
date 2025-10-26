import { PageHeader } from "@/components/shared/page-header";
import {
  ACRYLIC_PRINTING_DETAILS,
  PHOTO_ALBUM_DETAILS,
  PHOTO_PRINTING_DETAILS,
  SERVICES,
} from "@/lib/config";
import type { Metadata } from "next";
import { ServiceCard } from "./_components/service-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

          <div className="mt-20 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-12">
            {/* Acrylic Printing */}
            {acrylicService && (
                <ServiceCard 
                    title={acrylicService.title}
                    description={ACRYLIC_PRINTING_DETAILS.description}
                    image={acrylicService.image}
                >
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Size</TableHead>
                                <TableHead className="text-right">Price (3mm)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ACRYLIC_PRINTING_DETAILS.options.sizes.map(s => (
                                <TableRow key={s.size}>
                                    <TableCell>{s.size}</TableCell>
                                    <TableCell className="text-right">₹{s.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     <div className="text-sm text-muted-foreground mt-4 space-y-2">
                        <p><strong>Thickness Option:</strong> Price doubles for 8mm thickness.</p>
                        <div className="flex items-center gap-2 flex-wrap"><strong>Frame Colors:</strong> 
                            {ACRYLIC_PRINTING_DETAILS.options.frameColors.map(color => (
                                <Badge key={color} variant="secondary">{color}</Badge>
                            ))}
                        </div>
                    </div>
                </ServiceCard>
            )}

            {/* Photo Printing */}
            {photoService && (
                <ServiceCard 
                    title={photoService.title}
                    description={PHOTO_PRINTING_DETAILS.description}
                    image={photoService.image}
                >
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Label</TableHead>
                                <TableHead>Dimensions</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead className="text-right">Price Range</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {PHOTO_PRINTING_DETAILS.options.sizes.map(s => (
                                <TableRow key={s.label}>
                                    <TableCell className="font-medium">{s.label}</TableCell>
                                    <TableCell>{s.dimensions}</TableCell>
                                    <TableCell className="text-muted-foreground">{s.notes}</TableCell>
                                    <TableCell className="text-right">₹{s.priceRange}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ServiceCard>
            )}
            
            {/* Album Printing */}
            {albumService && (
                <ServiceCard 
                    title={albumService.title}
                    description={PHOTO_ALBUM_DETAILS.description}
                    image={albumService.image}
                >
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Album Type</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead className="text-right">Starting Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {PHOTO_ALBUM_DETAILS.options.albums.map(a => (
                                <TableRow key={a.type}>
                                    <TableCell className="font-medium">{a.type}</TableCell>
                                    <TableCell>{a.size}</TableCell>
                                    <TableCell className="text-right">{typeof a.price === 'number' ? `₹${a.price}` : a.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="text-sm text-muted-foreground mt-4">
                        <p>Samples available in-store. Visit us to see the quality and finish.</p>
                    </div>
                </ServiceCard>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
