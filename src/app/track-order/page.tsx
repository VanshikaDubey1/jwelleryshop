import { PageHeader } from "@/components/shared/page-header";
import { TrackOrderClient } from "./_components/track-order-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Check the status of your photo printing order with Shreeji Photobooks. Enter your Order ID to get real-time updates.',
};

export default function TrackOrderPage() {
    return (
        <div className="fade-in">
             <section>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <PageHeader
                        title="Order Status"
                        subtitle="Track Your Booking"
                        description="Want to know where your order is? Enter your Order ID below to get the latest updates on your print job."
                    />
                    <div className="mt-12">
                        <TrackOrderClient />
                    </div>
                </div>
            </section>
        </div>
    );
}
