import { IItem } from "./IItem";

export interface IOrder {
    getItem(): IItem;
    getQuantity(): number;
    getPrice(): number;
    getId(): string
}