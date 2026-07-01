import { IIdentifiableOrderItem } from "../../model/IOrder";
import { id, Initializable, IRepository } from "../IRepository";
import logger from "../../util/logger";
import { DbException, InitalizationException } from "../../util/exceptions/repositoryException";
import { ConnectionManager } from "./ConnectionManager";
import { IIdentifiableItem } from "../../model/IItem";
import { IdentifiableOrderItem } from "../../model/Order.model";
import { SQLiteOrder, SQLiteOrderMapper } from "../../mappers/Order.mapper";
import { connect } from "tls";


const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS "order"(
        id TEXT PRIMARY KEY,
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        item_category TEXT NOT NULL,
        item_id TEXT NOT NULL
        )`;


const INSERT_ORDER = `INSERT INTO "order" (id, quantity, price, item_category, item_id)
        VALUES (?, ?, ?, ?, ?)`;


const SELECT_BY_ID = `SELECT * FROM "order" WHERE id = ?`


const SELECT_ALL = `SELECT * FROM "order" WHERE item_category = ?`

const DELETE_ID = `DELETE FROM "order" WHERE id = ?`

const UPDATE_ID = `UPDATE "order" SET quantity = ?, price = ?, item_category = ?, item_id = ? WHERE id = ?`



export class OrderRepository implements IRepository<IIdentifiableOrderItem>, Initializable {

    constructor(private readonly itemRepository: IRepository<IIdentifiableItem> & Initializable) {

    }
    async init() {
        try {
            const conn = await ConnectionManager.getConnection()
            await conn.exec(CREATE_TABLE);
            await this.itemRepository.init();
            logger.info("Order table initialized")
        } catch (error: unknown) {
            logger.error("Failed to initialize Order table", error as Error);
            throw new InitalizationException("Failed to initialize Order table", error as Error)

        }
    }


    async create(order: IIdentifiableOrderItem): Promise<id> {
        let conn;

        try {
            conn = await ConnectionManager.getConnection();
            await conn.exec("BEGIN TRANSACTION");
            const item_id = await this.itemRepository.create(order.getItem())

            await conn.run(INSERT_ORDER, [
                order.getId(),
                order.getQuantity(),
                order.getPrice(),
                order.getItem().getCategory(),
                item_id]);
            await conn.exec("COMMIT");
            return order.getId();
        } catch (error: unknown) {
            logger.error("Failed to create Order ", error as Error);
            if (conn) {
                await conn.exec("ROLLBACK");
            }
            throw new DbException("Failed to create Order ", error as Error);

        }

        // transaction           
        // insert data into 'item' table
        //insert data into order table
        // commit
        // return order id

        // if error, log and rallback
    }


    async get(id: id): Promise<IIdentifiableOrderItem> {
        let conn
        try {
            conn = await ConnectionManager.getConnection();
            const result = await conn.get<SQLiteOrder>(SELECT_BY_ID, id);
            if (!result) {
                logger.error("Order of id %s not found", id)
                throw new Error("Order of id" + id + "not found");
            }
            const cake = await this.itemRepository.get(result.item_id)

            return new SQLiteOrderMapper().map({ data: result, item: cake })

        } catch (error) {
            logger.error("Failed to get error of id %s %o", id, error as Error)
            throw new DbException("Failed to get Order of id" + id, error as Error)

        }
    }
    async getAll(): Promise<IIdentifiableOrderItem[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const items = await this.itemRepository.getAll();
            if (items.length === 0) {
                return [];
            }
            const orders = await conn.all<SQLiteOrder[]>(SELECT_ALL, items[0].getCategory());
            // bind orders to items
            const bindedOrders = orders.map((order) => {
                const item = items.find((item) => item.getId() === order.item_id);
                if (!item) {
                    throw new DbException(`Item of id ${order.item_id} not found for order ${order.id}`, new Error(`Item of id ${order.item_id} not found for order ${order.id}`));
                }

                return { order, item };
            })
            // for each binded order and item, map it into an itemtifiable order
            const mapper = new SQLiteOrderMapper();
            const identifiableOrders = bindedOrders.map(({ order, item }) => {
                return mapper.map({ data: order, item });
            })
            // return list of identifiable orders
            return identifiableOrders;


        } catch (error) {
            logger.error("Failed to get all orders ", error as Error)
            throw new DbException("Failed to get all Order", error as Error)

        }
    }
    async update(order: IIdentifiableOrderItem): Promise<void> {
        let conn;

        try {
            conn = await ConnectionManager.getConnection();
            await conn.exec("BEGIN TRANSACTION");
            await this.itemRepository.update(order.getItem());

            await conn.run(UPDATE_ID, order.getId(), order.getQuantity(), order.getPrice(), order.getItem().getCategory(), order.getItem().getId());
            await conn.exec("COMMIT");
        } catch (error: unknown) {
            logger.error("Failed to update Order of id %s %o", order.getId(), error as Error);
            if (conn) {
                await conn.exec("ROLLBACK");
            }
            throw new DbException("Failed to update Order of id " + order.getId(), error as Error);

        }
    }
    async delete(id: id): Promise<void> {
            let conn;

            try {
                conn = await ConnectionManager.getConnection();
                await conn.exec("BEGIN TRANSACTION");
                await this.itemRepository.delete(id);

                await conn.run(DELETE_ID, id);
                await conn.exec("COMMIT");
            } catch (error: unknown) {
                logger.error("Failed to delete Order of id %s %o", id, error as Error);
                if (conn) {
                    await conn.exec("ROLLBACK");
                }
                throw new DbException("Failed to delete Order of id " + id, error as Error);

            }
    }

}
