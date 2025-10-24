import { PageHeader } from "@/components/shared/page-header";
import { BookingTable } from "./_components/booking-table";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Manage bookings for Shreeji Photobooks.',
    robots: {
        index: false,
        follow: false,
    }
};

export default function AdminPage() {
    return (
        <div className="fade-in">
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <PageHeader 
                        title="Admin Dashboard"
                        subtitle="Welcome Back"
                        description="View and manage all customer bookings in real-time."
                    />
                     <div className="mt-12">
                        <BookingTable />
                    </div>
                </div>
            </section>
        </div>
    );
}
