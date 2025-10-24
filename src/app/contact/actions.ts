'use server';

import { db } from '@/lib/firebase';
import { ContactSchema } from '@/lib/types';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

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
