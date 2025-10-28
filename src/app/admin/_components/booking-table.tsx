
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
import { ChevronDown, ChevronRight, Download, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

  const renderPhotoLinks = (photoURLs: string[]) => {
    if (!photoURLs || photoURLs.length === 0) {
      return <p className="text-xs text-muted-foreground">No photos uploaded.</p>;
    }
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium">{photoURLs.length} photo(s) uploaded:</p>
        <div className="flex flex-wrap gap-2">
          {photoURLs.map((url, index) => (
            <Button asChild key={index} size="sm" variant="outline">
              <Link href={url} target="_blank" download>
                <Download className="mr-2 h-3 w-3" />
                Photo {index + 1}
              </Link>
            </Button>
          ))}
        </div>
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
                    <p><strong>Date:</strong> {format(new Date(booking.preferredDate), 'PPP')}</p>
                    <p><strong>Delivery:</strong> {booking.deliveryOption}</p>
                </div>
                
                <Collapsible open={openItems[booking.id]} onOpenChange={() => toggleItem(booking.id)}>
                    <CollapsibleTrigger asChild>
                       <Button variant="ghost" className="w-full justify-start px-0">
                           {openItems[booking.id] ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                           Details & Photos
                       </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 pl-4 pt-2 border-l-2 ml-2">
                        <div>
                          <p className="font-semibold text-xs uppercase text-muted-foreground mb-1">Order Items</p>
                           {booking.orderItems.map((item, index) => (
                              <div key={index} className="text-sm text-muted-foreground border-b last:border-b-0 py-2">
                                  <p><strong>Service:</strong> {item.service}</p>
                                  <p><strong>Qty:</strong> {item.quantity}, <strong>Size:</strong> {item.size}, <strong>Variant:</strong> {item.variant}</p>
                                  {item.frameColor && <p><strong>Frame:</strong> {item.frameColor}</p>}
                                  {item.itemNotes && <p><strong>Notes:</strong> {item.itemNotes}</p>}
                              </div>
                           ))}
                        </div>
                        <div>
                           <p className="font-semibold text-xs uppercase text-muted-foreground mb-2">Uploaded Photos</p>
                          {renderPhotoLinks(booking.photoURLs)}
                        </div>
                         {booking.generalNotes && (
                            <div>
                                <p className="font-semibold text-xs uppercase text-muted-foreground mb-1">General Notes</p>
                                <p className="text-sm text-muted-foreground">{booking.generalNotes}</p>
                            </div>
                        )}
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
              <TableHead className='w-[100px]'></TableHead>
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
                  <Collapsible asChild key={booking.id} open={openItems[booking.id]}>
                    <>
                      <TableRow className='cursor-pointer' onClick={() => toggleItem(booking.id)}>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            {openItems[booking.id] ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
                            <span className='sr-only'>Toggle Details</span>
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{booking.orderId}</TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.name}</div>
                          <div className="text-sm text-muted-foreground">{booking.phone}</div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground">{booking.orderItems.length} item(s)</p>
                        </TableCell>
                        <TableCell>
                          {format(new Date(booking.preferredDate), 'PPP')}
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={booking.status}
                            onValueChange={(newStatus) => handleStatusChange(booking.id, newStatus) }
                            onClick={(e) => e.stopPropagation()} // Prevent row click
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
                           <p><strong>Method:</strong> {booking.deliveryOption}</p>
                        </TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                        <TableRow>
                            <TableCell colSpan={7} className='p-0'>
                                <div className='p-4 bg-muted/50 grid grid-cols-3 gap-4'>
                                    <div className='col-span-1 space-y-2'>
                                      <h4 className='font-semibold'>Order Items</h4>
                                       {booking.orderItems.map((item, index) => (
                                          <div key={index} className="text-sm text-muted-foreground border-b last:border-b-0 pb-2">
                                              <p><strong>{item.service}</strong> (x{item.quantity})</p>
                                              <p className="text-xs">{item.size} - {item.variant}</p>
                                               {item.frameColor && <p className='text-xs'><strong>Frame:</strong> {item.frameColor}</p>}
                                               {item.itemNotes && <p className='text-xs'><strong>Notes:</strong> {item.itemNotes}</p>}
                                          </div>
                                      ))}
                                    </div>
                                    <div className='col-span-2 space-y-2'>
                                        <h4 className='font-semibold'>Uploaded Photos</h4>
                                        {renderPhotoLinks(booking.photoURLs)}

                                        {booking.generalNotes && (
                                          <div className='pt-4'>
                                              <h4 className='font-semibold'>General Notes</h4>
                                              <p className="text-sm text-muted-foreground">{booking.generalNotes}</p>
                                          </div>
                                      )}
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </>
                </Collapsible>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
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
