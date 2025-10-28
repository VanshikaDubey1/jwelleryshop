
'use server';

import 'dotenv/config';
import { db, storage } from '@/lib/firebase';
import { BookingSchema, type Booking, OrderItemSchema } from '@/lib/types';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { z } from 'zod';

function generateOrderId() {
    const prefix = 'SHP';
    const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${prefix}-${timestamp}${random}`;
}

export async function submitBooking(prevState: any, formData: FormData) {
    
    // As we are receiving a mix of strings, files, and JSON strings, we parse them manually
    const rawData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        deliveryOption: formData.get('deliveryOption'),
        address: formData.get('address'),
        preferredDate: new Date(formData.get('preferredDate') as string),
        generalNotes: formData.get('generalNotes'),
        orderItems: JSON.parse(formData.get('orderItems') as string),
        photos: formData.getAll('photos'),
    };
    
    const validatedFields = BookingSchema.safeParse(rawData);
    
    if (!validatedFields.success) {
        console.error("Form Validation Failed:", validatedFields.error.flatten());
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
