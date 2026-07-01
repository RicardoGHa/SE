import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { SQLiteCake } from "../src/mappers/Cake.mapper";
import { SQLiteOrder } from "../src/mappers/Order.mapper";
import { IdentifiableCake } from "../src/model/Cake.model";
import { ItemCategory } from "../src/model/IItem";
import { IdentifiableOrderItem } from "../src/model/Order.model";
import { CakeRepository } from "../src/repository/sqlite/Cake.order.repository";
import { ConnectionManager } from "../src/repository/sqlite/ConnectionManager";
import { OrderRepository } from "../src/repository/sqlite/Order.repository";
import { DbException, InitalizationException } from "../src/util/exceptions/repositoryException";

type MockDb = {
    exec: jest.MockedFunction<(sql: string) => Promise<void>>;
    run: jest.MockedFunction<(sql: string, params?: unknown) => Promise<void>>;
    get: jest.MockedFunction<(sql: string, params?: unknown) => Promise<unknown>>;
    all: jest.MockedFunction<(sql: string, params?: unknown) => Promise<unknown[]>>;
};

const cakeRow: SQLiteCake = {
    id: "cake-1",
    type: "birthday",
    flavor: "vanilla",
    filling: "cream",
    size: 8,
    layers: 2,
    frostingType: "buttercream",
    frostingFlavor: "strawberry",
    decorationType: "flowers",
    decorationColor: "pink",
    customMessage: "happy day",
    shape: "round",
    allergies: "none",
    specialIngredients: "berries",
    packagingType: "box",
};

const makeCake = (id = cakeRow.id): IdentifiableCake => new IdentifiableCake(
    id,
    cakeRow.type,
    cakeRow.flavor,
    cakeRow.filling,
    cakeRow.size,
    cakeRow.layers,
    cakeRow.frostingType,
    cakeRow.frostingFlavor,
    cakeRow.decorationType,
    cakeRow.decorationColor,
    cakeRow.customMessage,
    cakeRow.shape,
    cakeRow.allergies,
    cakeRow.specialIngredients,
    cakeRow.packagingType,
);

const makeDb = (): MockDb => ({
    exec: jest.fn(async () => undefined),
    run: jest.fn(async () => undefined),
    get: jest.fn(async () => undefined),
    all: jest.fn(async () => []),
});

describe("CakeRepository", () => {
    let db: MockDb;

    beforeEach(() => {
        db = makeDb();
        jest.spyOn(ConnectionManager, "getConnection").mockResolvedValue(db as never);
    });

    it("initializes the cake table", async () => {
        await new CakeRepository().init();

        expect(db.exec).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS cake"));
    });

    it("wraps initialization failures", async () => {
        db.exec.mockRejectedValue(new Error("no db"));

        await expect(new CakeRepository().init()).rejects.toThrow(InitalizationException);
    });

    it("creates a cake and returns its id", async () => {
        const cake = makeCake();

        await expect(new CakeRepository().create(cake)).resolves.toBe("cake-1");

        expect(db.run).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO  cake"),
            [
                "cake-1",
                "birthday",
                "vanilla",
                "cream",
                8,
                2,
                "buttercream",
                "strawberry",
                "flowers",
                "pink",
                "happy day",
                "round",
                "none",
                "berries",
                "box",
            ],
        );
    });

    it("maps a selected row into an identifiable cake", async () => {
        db.get.mockResolvedValue(cakeRow);

        const cake = await new CakeRepository().get("cake-1");

        expect(db.get).toHaveBeenCalledWith(expect.stringContaining("WHERE id = ?"), "cake-1");
        expect(cake).toBeInstanceOf(IdentifiableCake);
        expect(cake.getId()).toBe("cake-1");
        expect(cake.getFlavor()).toBe("vanilla");
    });

    it("maps all selected rows", async () => {
        db.all.mockResolvedValue([cakeRow, { ...cakeRow, id: "cake-2", flavor: "chocolate" }]);

        const cakes = await new CakeRepository().getAll();

        expect(cakes.map((cake) => cake.getId())).toEqual(["cake-1", "cake-2"]);
        expect(cakes[1].getFlavor()).toBe("chocolate");
    });

    it("updates a cake by id", async () => {
        await new CakeRepository().update(makeCake());

        expect(db.run).toHaveBeenCalledWith(
            expect.stringContaining("UPDATE cake SET"),
            [
                "birthday",
                "vanilla",
                "cream",
                8,
                2,
                "buttercream",
                "strawberry",
                "flowers",
                "pink",
                "happy day",
                "round",
                "none",
                "berries",
                "box",
                "cake-1",
            ],
        );
    });

    it("deletes a cake by id", async () => {
        await new CakeRepository().delete("cake-1");

        expect(db.run).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM cake"), "cake-1");
    });

    it("wraps database failures", async () => {
        db.run.mockRejectedValue(new Error("insert failed"));

        await expect(new CakeRepository().create(makeCake())).rejects.toThrow(DbException);
    });
});

