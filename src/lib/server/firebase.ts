import { FIREBASE_CONFIG } from '$env/static/private';
import Firebase from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

export const adminFirebaseApp = Firebase.initializeApp({
    credential: Firebase.credential.cert(JSON.parse(FIREBASE_CONFIG) as Firebase.ServiceAccount)
})

export const database = getFirestore(adminFirebaseApp);