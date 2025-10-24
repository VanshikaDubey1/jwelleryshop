import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "../../shared/page-header";

export function MiniGallery() {
  const galleryImages = [
    PlaceHolderImages.find(img => img.id === 'gallery-album-1'),
    PlaceHolderImages.find(img => img.id === 'gallery-acrylic-1'),
    PlaceHolderImages.find(img => img.id === 'gallery-wallframe-1'),
    PlaceHolderImages.find(img => img.id === 'gallery-album-2'),
  ].filter(Boolean);

  return (
    <section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Our Masterpieces"
          subtitle="A Glimpse of Our Craft"
          description="We take pride in every piece we create. Here’s a small selection of our work that showcases the quality and artistry you can expect from Shreeji Photobooks."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {galleryImages.map((image, index) => image && (
            <div key={image.id} className="group relative overflow-hidden rounded-lg aspect-w-1 aspect-h-1">
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
                data-ai-hint={image.imageHint}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link href="/gallery">Explore Full Gallery</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
