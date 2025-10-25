'use server';

import 'dotenv/config';
import { db, initializeFirebase } from '@/lib/firebase';
import { ContactSchema } from '@/lib/types';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

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

export async function submitContactForm(prevState: any, formData: FormData) {
    const validatedFields = ContactSchema.safeParse({
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        message: formData.get('message'),
    });

    if (!validatedFields.success) {
        return {
            error: 'Invalid form data. Please check your entries.',
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await addDoc(collection(db, 'messages'), {
            ...validatedFields.data,
            createdAt: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return {
            error: 'An unexpected error occurred. Please try again later.',
        };
    }
}
