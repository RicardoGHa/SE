// import config from "./config";
// let firstname: string;

// firstname = "rick";

// logger.info(`my name is ${firstname}`)
// logger.info("secret is ", config.secret)

main();
export default {
  NODE_ENV: process.env.NODE_ENV || 'development', // Checks if the environment type (e.g., 'production' or 'development') is set; if not, it uses 'development' as default.
  logDir: 'logs', // Specifies the folder where log files will be saved.
};
import { FinanceClaculator, ItemValidator, MaxPriceValidator, OrderManagement, PriceValidator, Validator } from "./app-clean";
import logger from "./util/logger";
import path from 'path';
import {parseCSV} from './util/parser'

const filePath = path.resolve(__dirname, './data/Cake orders.csv');

async function main() {
    try {
        const products = await parseCSV(filePath)
        for (const product of products) {
            logger.info(product + '\n');
        }
    } catch(error) {
        logger.error(error)
    }
}



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
for (const order of orders) {
  orderManager.addOrder(order.item, order.price);
}
// Adding a new order directly
const newItem = "Marble";
const newPrice = 22;



logger.info("Orders after adding a new order: %o", orderManager.getOrders());

// Calculate Total Revenue directly
logger.info("Total Revenue:" + orderManager.getTotalRevenue());

// Calculate Average Buy Power directly
logger.info("Average Buy Power:" + orderManager.getBuyPower());

// Fetching an order directly
const fetchId = 2;
const fetchedOrder = orderManager.getOrder(fetchId)
logger.info("Order with ID 2: %o", fetchedOrder);

// Attempt to fetch a non-existent order
const nonExistentId = 10;
const nonExistentOrder = orderManager.getOrder(nonExistentId)
logger.info("Order with ID 10 (non-existent):" + nonExistentOrder);