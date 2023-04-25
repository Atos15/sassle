import Firebase from 'firebase-admin';
import account from './PRIVATE_firebase_private.json';
import { getFirestore } from 'firebase-admin/firestore';

export const adminFirebaseApp = Firebase.initializeApp({
    credential: Firebase.credential.cert(account as Firebase.ServiceAccount)
})

export const database = getFirestore(adminFirebaseApp);