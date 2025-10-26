import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "./_components/contact-form";
import { BUSINESS_INFO } from "@/lib/config";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Shreeji Photobooks. Visit us, give us a call, or send a message. We are here to help with all your photo printing needs.',
};

const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="mr-2"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );

export default function ContactPage() {
    return (
        <div className="fade-in">
            <section>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <PageHeader
                        title="Get In Touch"
                        subtitle="Contact Us"
                        description="Have a question or a project in mind? We'd love to hear from you. Reach out through the form below, or visit us at our shop."
                    />

                    <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="bg-card p-8 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold font-headline mb-6">Send us a Message</h3>
                            <ContactForm />
                        </div>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold font-headline mb-4">Contact Information</h3>
                                <div className="space-y-4 text-muted-foreground">
                                    <div className="flex items-start">
                                        <MapPin className="h-5 w-5 mr-4 mt-1 shrink-0 text-primary" />
                                        <span>{BUSINESS_INFO.address}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="h-5 w-5 mr-4 shrink-0 text-primary" />
                                        <a href={`tel:${BUSINESS_INFO.contact}`} className="hover:text-primary transition-colors">{BUSINESS_INFO.contact}</a>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="h-5 w-5 mr-4 shrink-0 text-primary" />
                                        <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-primary transition-colors">{BUSINESS_INFO.email}</a>
                                    </div>
                                     <div className="flex items-center">
                                        <Clock className="h-5 w-5 mr-4 shrink-0 text-primary" />
                                        <span>{BUSINESS_INFO.workingHours}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                               <h3 className="text-2xl font-bold font-headline mb-4">Connect on WhatsApp</h3>
                               <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#25D366]/90 text-white w-full sm:w-auto">
                                    <Link href={BUSINESS_INFO.whatsappLink} target="_blank" rel="noopener noreferrer">
                                        <WhatsAppIcon />
                                        Chat with us
                                    </Link>
                               </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
