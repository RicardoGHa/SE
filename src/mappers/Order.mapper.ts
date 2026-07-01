import { IdentifaibleCakeBuilder } from "../model/builders/Cake.builder";
import { IdentifiableOrderItemBUilder, OrderBuilder } from "../model/builders/Order.builder";
import { IIdentifiableItem, IItem } from "../model/IItem";
import { IIdentifiableOrderItem, IOrder } from "../model/IOrder";
import { IMapper } from "./IMapper";

export class CSVOrderMapper implements IMapper<string[], IOrder> {
    constructor(private itemMapper: IMapper<string[], IItem>) {
    }

    map(data: string[]): IOrder {
        const item: IItem = this.itemMapper.map(data);

        return OrderBuilder.newBuilder()
            .setId(data[0])
            .setQuantity(parseInt(data[data.length - 1]))
            .setPrice(parseInt(data[data.length - 2]))
            .setItem(item)
            .build()
    }
    reverseMap(data: IOrder): string[] {
        const item = this.itemMapper.reverseMap(data.getItem());
        return [
            data.getId(),
            ...item,
            data.getPrice().toString(),
            data.getQuantity().toString()

        ]
    }
}

export interface SQLiteOrder {
    id: string;
    quantity: number;
    price: number;
    item_category: string;
    item_id: string;
}

export class SQLiteOrderMapper implements IMapper< {data: SQLiteOrder, item: IIdentifiableItem} ,IIdentifiableOrderItem> {
    
    map({data, item }: {data: SQLiteOrder, item: IIdentifiableItem}): IIdentifiableOrderItem {
        const order = OrderBuilder.newBuilder().setId(data.id)
            .setPrice(data.price)
            .setQuantity(data.quantity)
            .setItem(item)
            .build()
            return IdentifiableOrderItemBUilder.newBuilder().setOrder(order).setItem(item).build();
    }

    reverseMap(data: IIdentifiableOrderItem): {data: SQLiteOrder, item: IIdentifiableItem} {
        return {
            data: {
                id: data.getId(),
                price:  data.getPrice(),
                quantity: data.getQuantity(),
                item_category: data.getItem().getCategory(),
                item_id: data.getItem().getId()

            },
            item: data.getItem()
        }
    }
 
    
}
