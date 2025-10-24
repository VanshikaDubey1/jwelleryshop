import { PageHeader } from "@/components/shared/page-header";
import { GalleryClient } from "./_components/gallery-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Gallery',
    description: 'Browse our gallery of custom albums, stunning acrylic prints, and elegant wall frames. Get inspired for your next project.',
};

export default function GalleryPage() {
    return (
        <div className="fade-in">
            <section>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <PageHeader
                        title="Our Work, Your Inspiration"
                        subtitle="Gallery"
                        description="Explore a collection of our finest work. See how we transform precious moments into lasting treasures and find inspiration for your own photos."
                    />
                </div>
            </section>

            <section className="pt-0">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <GalleryClient />
                </div>
            </section>
        </div>
    );
}
