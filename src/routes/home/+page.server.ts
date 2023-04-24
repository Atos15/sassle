import { database } from "$lib/server/firebase";
import type { Product } from "../../model/product";

export async function load(){
    const products = (await database.collection('products').get()).docs;

    return {products: products.map(d => ({id: d.id, ...(d.data())})) as Product[]};
}