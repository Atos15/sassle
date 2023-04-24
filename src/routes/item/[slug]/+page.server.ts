import { database } from '$lib/server/firebase.js';
import { redirect } from '@sveltejs/kit';
import type { Product } from '../../../model/product.js';

export async function load({params}) : Promise<Product>{

    const slug = params.slug;

    const doc = await database.collection('products').doc(slug).get();

    if (!doc.exists)
        throw redirect(302, '/home');

    return doc.data() as Product;
}