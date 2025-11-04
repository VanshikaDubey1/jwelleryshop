import { PageHeader } from "@/components/shared/page-header";
import { TrackOrderClient } from "./_components/track-order-client";
import type { Metadata } from 'next';
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Check the status of your photo printing order with Shreeji Photobooks. Enter your Order ID to get real-time updates.',
};

function TrackOrderLoading() {
    return (
        <div className="flex items-center justify-center py-12 text-muted-foreground max-w-2xl mx-auto">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-4">Loading order tracking...</p>
        </div>
    )
}

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
                        <Suspense fallback={<TrackOrderLoading />}>
                            <TrackOrderClient />
                        </Suspense>
                    </div>
                </div>
            </section>
        </div>
    );
}