describe("OrderRepository", () => {
    let db: MockDb;
    let itemRepository: {
        init: jest.MockedFunction<() => Promise<void>>;
        create: jest.MockedFunction<(item: IdentifiableCake) => Promise<string>>;
        get: jest.MockedFunction<(id: string) => Promise<IdentifiableCake>>;
        getAll: jest.MockedFunction<() => Promise<IdentifiableCake[]>>;
        update: jest.MockedFunction<(item: IdentifiableCake) => Promise<void>>;
        delete: jest.MockedFunction<(id: string) => Promise<void>>;
    };
    let cake: IdentifiableCake;
    let order: IdentifiableOrderItem;

    beforeEach(() => {
        db = makeDb();
        cake = makeCake();
        order = new IdentifiableOrderItem(cake, 35, 3, "order-1");
        itemRepository = {
            init: jest.fn(async () => undefined),
            create: jest.fn(async () => "cake-1"),
            get: jest.fn(async () => cake),
            getAll: jest.fn(async () => [cake]),
            update: jest.fn(async () => undefined),
            delete: jest.fn(async () => undefined),
        };
        jest.spyOn(ConnectionManager, "getConnection").mockResolvedValue(db as never);
    });

    it("initializes the order table and item repository", async () => {
        await new OrderRepository(itemRepository).init();

        expect(db.exec).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS "order"'));
        expect(itemRepository.init).toHaveBeenCalled();
    });

    it("wraps init errors", async () => {
        itemRepository.init.mockRejectedValue(new Error("item init failed"));

        await expect(new OrderRepository(itemRepository).init()).rejects.toThrow(InitalizationException);
    });

    it("creates the item and order inside one transaction", async () => {
        await expect(new OrderRepository(itemRepository).create(order)).resolves.toBe("order-1");

        expect(db.exec).toHaveBeenNthCalledWith(1, "BEGIN TRANSACTION");
        expect(itemRepository.create).toHaveBeenCalledWith(cake);
        expect(db.run).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO "order"'),
            ["order-1", 3, 35, ItemCategory.CAKE, "cake-1"],
        );
        expect(db.exec).toHaveBeenNthCalledWith(2, "COMMIT");
    });

    it("rolls back when create fails", async () => {
        db.run.mockRejectedValue(new Error("insert failed"));

        await expect(new OrderRepository(itemRepository).create(order)).rejects.toThrow(DbException);

        expect(db.exec).toHaveBeenCalledWith("ROLLBACK");
    });

    it("maps a selected order with the item repository result", async () => {
        const row: SQLiteOrder = {
            id: "order-1",
            quantity: 3,
            price: 35,
            item_category: ItemCategory.CAKE,
            item_id: "cake-1",
        };
        db.get.mockResolvedValue(row);

        const result = await new OrderRepository(itemRepository).get("order-1");

        expect(itemRepository.get).toHaveBeenCalledWith("cake-1");
        expect(result.getId()).toBe("order-1");
        expect(result.getItem().getId()).toBe("cake-1");
        expect(result.getPrice()).toBe(35);
    });

    it("returns an empty list without querying orders when no items exist", async () => {
        itemRepository.getAll.mockResolvedValue([]);

        await expect(new OrderRepository(itemRepository).getAll()).resolves.toEqual([]);

        expect(db.all).not.toHaveBeenCalled();
    });

    it("maps all orders that match the item category", async () => {
        db.all.mockResolvedValue([
            { id: "order-1", quantity: 3, price: 35, item_category: ItemCategory.CAKE, item_id: "cake-1" },
        ]);

        const orders = await new OrderRepository(itemRepository).getAll();

        expect(db.all).toHaveBeenCalledWith(expect.stringContaining("WHERE item_category = ?"), ItemCategory.CAKE);
        expect(orders).toHaveLength(1);
        expect(orders[0].getItem().getId()).toBe("cake-1");
    });

    it("updates the item and order with correctly ordered SQL parameters", async () => {
        await new OrderRepository(itemRepository).update(order);

        expect(itemRepository.update).toHaveBeenCalledWith(cake);
        expect(db.run).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE "order" SET quantity = ?'),
            [3, 35, ItemCategory.CAKE, "cake-1", "order-1"],
        );
        expect(db.exec).toHaveBeenCalledWith("COMMIT");
    });

    it("deletes the stored item id and then the order row", async () => {
        db.get.mockResolvedValue({
            id: "order-1",
            quantity: 3,
            price: 35,
            item_category: ItemCategory.CAKE,
            item_id: "cake-1",
        });

        await new OrderRepository(itemRepository).delete("order-1");

        expect(itemRepository.delete).toHaveBeenCalledWith("cake-1");
        expect(db.run).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM "order"'), "order-1");
        expect(db.exec).toHaveBeenCalledWith("COMMIT");
    });

    it("rolls back when delete cannot find the order", async () => {
        db.get.mockResolvedValue(undefined);

        await expect(new OrderRepository(itemRepository).delete("missing-order")).rejects.toThrow(DbException);

        expect(itemRepository.delete).not.toHaveBeenCalled();
        expect(db.exec).toHaveBeenCalledWith("ROLLBACK");
    });
});
