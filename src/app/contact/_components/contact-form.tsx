
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactSchema, type ContactInquiry } from '@/lib/types';
import { useActionState, useEffect } from 'react';
import { submitContactForm } from '../actions';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

const initialState = {
  error: null,
  success: false,
};

export function ContactForm() {
    const [state, formAction] = useActionState(submitContactForm, initialState);
    const { toast } = useToast();

    const form = useForm<ContactInquiry>({
        resolver: zodResolver(ContactSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            message: '',
        },
    });

    useEffect(() => {
        if (state.success) {
            toast({
                title: 'Message Sent!',
                description: "Thank you for reaching out. We'll get back to you soon.",
            });
            form.reset();
        } else if (state.error) {
            toast({
                title: 'Error',
                description: state.error,
                variant: 'destructive',
            });
        }
    }, [state, form, toast]);

    const handleFormSubmit = async (data: ContactInquiry) => {
        // Prepare form data for server action
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('phone', data.phone);
        formData.append('email', data.email || '');
        formData.append('message', data.message);

        // Also trigger server action to save to Firestore
        formAction(formData);

        // Send email via EmailJS
        try {
            const templateParams = {
                from_name: data.name,
                from_email: data.email || 'Not provided',
                from_phone: data.phone,
                message: data.message,
            };

            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                templateParams,
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
            );
            // Success is handled by the useActionState effect
        } catch (error) {
            console.error('EmailJS Error:', error);
            toast({
                title: 'Email Sending Error',
                description: 'Could not send the email. Please try again.',
                variant: 'destructive',
            });
        }
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Phone" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Your Email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea placeholder="How can we help you?" {...field} rows={5} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="text-right">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                         {form.formState.isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-4 w-4" />
                        )}
                        Send Message
                    </Button>
                </div>
            </form>
        </Form>
    );
}
