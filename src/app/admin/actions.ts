'use server';

import 'dotenv/config';
import { db, initializeFirebase } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

// Ensure Firebase is initialized with server-side config
initializeFirebase({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
});

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
