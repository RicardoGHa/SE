import { Item, ItemCategory } from "./item.model";

export class Toy implements Item {
    getCategory(): ItemCategory {
        return ItemCategory.TOY;
    }
    private type: string;
    private ageGroup: string;
    private brand: string;
    private material: string;
    private batteryRequired: boolean;
    private educational: boolean;
    private price: number;
    private quantity: number;
    
    constructor(type: string, ageGroup: string, brand: string, material: string, batteryRequired: boolean, educational: boolean, price: number, quantity: number) {
        this.type = type;
        this.ageGroup = ageGroup;
        this.brand = brand;
        this.material = material;
        this.batteryRequired = batteryRequired;
        this.educational = educational;
        this.price = price;
        this.quantity = quantity;
    }
    getType():string {
        return this.type;
    }
    getAgeGroup():string {
        return this.ageGroup;
    }
    getBrand():string {
        return this.brand;
    }
    getMaterial():string {
        return this.material;
    }
    getBatteryRequired():boolean {
        return this.batteryRequired;
    }
    getEducational():boolean {
        return this.educational;
    }
    getPrice():number {
        return this.price;
    }
    getQuantity():number {
        return this.quantity;
    }
}