import { getFromCookies } from "$lib/server/auth.js";
import { database } from "$lib/server/firebase.js";
import { stripe } from "$lib/server/stripe";
import type { ShoppingItem } from "../../model/card.js";

export async function POST({url, request, locals, cookies}) {
    
    const user = await getFromCookies(cookies);

    if (!user){
        return new Response(
            'User must be logged in',
            {
                status: 401
            }
        )
    }

    const body = await request.json() as ShoppingItem[];

    const uuid = crypto.randomUUID();

    const session = await stripe.checkout.sessions.create({
        line_items: body.map(i => ({
            price: i.product.priceId,
            quantity: i.number
        })),
        mode: 'payment',
        success_url: `${url.origin}/checkout/success?session=${uuid}`,
        cancel_url: `${url.origin}/checkout/refused?session=${uuid}`,
    });

    database.collection('cart').add({
        uuid,
        stripeSession: session.id,
        user: user.uid,
        content: body,
        status: 'payment_in_progress'
    });

    return new Response(JSON.stringify({
        sessionURL: session.url
    }));
}
