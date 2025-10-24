import { PageHeader } from "@/components/shared/page-header";
import { BUSINESS_INFO } from "@/lib/config";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn more about Shreeji Photobooks, our mission, and our team. Located at ${BUSINESS_INFO.address}.`,
};

export default function AboutPage() {
  const teamImage = PlaceHolderImages.find(img => img.id === 'about-team');

  return (
    <div className="fade-in">
      <section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="About Shreeji Photobooks"
            subtitle="Our Story"
            description="Founded with a passion for preserving memories, we are a local business dedicated to providing exceptional quality and service to the people of Kanpur."
          />
        </div>
      </section>

      <section className="pt-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                At Shreeji Photobooks, we believe that every photograph tells a story, and every memory deserves to be cherished. Our journey began with a simple idea: to transform digital images into tangible works of art that can be held, shared, and passed down through generations.
              </p>
              <p>
                Based in the heart of Kanpur, our small but dedicated team combines state-of-the-art printing technology with meticulous craftsmanship. We are committed to excellence, from the moment you place your order to the second you hold your finished product.
              </p>
              <p>
                We're more than just a print shop; we're storytellers, artists, and memory keepers. We are honored to be a part of your special moments.
              </p>
            </div>
            <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden shadow-lg">
              {teamImage && (
                <Image
                  src={teamImage.imageUrl}
                  alt={teamImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={teamImage.imageHint}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Find Us"
            subtitle="Our Location"
            description="Visit our shop on Shivala Road. We're open from 10 AM to 8 PM and would love to meet you!"
          />
          <div className="mt-12 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border shadow-lg">
            <iframe
              src={BUSINESS_INFO.googleMapsLink}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
