import type { Cookies } from "@sveltejs/kit";
import { adminFirebaseApp } from "./firebase";

export async function getFromCookies(cookies: Cookies){
    const value = cookies.get('token');
    const user = value ? await adminFirebaseApp.auth().verifySessionCookie(value).catch(() => undefined) : undefined;
    return user ? {uid: user.sub, email: user.email} : undefined;
}