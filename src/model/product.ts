export interface Product{
    id: string,
    title: string,
    by: string,
    pricePerUnit: 318,
    pricePerUnitBeforeDiscount: 397,
    priceId: string,
    cover: string,
    personalizations: {
        type: string,
        display: string,
        x: number,
        y: number,
        fontSize: number,
        value: string,
        view: string
    }[];
    views: {
        [key: string]: {
            order: number,
            preview: string,
            detail: string,
            bounds?: {
                x: number,
                y: number,
                w: number,
                h: number
            }
        }
    }
}
//0.488, 0.394
//0.492, 0.571