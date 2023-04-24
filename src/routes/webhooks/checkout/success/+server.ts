import { PRIVATE_STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { database } from '$lib/server/firebase.js';
import { stripe } from '$lib/server/stripe.js';
import type { Stripe } from 'stripe';


export async function POST({ request }) {
    console.log("Webhook", request);
    const signature = request.headers.get('stripe-signature');

    console.log("Recieved signature", signature);

    if (!signature) {
        return new Response(
            `Invalid request`,
            {
                status: 400
            }
        );
    }

    let event: Stripe.Event;

    const endpointSecret = PRIVATE_STRIPE_WEBHOOK_SECRET;
    try {
        event = stripe.webhooks.constructEvent(await request.text(), signature, endpointSecret);
    } catch (err) {
        return new Response(
            `Webhook Error: ${err instanceof Error ? err.message : ''}`,
            {
                status: 400
            }
        );
    }

    console.log("Constructed event", event);

    switch (event.type) {
        case 'checkout.session.completed':
            const {id} = event.data.object as Stripe.Checkout.Session;
            
            const all = await database.collection('cart').where('stripeSession', '==', id).get();

            if (all.empty)
                return new Response();

            const ref = all.docs[0].ref;

            await ref.update({
                status: 'completed'
            });
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return new Response();
}