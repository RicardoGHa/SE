import { IItem } from "./IItem";
import { IOrder } from "./IOrder";

export class Order implements IOrder {

    private id: string;
    private item: IItem;
    private price: number;
    private quantity: number;
    constructor(id: string, item: IItem, price: number, quantity: number) {
        this.id = id;
        this.item = item;
        this.price = price;
        this.quantity = quantity;
    }
    getItem(): IItem {
        return this.item;
    }
    getQuantity(): number {
        return this.quantity;
    }
    getPrice(): number {
        return this.price;
    }
    getId(): string {
        return this.id;
    }
}