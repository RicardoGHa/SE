
import { SQLiteCake, SQLiteCakeMapper } from "../../mappers/Cake.mapper";
import { IdentifiableCake } from "../../model/Cake.model";
import { ItemCategory } from "../../model/IItem";
import { DbException, InitalizationException, ItemsNotFoundException } from "../../util/exceptions/repositoryException";
import logger from "../../util/logger";
import { id, Initializable, IRepository } from "../IRepository";
import { ConnectionManager } from "./ConnectionManager";


const tableName = ItemCategory.CAKE

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${tableName}(
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        flavor TEXT NOT NULL,
        filling TEXT NOT NULL,
        size INTEGER NOT NULL,
        layers INTEGER NOT NULL,
        frostingType TEXT NOT NULL,
        frostingFlavor TEXT NOT NULL,
        decorationType TEXT NOT NULL,
        decorationColor TEXT NOT NULL,
        customMessage TEXT NOT NULL,
        shape TEXT NOT NULL,
        allergies TEXT NOT NULL,
        specialIngredients TEXT NOT NULL,
        packagingType TEXT NOT NULL
    )`;


const INSERT_CAKE = `INSERT INTO  ${tableName}(
        id,
        type,
        flavor,
        filling,
        size,
        layers,
        frostingType,
        frostingFlavor,
        decorationType,
        decorationColor,
        customMessage,
        shape,
        allergies,
        specialIngredients,
        packagingType
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )`;

const SELECT_BY_ID = `SELECT * FROM ${tableName} WHERE id = ?`

const SELECT_ALL = `SELECT * FROM ${tableName}`

const DELETE_ID = `DELETE FROM ${tableName} WHERE id = ?`

const UPDATE_ID = `UPDATE ${tableName} SET type = ?, flavor = ?, filling = ?, size = ?, layers = ?, frostingType = ?, frostingFlavor = ?, decorationType = ?, decorationColor = ?, customMessage = ?, shape = ?, allergies = ?, specialIngredients = ?, packagingType = ? WHERE id = ?`

export class CakeRepository implements IRepository<IdentifiableCake>, Initializable {


    async init(): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
            logger.info("Order table initialized")
        } catch (error: unknown) {
            logger.error("Failed to initialize Cake table", error as Error);
            throw new InitalizationException("Failed to initialize Order table", error as Error)

        }
    }
    async create(item: IdentifiableCake): Promise<id> {
        // it is excpected that a transaction has been initalized before this method is called

        try {
            const conn = await ConnectionManager.getConnection();

            await conn.run(INSERT_CAKE, [
                item.getId(),
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType(),
            ]);
            return item.getId();
        } catch (error: unknown) {
            throw new DbException("failed to create order ", error as Error);
        }


    }
    async get(id: id): Promise<IdentifiableCake> {
        let conn
        try {
            conn = await ConnectionManager.getConnection();
            const result = await conn.get<SQLiteCake>(SELECT_BY_ID, id);
            logger.info("Order got: %o", result)
            if (!result) {
                throw new ItemsNotFoundException("Cake of id " + id + "not found")
            }
            return new SQLiteCakeMapper().map(result)

        } catch (error) {
            logger.error("Failed to get error of id %s %o", id, error as Error)
            throw new DbException("Failed to get Order of id" + id, error as Error)

        }
    }
    async getAll(): Promise<IdentifiableCake[]> {
        let conn
        try {
            conn = await ConnectionManager.getConnection();
            const result = await conn.all<SQLiteCake[]>(SELECT_ALL);
            const mapper = new SQLiteCakeMapper();
            return result.map((cake) => mapper.map(cake));

        } catch (error) {
            logger.error("Failed to get all Cakes")
            throw new DbException("Failed to get all Cakes", error as Error)

        }
    }
    async update(item: IdentifiableCake): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.run(UPDATE_ID, [
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType(),
                item.getId()
            ]);
        } catch (error) {
            logger.error("Failed to update Cake of id %s %o", item.getId(), error as Error)
            throw new DbException("Failed to update Cake of id" + item.getId(), error as Error)
        }
    }
    async delete(id: id): Promise<void> {
          let conn
        try {
            conn = await ConnectionManager.getConnection();
            await conn.run(DELETE_ID, id);
        } catch (error) {
            logger.error("Failed to Delete Cake of id %s %o", id, error as Error)
            throw new DbException("Failed to delete Cake of id " + id, error as Error)

        }
    }

}
