import { writable } from "svelte/store";
import type { ShoppingItem } from "../model/card";
import type { Product } from "../model/product";
import type Konva from "konva";
import type { Personalization } from "../model/personalization";

export const cartStore = writable<ShoppingItem[]>(JSON.parse(localStorage.getItem("cart") || "[]"));

cartStore.subscribe(value => localStorage.setItem("cart", JSON.stringify(value)))

function _arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}


export async function addToCart(cart: ShoppingItem[], product: Product, qty: number, personalizations: Personalization[]){
    const toHash = {
        productId: product.id,
        personalizations,
    };

    const encoder = new TextEncoder();
    const hash = _arrayBufferToBase64(
        await crypto.subtle.digest(
            "SHA-512",
            encoder.encode(JSON.stringify(toHash))
        )
    );

    for (const item of cart) {
        if (item.hash === hash) {
            item.number += qty;
            cart = cart; //To update
            return;
        }
    }

    cart = [
        ...cart,
        {
            hash,
            number: qty,
            product,
            personalizations: toHash.personalizations
        }
    ];

    cartStore.set(cart);
}