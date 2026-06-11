import { describe, expect, it } from "@jest/globals";
import path from "path";
import { parseXML } from "../src/parsers/xmlParser";

type ToyOrders = {
    data: {
        row: {
            OrderID: number;
            Type: string;
            Brand: string;
            Price: number;
        }[];
    };
};

describe("XML Parser", () => {
    it("should parse an XML file", async () => {
        // Arrange
        const filePath = path.join(process.cwd(), "src/data/toy orders.xml");

        // Act
        const orders = await parseXML<ToyOrders>(filePath);

        // Assert
        expect(orders.data.row[0]).toEqual(expect.objectContaining({
            OrderID: 5001,
            Type: "Plush Toy",
            Brand: "FunTime",
            Price: 247,
        }));
    });
});
