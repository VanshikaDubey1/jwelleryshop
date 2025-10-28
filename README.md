# Shreeji Photobooks

This is a Next.js application for "Shreeji Photobooks", a local photo printing shop in Kanpur. The website allows customers to browse services, view a gallery of work, book printing services, and contact the shop. It includes an admin dashboard for managing orders.

The project is built with Next.js, TypeScript, Tailwind CSS, ShadCN UI, and Firebase.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

### Environment Variables

You need to set up your environment variables for Firebase and EmailJS. Create a `.env.local` file in the root of your project and copy the contents of `.env.example`.

Fill in the values from your Firebase project settings and your EmailJS account.

```
# .env.local

# Firebase Project Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-public-key

# Admin User Email
ADMIN_EMAIL=your-admin-email@example.com
```

## Firebase Setup

This project uses Firebase for its backend services:
- **Firestore:** For storing booking orders and contact messages.
- **Firebase Storage:** For storing user-uploaded photos for their orders.
- **Firebase Authentication:** For securing the admin dashboard.
- **Firebase Hosting:** For deploying the website.

### Firestore Security Rules

To secure your data, you must configure Firestore security rules. Go to your Firebase project -> Firestore Database -> Rules.

Here is a recommended set of rules to get started. These rules:
- Allow anyone to create bookings and messages.
- Allow only an authenticated admin user (specified by `ADMIN_EMAIL` in your environment) to read, update, or delete bookings and messages.
- Allow public read access to a `gallery` collection if you choose to use it.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAdmin() {
      return request.auth.token.email == get(/databases/$(database)/documents/config/admin).data.email;
    }

    match /bookings/{bookingId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && isAdmin();
      
      // For order tracking page
      allow get: if true; 
    }

    match /messages/{messageId} {
      allow create: if true;
      allow read, write: if request.auth != null && isAdmin();
    }
    
    // You'll need to create a `config` collection and an `admin` document
    // with a field `email` containing your admin email address.
    match /config/admin {
    	allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }
  }
}
```
**Important**: To make the `isAdmin()` function work, you need to create a collection named `config` with a document named `admin`. This document should have one field: `email`, with its value set to your admin email address.

### Firebase Storage Rules

To secure file uploads, configure Firebase Storage rules. Go to your Firebase project -> Storage -> Rules.

These rules allow anyone to read, but only allow writes for files smaller than 5MB and of image types. You should restrict writes to be associated with a booking ID for better security in a production environment.

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /bookings/{bookingId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth == null // Allow unauthenticated uploads for new bookings
                  && request.resource.size < 5 * 1024 * 1024
                  && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Deployment & Custom Domain

This project is configured for deployment on Firebase App Hosting.

### Deployment

To deploy your site, you can connect your GitHub repository to your Firebase project for continuous deployment.

Alternatively, you can deploy manually using the Firebase CLI:
1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in your project (if not already done): `firebase init`
4. Deploy: `firebase deploy --only hosting`

### Linking a Custom Domain

1. Go to your Firebase project's **Hosting** page.
2. Click on **"Add custom domain"**.
3. Follow the instructions to verify domain ownership and update your DNS records. Firebase will provide you with the necessary A, AAAA, or CNAME records to add to your domain registrar's DNS settings.
4. Wait for the DNS changes to propagate and for Firebase to provision an SSL certificate. This can take a few hours.

Once complete, your website will be live at your custom domain.
