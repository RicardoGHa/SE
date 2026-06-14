import { Item } from "./item.model";

export interface Order {
    getItem(): Item;
    getQuantity(): number;
    getPrice(): number;
    getId(): string
}