import { describe, expect, it } from "@jest/globals";
import path from "path";
import { parseJSON } from "../src/parsers/jsonParser";

type BookOrder = {
    "Order ID": string;
    "Book Title": string;
    Author: string;
    Price: string;
};

describe("JSON Parser", () => {
    it("should parse a JSON file", async () => {
        // Arrange
        const filePath = path.join(process.cwd(), "src/data/book orders.json");

        // Act
        const orders = await parseJSON<BookOrder[]>(filePath);

        // Assert
        expect(orders[0]).toEqual(expect.objectContaining({
            "Order ID": "2001",
            "Book Title": "Edge of Eternity",
            Author: "Dan Brown",
            Price: "12",
        }));
    });
});

