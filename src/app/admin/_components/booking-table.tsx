
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
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

export function BookingTable() {
  const [bookings, setBookings] = useState<BookingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

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

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
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
                    <p><strong>Date:</strong> {format(new Date(booking.preferredDate), 'PPP')}</p>
                    <p><strong>Delivery:</strong> {booking.deliveryOption}</p>
                </div>
                
                <Collapsible open={openItems[booking.id]} onOpenChange={() => toggleItem(booking.id)}>
                    <CollapsibleTrigger asChild>
                       <Button variant="ghost" className="w-full justify-start px-0">
                           {openItems[booking.id] ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                           View {booking.orderItems.length} Order Item(s)
                       </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 pl-4 pt-2 border-l-2 ml-2">
                        {booking.orderItems.map((item, index) => (
                           <div key={index} className="text-sm text-muted-foreground border-b pb-2">
                                <p><strong>Service:</strong> {item.service}</p>
                                <p><strong>Qty:</strong> {item.quantity}, <strong>Size:</strong> {item.size}, <strong>Variant:</strong> {item.variant}</p>
                                {item.frameColor && <p><strong>Frame:</strong> {item.frameColor}</p>}
                                {item.itemNotes && <p><strong>Notes:</strong> {item.itemNotes}</p>}
                           </div>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
                
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
              <TableHead>Order Items</TableHead>
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
                  <TableCell>
                     {booking.orderItems.map((item, index) => (
                           <div key={index} className="text-sm text-muted-foreground border-b last:border-b-0 py-1">
                                <p><strong>{item.service}</strong> (x{item.quantity})</p>
                                <p className="text-xs">{item.size} - {item.variant}</p>
                           </div>
                     ))}
                  </TableCell>
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
                      <p><strong>Method:</strong> {booking.deliveryOption}</p>
                       {booking.photoURLs && booking.photoURLs.length > 0 && <p><strong>Photos:</strong> {booking.photoURLs.length}</p>}
                       {booking.generalNotes && <p><strong>Notes:</strong> {booking.generalNotes}</p>}
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
