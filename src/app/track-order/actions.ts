'use server';

import 'dotenv/config';
import { db } from '@/lib/firebase';
import type { BookingDocument } from '@/lib/types';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

export async function getBookingByOrderId(orderId: string): Promise<{ data: BookingDocument | null; error?: string }> {
  if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
    return { data: null, error: 'Please provide a valid Order ID.' };
  }

  try {
    const q = query(
      collection(db, 'bookings'),
      where('orderId', '==', orderId.trim()),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { data: null, error: 'No order found with that ID.' };
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    const booking: BookingDocument = {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      preferredDate: data.preferredDate.toDate(),
    } as BookingDocument;

    return { data: booking };
  } catch (error) {
    console.error('Error fetching booking by Order ID:', error);
    return { data: null, error: 'An error occurred while fetching your order.' };
  }
}
