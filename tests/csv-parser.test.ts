import { describe, expect, it } from "@jest/globals";
import path from "path";
import { parseCSV } from "../src/parsers/csvParser";

describe("CSV Parser", () => {
    it("should parse a CSV file into objects", async () => {
        // Arrange
        const filePath = path.join(process.cwd(), "src/data/cake orders.csv");

        // Act
        const orders = await parseCSV(filePath);

        // Assert
        expect(orders[0]).toEqual(expect.objectContaining({
            id: "0",
            Type: "Sponge",
            Flavor: "Vanilla",
            Price: "50",
        }));
    });

    it("should reject malformed CSV rows", async () => {
        // Arrange
        const filePath = path.join(process.cwd(), "logs/fixtures/malformed.csv");

        // Act and Assert
        await expect(parseCSV(filePath)).rejects.toThrow("CSV row 2 has 2 values, but expected 3");
    });

    it("should parse quoted CSV values", async () => {
        // Arrange
        const filePath = path.join(process.cwd(), "logs/fixtures/quoted.csv");

        // Act
        const orders = await parseCSV(filePath);

        // Assert
        expect(orders[0]).toEqual({
            id: "1",
            Type: "Sponge, Cake",
            Message: "He said \"hello\"",
        });
    });

    it("should reject an empty CSV file", async () => {
        // Arrange
        const filePath = path.join(process.cwd(), "logs/fixtures/empty.csv");

        // Act and Assert
        await expect(parseCSV(filePath)).rejects.toThrow("CSV file is empty");
    });

    it("should reject a CSV file with an empty header", async () => {
        // Arrange
        const filePath = path.join(process.cwd(), "logs/fixtures/empty-header.csv");

        // Act and Assert
        await expect(parseCSV(filePath)).rejects.toThrow("CSV header row is missing or contains empty headers");
    });

    it("should reject a CSV file with an unclosed quote", async () => {
        // Arrange
        const filePath = path.join(process.cwd(), "logs/fixtures/unclosed-quote.csv");

        // Act and Assert
        await expect(parseCSV(filePath)).rejects.toThrow("CSV contains an unclosed quote");
    });

    it("should reject missing CSV files", async () => {
        // Arrange
        const filePath = path.join(process.cwd(), "logs/fixtures/missing.csv");

        // Act and Assert
        await expect(parseCSV(filePath)).rejects.toThrow("Unable to read CSV file");
    });
});
