import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals"
import { FinanceClaculator, Order, OrderManagement, Validator } from "../src/app-clean"

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
    // halla2 l average but power
})
