import { IItem } from "../IItem";
import { Order } from "../Order.model";

export class OrderBuilder {
    private id!: string;
    private item!: IItem;
    private price!: number;
    private quantity!: number;
    
    public static newBuilder(): OrderBuilder {
        return new OrderBuilder();
    }
    setId(id: string): OrderBuilder {
        this.id = id;
        return this;
    }
    setItem(item: IItem): OrderBuilder {
        this.item = item;
        return this;
    }
    setPrice(price: number): OrderBuilder {
        this.price = price;
        return this;
    }
    setQuantity(quantity: number): OrderBuilder {
        this.quantity = quantity;
        return this;
    }
    build(): Order {
        if (!this.id || !this.item || !this.price || !this.quantity) {
            throw new Error('Missing required fields');
        }
        return new Order(this.id, this.item, this.price, this.quantity);
    }
}