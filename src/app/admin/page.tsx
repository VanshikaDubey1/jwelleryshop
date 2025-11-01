
import { PageHeader } from "@/components/shared/page-header";
import { BookingTable } from "./_components/booking-table";
import type { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageTable } from "./_components/message-table";
import { ListOrdered, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Manage bookings and messages for Shreeji Photobooks.',
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
                        description="View and manage all customer bookings and messages in real-time."
                    />
                     <div className="mt-12">
                        <Tabs defaultValue="bookings" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                                <TabsTrigger value="bookings">
                                    <ListOrdered className="mr-2" />
                                    Bookings
                                </TabsTrigger>
                                <TabsTrigger value="messages">
                                    <MessageSquare className="mr-2" />
                                    Messages
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="bookings" className="mt-6">
                                <BookingTable />
                            </TabsContent>
                            <TabsContent value="messages" className="mt-6">
                                <MessageTable />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </section>
        </div>
    );
}
