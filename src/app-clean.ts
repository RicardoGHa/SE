// SOLID PRINCIPLES

import logger from "./util/logger";

//Single Responsability Principle (SRP)

//ya3ane kel module 3ande yeha bado ykoun 3anda 1/single responsabilty
//ayya method, ayya class, bado ykoun 3anda 1/ single responsability
//bel file app.ts 3am a3mil getting w removing w adding etc lal orders. 3am a3mil computing
//lal average price lal order, 3am a3mil validating lal orders etc fi ktir eshya violating lal SRP


//Open Closed Principle (OCP)
// classes wel methods wel modules are open for expantion but closed for modification
//ya3ne ma t3addil 3al code eza ken meshe, bas zid 3le features jded, ya3ne lamma ya3mol crash l code
//bas l features l jded yeklouwa mesh kel shi


//Liskov Substitution Principle (LSP)
//l sub types mne2dar nbaddeloun men parent types men doun ma yentezi3 l code taba3na

// interface Segmentation Principle (ISP)
// l interface li ra7 t3arrefa wel methods li ra7 t3arrefoun, kelloun lezim ykouno related
// ma badna l client l bado yesta5dim hal contract ysor mottar ya3mlo implemetation la methods houwe mesh bi 7aje la eloun wala 7a y3ouzoun

// Dependency Inversion Principles (DIP)
// l high level modules ma lezim ykouno dependent 3al low level modules and vice versa
// lezim kel shi ykoun depandent 3al abstraction
// 7a nsir nofsloul e3timed l OrderManager 3ala l Validator w 3ala l FinancialCalculator, lahek lezim ne5la2 constructors

export interface Order {
    price: number,
    id: number,
    item: string
}

export class OrderManagement {
    // get orders, store orders, and add orders
    private orders: Order[] = [];
    constructor(private validator: IValidator, private calculator: ICalculator) {

    }
    getOrders() {
        return this.orders;
    }
    addOrder(item: string, price: number) {
        try {
            const order: Order = { id: this.orders.length + 1, item, price }
            this.validator.validate(order);
            this.orders.push({ id: this.orders.length + 1, item, price });
        } catch(error: unknown) {
            throw new Error("[OrderManagement] error adding order: " + (error as Error).message);
        }
    }
    getOrder(id: number) {
        const order = this.getOrders().find(order => order.id === id);
        if(!order){
            logger.warn(`Order with ID ${id} not Found`)
        }
        return order;
    }
    getTotalRevenue() {
        return this.calculator.getRevenue(this.orders);
    }
    getBuyPower() {
        return this.calculator.getAverageBuyPower(this.orders)
    }
}

export class PremiumOrderManagement extends OrderManagement {
    //LSP, kel shi l OrderManagement edra ta3mlo, hal class PremiumOrderManagement fiya ta3mlo bas bet 3addil 3le
    getOrder(id: number): Order | undefined {
        console.log("ALERT: Premium order being fetched");
        return super.getOrder(id);
    }
}
//OCP
//3melna l Ivalidator w shelna l functions(li halla2 classes men l validator kermel hal OCP concept
//ya3ne saro open for extention w closed for modification)
//sar eza badna nzid shi n7otto bel export class Validator implements IValidator 
//ma men 3addil shi zabit, add ma zedet concepts 3laya lal Valodator class, l OrderManager class will stay closed for modification

interface IValidator {
    validate(order: Order): void;
    // ISP
    // faradan l validator badda method jdide bada tkoun getPossibleItems()
    // se3eta kel l methods ta7et majbourin ya3mlouwa l henne mesh kelloun bi 3ouzouwa bi 7ejeta
    // fa l azbat na3mol interfaces
    // kel ma badna nektoub bel contract taba3na 2aw l interfaces, badna yokouno kel l methods taba3na related
    // we will created kermel hek interface jdide esma IPossibleItems

}
// hon l sha5s l mottar enno yesta3mol IPossibleItems byesta3mela matra7 ma bado yeha, mesh 3and l kel
// fa azbat nkattir l interfaces a7sa ma n7ottoun bi we7de w na3mol cluster of methods l be2e ma 7a y3ouzouwoun
// interface IPossibleItems {
//     getPossibleItems(): string[];
// }

export class Validator implements IValidator {
    constructor(private rules: IValidator[]) {

    }

    validate(order: Order): void {
        this.rules.forEach(rule => rule.validate(order));
    }
}



export class ItemValidator implements IValidator {
    private static possibleItems = [
        "Sponge",
        "Chocolate",
        "Fruit",
        "Red Velvet",
        "Birthday",
        "Carrot",
        "Marble",
        "Coffee",
    ];
    validate(order: Order) {
        if (!ItemValidator.possibleItems.includes(order.item)) {
            logger.error(`Invalid Item: ${order.item}`)
            throw new Error(`Invalid item. Must be one of: ${ItemValidator.possibleItems.join(", ")}`);

        }
    }
}
export class PriceValidator implements IValidator {
    validate(order: Order) {
        if (order.price <= 0) {
            logger.error(`Price is negative ${order.item}`)
            throw new Error("Price must be greater than zero");
        }
    }
}
export class MaxPriceValidator implements IValidator {
    validate(order: Order) {
        if (order.price > 100) {
            throw new Error("Price must be less than 100");
        }
    }

}

interface ICalculator {
    getRevenue(orders: Order[]): number;
    getAverageBuyPower(orders: Order[]): number;
}


export class FinanceClaculator implements ICalculator {
    // calculate total revenue and average buy power
    public getRevenue(orders: Order[]) {
        return orders.reduce((total, order) => total + order.price, 0);
    }

    public getAverageBuyPower(orders: Order[]) {
        return orders.length === 0 ? 0 : this.getRevenue(orders) / orders.length;
    }
}

