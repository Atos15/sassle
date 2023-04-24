// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInAnonymously, signInWithRedirect, type Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { user, type LoggedUser } from "./auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;


export async function init() {
    const firebaseConfig = {
        apiKey: "AIzaSyCuJqUwGeDcHNNSiKK5iubfjcUgJYcMFNI",
        authDomain: "sae-ca96a.firebaseapp.com",
        projectId: "sae-ca96a",
        storageBucket: "sae-ca96a.appspot.com",
        messagingSenderId: "464133020611",
        appId: "1:464133020611:web:442987c98e6324a623bb76"
    };

    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    auth = getAuth();
    firestore = getFirestore(app);
}

export async function createUser(email: string, password: string){
    if (!auth){
        throw new Error('App not initialized');
    }
    const creds = await createUserWithEmailAndPassword(auth, email, password);

    const uid = await fetch('/auth', {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
            'Authorization': 'Bearer ' + await creds.user.getIdToken()
        })
    }).then(async r => r.ok ? await r.json() : undefined) as LoggedUser | undefined;

    user.set(uid);
}

export async function loginUser(email: string, password: string) {
    if (!auth){
        throw new Error('App not initialized');
    }

    const creds = await signInWithEmailAndPassword(auth, email, password);

    const uid = await fetch('/auth', {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
            'Authorization': 'Bearer ' + await creds.user.getIdToken()
        })
    }).then(async r => r.ok ? await r.json() : undefined) as LoggedUser | undefined;

    user.set(uid);
}