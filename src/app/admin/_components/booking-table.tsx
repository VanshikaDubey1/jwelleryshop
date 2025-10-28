'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BookingDocument } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { updateBookingStatus } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { BookingStatusBadge } from '@/components/shared/booking-status-badge';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function BookingTable() {
  const [bookings, setBookings] = useState<BookingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const bookingsData: BookingDocument[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          bookingsData.push({
            id: doc.id,
            ...data,
            // Convert Firestore Timestamps to JS Date objects
            createdAt: data.createdAt.toDate(),
            preferredDate: data.preferredDate.toDate(),
          } as BookingDocument);
        });
        setBookings(bookingsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching bookings:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch bookings.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    const result = await updateBookingStatus(bookingId, newStatus);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Booking status updated.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(
      (booking) =>
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bookings, searchTerm]);
  
  if (loading) {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Loading bookings...</p>
        </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <Input
          placeholder="Search by name or Order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      {/* Mobile View */}
      <div className="grid gap-4 md:hidden">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-4 grid gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold">{booking.name}</div>
                    <div className="text-sm text-muted-foreground">{booking.orderId}</div>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Service:</strong> {booking.service}</p>
                  <p><strong>Date:</strong> {format(new Date(booking.preferredDate), 'PPP')}</p>
                  <p><strong>Qty:</strong> {booking.quantity}, <strong>Size:</strong> {booking.size}</p>
                </div>
                <Select
                    defaultValue={booking.status}
                    onValueChange={(newStatus) =>
                      handleStatusChange(booking.id, newStatus)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Printing">Printing</SelectItem>
                      <SelectItem value="Ready">Ready</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No bookings found.
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="rounded-lg border hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.orderId}</TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.name}</div>
                    <div className="text-sm text-muted-foreground">{booking.phone}</div>
                  </TableCell>
                  <TableCell>{booking.service}</TableCell>
                   <TableCell>
                     {format(new Date(booking.preferredDate), 'PPP')}
                   </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={booking.status}
                      onValueChange={(newStatus) =>
                        handleStatusChange(booking.id, newStatus)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue>
                           <BookingStatusBadge status={booking.status} />
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Printing">Printing</SelectItem>
                        <SelectItem value="Ready">Ready</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className='text-sm'>
                      <p><strong>Qty:</strong> {booking.quantity}</p>
                      <p><strong>Size:</strong> {booking.size}</p>
                      <p><strong>Type:</strong> {booking.deliveryOption}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No bookings found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
