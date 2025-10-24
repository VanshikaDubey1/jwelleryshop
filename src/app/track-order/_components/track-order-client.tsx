'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getBookingByOrderId } from '../actions';
import type { BookingDocument } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, PackageSearch, Search } from 'lucide-react';
import { BookingStatusBadge } from '@/components/shared/booking-status-badge';
import { format } from 'date-fns';

const formSchema = z.object({
  orderId: z.string().min(3, 'Please enter a valid Order ID.'),
});

type FormValues = z.infer<typeof formSchema>;

export function TrackOrderClient() {
  const [booking, setBooking] = useState<BookingDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderId: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setBooking(null);
    setError(null);
    const result = await getBookingByOrderId(data.orderId);
    if (result.data) {
      setBooking(result.data);
    } else {
      setError(result.error || 'Something went wrong.');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
          <CardDescription>Enter your Order ID below to see the current status of your booking.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="orderId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">Order ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SHP-..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="mt-0">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Track
              </Button>
            </form>
          </Form>

          <div className="mt-8">
            {isLoading && (
              <div className="text-center text-muted-foreground py-8">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                <p className="mt-2">Searching for your order...</p>
              </div>
            )}
            {error && (
              <div className="text-center text-destructive py-8">
                <p>{error}</p>
              </div>
            )}
            {!isLoading && !error && !booking && (
                <div className="text-center text-muted-foreground py-8">
                    <PackageSearch className="mx-auto h-12 w-12" />
                    <p className="mt-4">Your order status will be displayed here.</p>
                </div>
            )}
            {booking && (
              <Card className="bg-muted/30">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order #{booking.orderId}</CardTitle>
                      <CardDescription>Placed on {format(new Date(booking.createdAt), 'PPP')}</CardDescription>
                    </div>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">{booking.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{booking.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Method:</span>
                    <span className="font-medium">{booking.deliveryOption}</span>
                  </div>
                   <div className="flex justify-between">
                    <span className="text-muted-foreground">Preferred Date:</span>
                    <span className="font-medium">{format(new Date(booking.preferredDate), 'PPP')}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
