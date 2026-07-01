import { IIdentifiableItem, IItem } from "../IItem";
import { IIdentifiableOrderItem } from "../IOrder";
import { IdentifiableOrderItem, Order } from "../Order.model";

export class OrderBuilder {

    private item!: IItem;
    private price!: number;
    private quantity!: number;
    private id!: string;

    public static newBuilder(): OrderBuilder {
        return new OrderBuilder();
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

    setId(id: string): OrderBuilder {
        this.id = id;
        return this;
    }
    build(): Order {
        if (!this.id || !this.item || this.price === undefined || this.quantity === undefined) {
            throw new Error('Missing required fields');
        }
        if (Number.isNaN(this.price) || Number.isNaN(this.quantity)) {
            throw new Error('Order price and quantity must be valid numbers');
        }
        return new Order(this.id, this.item, this.price, this.quantity);
    }
}

export class IdentifiableOrderItemBUilder {

    private item!: IIdentifiableItem;
    private order!: Order;

    static newBuilder(): IdentifiableOrderItemBUilder {
        return new IdentifiableOrderItemBUilder;
    }

    setItem(item: IIdentifiableItem): IdentifiableOrderItemBUilder {
        this.item = item;
        return this;
    }
    setOrder(order: Order): IdentifiableOrderItemBUilder {
        this.order = order;
        return this
    }
    
    build(): IIdentifiableOrderItem {
        if (!this.item || !this.order ) {
            throw new Error('Missing required properties to build an Identifiable Order');
        }
        return new IdentifiableOrderItem( this.item, this.order.getPrice(), this.order.getQuantity(), this.order.getId(),);
    }

}