import { PageHeader } from "@/components/shared/page-header";
import { BookingForm } from "./_components/booking-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Your Print',
  description: 'Place your order for high-quality photo prints, albums, or acrylics. Fast, easy, and reliable service from Shreeji Photobooks.',
};

export default function BookingPage() {
    return (
        <div className="fade-in">
             <section>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <PageHeader
                        title="Book Your Print Job"
                        subtitle="Let's Create Something Beautiful"
                        description="Fill out the form below to place your order. We'll get in touch with you to confirm the details and payment."
                    />
                    <div className="mt-12 max-w-5xl mx-auto">
                        <BookingForm />
                    </div>
                </div>
            </section>
        </div>
    );
}
