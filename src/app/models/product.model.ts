export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    quantity: number;
    description: string;
    inventoryStatus: string;   // INSTOCK, LOWTOCK, OUTOFSTOCK
}