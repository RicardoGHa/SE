import { FinanceClaculator, ItemValidator, MaxPriceValidator, OrderManagement, PriceValidator, Validator } from "app-clean";

const orders = [
  { id: 1, item: "Sponge", price: 15 },
  { id: 2, item: "Chocolate", price: 20 },
  { id: 3, item: "Fruit", price: 18 },
  { id: 4, item: "Red Velvet", price: 25 },
  { id: 5, item: "Coffee", price: 8 },
];

const rules = [
        new PriceValidator(),
        new MaxPriceValidator(),
        new ItemValidator(),
    ]

const orderManager = new OrderManagement(new Validator(rules), new FinanceClaculator);
for(const order of orders){
  orderManager.addOrder(order.item, order.price);
}
// Adding a new order directly
const newItem = "Marble";
const newPrice = 22;



console.log("Orders after adding a new order:", orderManager.getOrders());

// Calculate Total Revenue directly
console.log("Total Revenue:", FinanceClaculator.getRevenue(orders));

// Calculate Average Buy Power directly
console.log("Average Buy Power:", FinanceClaculator.getAverageByPower(orders));

// Fetching an order directly
const fetchId = 2;
const fetchedOrder = orderManager.getOrder(fetchId)
console.log("Order with ID 2:", fetchedOrder);

// Attempt to fetch a non-existent order
const nonExistentId = 10;
const nonExistentOrder = orderManager.getOrder(nonExistentId)
console.log("Order with ID 10 (non-existent):", nonExistentOrder);