import { IOrder } from "../../model/IOrder";
import { InvalidItemException, ItemsNotFoundException } from "../../util/exceptions/repositoryException";
import logger from "../../util/logger";
import { IRepository } from "../IRepository";

export abstract class OrderRepository implements IRepository<IOrder> {

    protected abstract load(): Promise<IOrder[]>;

    protected abstract save(Iorders: IOrder[]): Promise<void>;

    async create(item: IOrder): Promise<string> {
        // validate the Iorder
        if (!item) {
            throw new InvalidItemException("Order cannot be null");
        }
        // load the Iorders
        const orders = await this.load();
        // add new Iorder
        const id = orders.push(item);
        // save all Iorders
        await this.save(orders);
        logger.info(`Successfully created order with ID ${id}`);
        return String(id)
    }

    async get(id: string): Promise<IOrder> {
        const order = await this.load();
        const foundIOrder = order.find(o => o.getId() === id);
        if (!foundIOrder) {
            logger.error(`Order with ID ${id} not found`);
            throw new ItemsNotFoundException(`IOrder with ID ${id} not found`);
        }
        logger.info(`Successfully found order of id ${id}`);
        return foundIOrder;

    }

    async getAll(): Promise<IOrder[]> {
        const orders = await this.load();
        logger.info("Retreiving %d elements", orders.length);
        return orders;
    }
    async update(item: IOrder): Promise<void> {
        if (!item) {
            logger.error("Order cannot be null");
            throw new InvalidItemException("Order cannot be null");
        }
        const orders = await this.load();
        const index = orders.findIndex(o => o.getId() === item.getId());
        if (index === -1) {
            logger.error(`Failed to find the element ${item.getId()}`);
            throw new ItemsNotFoundException(`Failed to find the element`);
        }
        orders[index] = item;
        await this.save(orders);
        logger.info(`Successfully updated order of id ${item.getId()}`);
    }
    async delete(id: string): Promise<void> {
        const orders = await this.load();
        const index = orders.findIndex(o => o.getId() === id);
        if (index === -1) {
            logger.error(`Failed to find order of id ${id}`);
            throw new ItemsNotFoundException("Failed to find the element");
        }
        orders.splice(index, 1);
        await this.save(orders);
        logger.info(`Successfully deleted order of id ${id}`);
    }
}
