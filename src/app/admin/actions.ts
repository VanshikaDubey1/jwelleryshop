'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function updateBookingStatus(bookingId: string, status: string) {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status });
    return { success: true };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { success: false, error: 'Failed to update status.' };
  }
}
