'use server';

import { z } from 'zod';
import { db, storage } from '@/lib/firebase';
import { BookingSchema, type Booking } from '@/lib/types';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

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
        
        await addDoc(collection(db, 'bookings'), {
            ...bookingData,
            orderId,
            photoURLs,
            status: 'Pending',
            createdAt: serverTimestamp(),
        });

        return { success: true, orderId: orderId, error: null };

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
    const url = "https://script.google.com/macros/s/AKfycbw8_Pk5p4kElvgQPq0EPAv0tdTZY6AvQIi3zW2Ax8RzEd6xDP2_YBGLqU7m-sv0LHv5/exec";
    try {
        await fetch(url, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: data.name,
            phone: data.phone,
            email: data.email,
            service: data.service,
            size: data.size,
            quantity: data.quantity,
            delivery: data.deliveryOption,
            address: data.address,
            preferredDate: data.preferredDate.toLocaleDateString(),
            note: data.notes
          }),
        });
        return { success: true, error: null };
    } catch (error) {
        console.error('Error sending to Google Sheet:', error);
        return { success: false, error: 'Could not send data to Google Sheet.' };
    }
}

    