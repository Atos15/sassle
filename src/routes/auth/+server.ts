import { getFromCookies } from '$lib/server/auth.js';
import { adminFirebaseApp } from '$lib/server/firebase.js';

export async function GET({ cookies }) {
    const value = await getFromCookies(cookies);
    if (!value){
        return new Response(
            'Not authorized',
            {
                status: 401
            }
        )
    }

    return new Response(
        JSON.stringify(value)
    )
}

export async function POST({ request }) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
        return new Response(
            'Could not authenticate',
            {
                status: 401
            }
        )
    }

    const [protocol, value] = authHeader.split(" ", 2);

    if (protocol !== 'Bearer') {
        return new Response(
            'Wrong authorization protocol',
            {
                status: 401
            }
        )
    }

    try {
        const expiresIn = 5 * 24 * 60 * 1000;
        const user = await adminFirebaseApp.auth().verifyIdToken(value);
        const cookie = await adminFirebaseApp.auth().createSessionCookie(value, { expiresIn: expiresIn });
        const headers = new Headers({
            'Set-Cookie': `token=${cookie}; HttpOnly; Path=/; SameSite=Strict`
        });
        return new Response(
            JSON.stringify({
                uid: user.sub,
                email: user.email
            }),
            {
                status: 200,
                headers
            }
        )
    } catch (err) {
        console.log(err);
        return new Response(
            'Could not verify token',
            {
                status: 401
            }
        )
    }


}