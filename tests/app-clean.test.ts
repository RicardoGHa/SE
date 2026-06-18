import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals"
import {
    FinanceClaculator,
    ItemValidator,
    MaxPriceValidator,
    Order,
    OrderManagement,
    PremiumOrderManagement,
    PriceValidator,
    Validator,
} from "../src/app-clean"

describe("OrderManagement", () => {
    // Before all. new validator and new calculator
    // before each, new order manager
    // after each, reset order manager
    // after all, reset validator and calculator

    let validator: Validator;
    let calc: FinanceClaculator;
    let orderManager: OrderManagement;
    let baseValidator: (arg0: Order) => void;

    beforeAll(() => {
        validator = new Validator([]);
        calc = new FinanceClaculator();
    })

    beforeEach(()=> {
        validator.validate = jest.fn();
        orderManager = new OrderManagement(validator, calc);
    })

    afterEach(() => {
    })
    it('should add an order', () => {
        // 3 As
        // Arrange
        // Act
        // Assert

        // Arrange    
        const item = "Sponge";
        const price = 15;

        // Act
        orderManager.addOrder(item, price);

        // Assert
        expect(orderManager.getOrders()).toEqual([{ id: 1, item, price }])

    })
    it('should add an order', () => {
        // 3 As
        // Arrange
        // Act
        // Assert

        // Arrange
        const item = "Sponge";
        const price = 15;

        // Act
        orderManager.addOrder(item, price);

        const order = orderManager.getOrder(1);

        // Assert
        expect(order).toEqual({ id: 1, item, price })
    })
    it("should call finance calculator getRevenue", () => {
        const item = "Sponge";
        const price = 15;
        orderManager.addOrder(item, price);
        const spy = jest.spyOn(calc,"getRevenue");
        // Act
        orderManager.getTotalRevenue();

        //assert
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith([{id: 1, item, price}])
        expect(spy).toHaveReturnedWith(15)
    })

    it("should throw additional exception if validator does not pass", () => {
        const item = "Sponge";
        const price = 15;
        (validator.validate as jest.Mock).mockImplementation(() => {
            throw new Error("Invalid order");
        });

        //act and assert
        expect(() => orderManager.addOrder(item, price)).toThrow("[OrderManagement] error adding order: Invalid order");
    })

    it("should return undefined when an order does not exist", () => {
        expect(orderManager.getOrder(99)).toBeUndefined();
    })

    it("should calculate average buy power", () => {
        orderManager.addOrder("Sponge", 10);
        orderManager.addOrder("Chocolate", 20);

        expect(orderManager.getBuyPower()).toBe(15);
    })

    it("should fetch premium orders through the base behavior", () => {
        const premiumOrderManager = new PremiumOrderManagement(validator, calc);
        premiumOrderManager.addOrder("Sponge", 15);

        expect(premiumOrderManager.getOrder(1)).toEqual({ id: 1, item: "Sponge", price: 15 });
    })
})

describe("Validators", () => {
    it("should run all validator rules", () => {
        const order = { id: 1, item: "Sponge", price: 15 };
        const itemValidator = new ItemValidator();
        const priceValidator = new PriceValidator();
        const maxPriceValidator = new MaxPriceValidator();
        const validator = new Validator([itemValidator, priceValidator, maxPriceValidator]);

        expect(() => validator.validate(order)).not.toThrow();
    })

    it("should reject invalid item names", () => {
        const validator = new ItemValidator();

        expect(() => validator.validate({ id: 1, item: "Pizza", price: 15 })).toThrow("Invalid item");
    })

    it("should reject prices less than or equal to zero", () => {
        const validator = new PriceValidator();

        expect(() => validator.validate({ id: 1, item: "Sponge", price: 0 })).toThrow("Price must be greater than zero");
    })

    it("should reject prices over the maximum", () => {
        const validator = new MaxPriceValidator();

        expect(() => validator.validate({ id: 1, item: "Sponge", price: 101 })).toThrow("Price must be less than 100");
    })
})

describe("FinanceCalculator", () => {
    it("should get the total revenue", () => {
        const calc = new FinanceClaculator();
        const orders = [
            { id: 1, item: "Sponge", price: 15 },
            { id: 2, item: "Chocolate", price: 20 },
            { id: 3, item: "Fruit", price: 18 },
            { id: 4, item: "Red Velvet", price: 25 },
            { id: 5, item: "Coffee", price: 8 },
        ];

        const revenue = calc.getRevenue(orders);

        expect(revenue).toEqual(86)
    });

    it("should return zero average buy power with no orders", () => {
        const calc = new FinanceClaculator();

        expect(calc.getAverageBuyPower([])).toBe(0);
    });
})
