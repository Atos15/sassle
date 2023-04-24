import {credential, initializeApp, type ServiceAccount} from 'firebase-admin';
import account from './PRIVATE_firebase_private.json';
import { getFirestore } from 'firebase-admin/firestore';

export const adminFirebaseApp = initializeApp({
    credential: credential.cert(account as ServiceAccount)
})

export const database = getFirestore(adminFirebaseApp);