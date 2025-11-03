
import { PageHeader } from "@/components/shared/page-header";
import { ImageEditor } from "../_components/image-editor";
import { ACRYLIC_PRINTING_DETAILS, PHOTO_PRINTING_DETAILS } from "@/lib/config";
import type { Metadata } from 'next';
import { notFound } from "next/navigation";

type Props = {
    params: { service: string };
};

export function generateMetadata({ params }: Props): Metadata {
    const serviceName = params.service === 'acrylic' ? 'Acrylic Print' : 'Photo Print';

    return {
        title: `Customize Your ${serviceName}`,
        description: `Upload your photo, choose your options, and create a custom ${serviceName} with Shreeji Photobooks.`
    };
}


export default function CustomizePage({ params }: Props) {
    const { service } = params;

    if (service !== 'acrylic' && service !== 'photo') {
        notFound();
    }

    const isAcrylic = service === 'acrylic';
    const details = isAcrylic ? ACRYLIC_PRINTING_DETAILS : PHOTO_PRINTING_DETAILS;
    const title = isAcrylic ? "Customize Your Acrylic Print" : "Customize Your Photo Print";
    const description = isAcrylic 
        ? "Bring your photo to life with a stunning, modern acrylic print. Upload your image and choose your perfect size and frame."
        : "Get high-quality prints of your favorite moments. Upload your image, choose a size, and we'll handle the rest."


    return (
        <div className="fade-in">
            <section>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <PageHeader
                        title={title}
                        subtitle="Create Your Masterpiece"
                        description={description}
                    />

                    <div className="mt-12">
                        <ImageEditor 
                            serviceTitle={isAcrylic ? "Acrylic Printing" : "Photo Printing"}
                            details={details}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

