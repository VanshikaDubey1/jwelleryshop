'use server';

import { z } from 'zod';
import { db, storage } from '@/lib/firebase';
import { BookingSchema } from '@/lib/types';
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

    // Manually handle file and date
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

        return { success: true, orderId: orderId };

    } catch (error) {
        console.error('Error submitting booking:', error);
        return {
            error: 'An unexpected error occurred. Please try again.',
        };
    }
}
