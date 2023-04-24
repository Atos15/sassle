import { getFromCookies } from '$lib/server/auth.js';
import { database } from '$lib/server/firebase.js';

export async function GET({cookies, url}){
    const user = await getFromCookies(cookies);

    if (!user){
        return new Response(
            JSON.stringify({error: 'User must be logged in'}),
            {
                status: 401
            }
        )
    }

    const uuid = url.searchParams.get('session');

    if (!uuid){
        return new Response(
            JSON.stringify({error: 'No session provided'}),
            {
                status: 400
            }
        )
    }

    const documents = await database.collection('cart').where('uuid', '==', uuid).limit(1).get();

    if (documents.empty){
        return new Response(
            JSON.stringify({error: 'No session found'}),
            {
                status: 404
            }
        )
    }

    const session = documents.docs[0];

    const data = session.data() as {status: string};

    return new Response(
        JSON.stringify({status: data.status})
    );
}