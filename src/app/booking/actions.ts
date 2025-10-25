'use server';

import 'dotenv/config';
import { z } from 'zod';
import { db, storage, initializeFirebase } from '@/lib/firebase';
import { BookingSchema, type Booking } from '@/lib/types';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

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

function generateOrderId() {
    const prefix = 'SHP';
    const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${prefix}-${timestamp}${random}`;
}

export async function submitBooking(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());

    const parsedData = {
        ...rawData,
        quantity: Number(rawData.quantity),
        preferredDate: new Date(rawData.preferredDate as string),
        photos: formData.getAll('photos'),
    }

    const validatedFields = BookingSchema.safeParse(parsedData);
    
    if (!validatedFields.success) {
        return {
            error: 'Invalid form data. Please check your entries.',
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { photos, ...bookingData } = validatedFields.data;
    const orderId = generateOrderId();

    try {
        const photoURLs: string[] = [];
        if (photos && photos.length > 0) {
            for (const file of photos) {
                if(file.size === 0) continue;
                const storageRef = ref(storage, `bookings/${orderId}/${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                photoURLs.push(url);
            }
        }
        
        const docRef = await addDoc(collection(db, 'bookings'), {
            ...bookingData,
            orderId,
            photoURLs,
            status: 'Pending',
            createdAt: serverTimestamp(),
        });

        return { success: true, orderId: orderId, error: null, bookingData: validatedFields.data };

    } catch (error) {
        console.error('Error submitting booking:', error);
        return {
            success: false,
            orderId: null,
            error: 'An unexpected error occurred. Please try again.',
        };
    }
}

export async function sendToGoogleSheet(data: Booking) {
    const scriptURL = "https://script.google.com/macros/s/AKfycbw8_Pk5p4kElvgQPq0EPAv0tdTZY6AvQIi3zW2Ax8RzEd6xDP2_YBGLqU7m-sv0LHv5/exec";
    
    const sheetData = {
        name: data.name,
        email: data.email || '',
        phone: data.phone,
        date: data.preferredDate.toLocaleDateString('en-IN'), // Format date for the sheet
        message: `Service: ${data.service}\nSize: ${data.size}\nQuantity: ${data.quantity}\nDelivery: ${data.deliveryOption}\nAddress: ${data.address || 'N/A'}\nNotes: ${data.notes || 'N/A'}`,
    };

    try {
        const response = await fetch(scriptURL, {
          method: "POST",
          body: JSON.stringify(sheetData),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            // Try to get more info from the response if it fails
            const errorText = await response.text();
            throw new Error(`Google Sheet request failed: ${response.statusText} - ${errorText}`);
        }

        return { success: true, error: null };
    } catch (error: any) {
        console.error('Error sending to Google Sheet:', error);
        return { success: false, error: error.message || 'Could not send data to Google Sheet.' };
    }
}
