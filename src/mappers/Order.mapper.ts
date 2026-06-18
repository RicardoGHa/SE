import { OrderBuilder } from "../model/builders/Order.builder";
import { IItem } from "../model/IItem";
import { IOrder } from "../model/IOrder";
import { Order } from "../model/Order.model";
import { CSVCakeMapper } from "./Cake.mapper";
import { IMapper } from "./IMapper";

export class CSVOrderMapper implements IMapper<string[], IOrder> {
    constructor(private itemMapper: IMapper<string[], IItem>){
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
}