import type { Personalization } from "./personalization";
import type { Product } from "./product";

export interface ShoppingItem{
    product: Product,
    number: number,
    hash: string,
    personalizations: Personalization[]
}