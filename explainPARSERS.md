# Parsers And Parser Tests

This project has three parser files inside `src/parsers`:

- `csvParser.ts`
- `jsonParser.ts`
- `xmlParser.ts`

A parser is code that reads data from a file and changes it into a JavaScript or TypeScript value that the rest of the program can use.

For example:

- A CSV file becomes an array of JavaScript objects.
- A JSON file becomes a JavaScript object or array.
- An XML file becomes a JavaScript object.

All three parsers work in a similar way:

1. They receive a file path.
2. They create a file read stream using `fs.createReadStream`.
3. They collect or process the file data.
4. When the file is finished, they return the parsed result.
5. If something goes wrong, they log the error and reject the promise.

Because they use promises, the tests use `async` and `await`.

## CSV Parser

File:

`src/parsers/csvParser.ts`

Function:

```ts
parseCSV(filePath: string): Promise<Record<string, string>[]>
```

This parser reads a CSV file.

CSV means comma-separated values. Each line in the file is a row, and each value in the row is separated by a comma.

The parser returns:

```ts
Record<string, string>[]
```

That means an array of objects. Each object represents one CSV row.

The CSV header row becomes the object keys.

Example result:

```ts
[
  {
    id: "0",
    Type: "Sponge",
    Flavor: "Vanilla"
  }
]
```

### How The CSV Parser Works

First, it reads the whole file into a string:

```ts
let rawData = '';
```

This string stores the CSV text before parsing starts.

Then it opens the file:

```ts
const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
```

The file is read as text because the encoding is `utf-8`.

When data arrives from the file, this code runs:

```ts
readStream.on('data', (chunk: string) => {
```

A `chunk` is a piece of the file. The file may arrive all at once, or in pieces.

Inside the `data` event, the parser adds the chunk to `rawData`:

```ts
rawData += chunk;
```

When the file ends, it splits the full CSV text into lines.

The first line is used as the header row:

```ts
const headers = parseCSVLine(lines[0]);
```

Every line after the header becomes one object.

```ts
record[header] = values[headerIndex];
```

The helper function `parseCSVLine` reads one CSV line. It supports:

- normal comma-separated values
- quoted values
- commas inside quoted values
- escaped quotes, like `""`

So this CSV:

```csv
id,Type,Message
1,"Sponge, Cake","He said ""hello"""
```

Becomes this object:

```ts
{
  id: "1",
  Type: "Sponge, Cake",
  Message: "He said \"hello\""
}
```

The parser also checks for CSV problems.

It rejects the promise if:

- the CSV file is empty
- the header row is missing
- a header is empty
- a row has the wrong number of values
- a quoted value is not closed
- the file cannot be read

When there is an error, the parser logs it and rejects the promise:

```ts
reject(error);
```

### CSV Parser Test

Test file:

`tests/csv-parser.test.ts`

The test imports the parser:

```ts
import { parseCSV } from "../src/parsers/csvParser";
```

Then it builds the path to the sample CSV file:

```ts
const filePath = path.join(process.cwd(), "src/data/cake orders.csv");
```

`process.cwd()` means the current project folder. In this project, that is:

`/home/rick/Documents/SEE/SE`

So the full file path points to:

`src/data/cake orders.csv`

Then the test calls the parser:

```ts
const rows = await parseCSV(filePath);
```

Because `parseCSV` returns a promise, the test uses `await`.

The test checks that the first CSV row becomes an object:

```ts
expect(orders[0]).toEqual(expect.objectContaining({
    id: "0",
    Type: "Sponge",
    Flavor: "Vanilla",
    Price: "50",
}));
```

This checks that the parser used the CSV headers as object keys.

So this test proves that:

- The CSV file can be opened.
- The parser returns objects.
- The parser uses headers as object keys.
- The first parsed object has the expected values.

The CSV test file also checks error cases:

- malformed rows
- quoted values
- empty files
- empty headers
- unclosed quotes
- missing files

## JSON Parser

File:

`src/parsers/jsonParser.ts`

Function:

```ts
parseJSON<T = unknown>(filePath: string): Promise<T>
```

This parser reads a JSON file.

JSON is already very close to JavaScript objects, so this parser mainly reads the whole file and then calls:

```ts
JSON.parse(rawData)
```

The parser is generic:

```ts
<T = unknown>
```

That means the caller can tell TypeScript what shape the result should have.

For example, in the test we use:

```ts
parseJSON<BookOrder[]>(filePath)
```

This tells TypeScript:

"The result should be an array of `BookOrder` objects."

### How The JSON Parser Works

First, it creates an empty string:

```ts
let rawData = '';
```

This string will hold the whole JSON file.

Then it opens the file:

```ts
const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
```

When a chunk of text arrives, the parser adds it to `rawData`:

```ts
rawData += chunk;
```

When the file ends, the parser tries to parse the text:

```ts
const parsedData = JSON.parse(rawData) as T;
```

If the JSON is valid, the promise resolves:

```ts
resolve(parsedData);
```

If the JSON is broken, `JSON.parse` throws an error. The parser catches that error, logs it, and rejects the promise.

The parser also rejects the promise if the file cannot be read.

### JSON Parser Test

Test file:

`tests/json-parser.test.ts`

The test starts by creating a small TypeScript type:

```ts
type BookOrder = {
    "Order ID": string;
    "Book Title": string;
    Author: string;
    Price: string;
};
```

This type describes the fields that the test cares about.

It does not need to list every field in the JSON file. It only lists the fields being checked.

Then the test builds the file path:

```ts
const filePath = path.join(process.cwd(), "src/data/book orders.json");
```

Then it parses the file:

```ts
const orders = await parseJSON<BookOrder[]>(filePath);
```

The result is expected to be an array of book orders.

Then the test checks the first order:

```ts
expect(orders[0]).toEqual(expect.objectContaining({
    "Order ID": "2001",
    "Book Title": "Edge of Eternity",
    Author: "Dan Brown",
    Price: "12",
}));
```

`expect.objectContaining` means:

"The object must contain these values, but it is allowed to have more fields too."

This is useful because the real JSON object has more fields than the test needs to check.

So this test proves that:

- The JSON file can be opened.
- The JSON text is valid.
- The parser converts the JSON text into an array.
- The first object has the expected book order data.

## XML Parser

File:

`src/parsers/xmlParser.ts`

Function:

```ts
parseXML<T = unknown>(filePath: string): Promise<T>
```

This parser reads an XML file.

XML is different from JSON. JavaScript cannot parse XML with `JSON.parse`, so this parser uses the `fast-xml-parser` package.

The parser imports:

```ts
import { XMLParser } from 'fast-xml-parser';
```

Then it creates an XML parser:

```ts
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});
```

`ignoreAttributes: false` means XML attributes should be kept.

`attributeNamePrefix: '@_'` means if the XML has attributes, their names will start with `@_` in the parsed object.

For example, an XML attribute like this:

```xml
<row id="1">
```

Could become something like this:

```ts
{
  "@_id": "1"
}
```

The current toy orders XML mainly uses normal tags, not attributes.

### How The XML Parser Works

The XML parser is very similar to the JSON parser.

First, it creates an empty string:

```ts
let rawData = '';
```

Then it opens the file:

```ts
const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
```

When chunks arrive, it adds them to `rawData`:

```ts
rawData += chunk;
```

When the file ends, it creates a new `XMLParser` and parses the raw XML text:

```ts
const parsedData = parser.parse(rawData) as T;
```

Then it resolves the promise with the parsed object:

```tsh
resolve(parsedData);
```

If parsing fails, or if reading the file fails, the parser logs the error and rejects the promise.

### XML Parser Test

Test file:

`tests/xml-parser.test.ts`

The test creates a TypeScript type for the XML result:

```ts
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
```

This matches the structure of the XML file.

The XML file has a root tag called `data`.

Inside `data`, there are many `row` tags.

So after parsing, the result looks like:

```ts
{
  data: {
    row: [
      {
        OrderID: 5001,
        Type: "Plush Toy",
        Brand: "FunTime",
        Price: 247
      }
    ]
  }
}
```

Then the test builds the file path:

```ts
const filePath = path.join(process.cwd(), "src/data/toy orders.xml");
```

Then it parses the file:

```ts
const orders = await parseXML<ToyOrders>(filePath);
```

Then it checks the first toy order:

```ts
expect(orders.data.row[0]).toEqual(expect.objectContaining({
    OrderID: 5001,
    Type: "Plush Toy",
    Brand: "FunTime",
    Price: 247,
}));
```

Again, `expect.objectContaining` means the object can have more fields, but it must contain these fields with these values.

So this test proves that:

- The XML file can be opened.
- The XML parser converts XML into a JavaScript object.
- The root `data` tag is parsed correctly.
- The `row` tags become an array.
- The first toy order has the expected values.

## Why The Tests Use Async And Await

All three parser functions return promises:

```ts
Promise<...>
```

That is because file reading does not finish immediately.

Node.js starts reading the file, then continues running other code. When the file is ready, the promise resolves.

Because of that, the tests are written like this:

```ts
it("should parse a CSV file", async () => {
    const rows = await parseCSV(filePath);
});
```

`async` allows the test to use `await`.

`await` tells Jest:

"Wait for this parser to finish before checking the result."

Without `await`, the test might finish before the file is fully parsed.

## Why The Tests Use Real Data Files

The tests use the real files inside `src/data`:

- `src/data/cake orders.csv`
- `src/data/book orders.json`
- `src/data/toy orders.xml`

This is simple and easy to understand.

It also proves that the parser works with the same sample files used by the project.

The downside is that if those data files change, the tests may need to be updated too.

For this project, that is okay because the tests are meant to stay simple.

## How To Run Only The Parser Tests

You can run only the parser tests with:

```bash
npx jest tests/csv-parser.test.ts tests/json-parser.test.ts tests/xml-parser.test.ts --runInBand --coverage=false
```

This command runs only these three files:

- `tests/csv-parser.test.ts`
- `tests/json-parser.test.ts`
- `tests/xml-parser.test.ts`

The `--coverage=false` part turns off coverage for this run.

That is useful because the full project has coverage rules in `jest.config.ts`, and those rules check all files in `src`.

## Summary

The three parsers all have the same basic goal:

Read a file and return useful JavaScript data.

The CSV parser returns objects built from the CSV headers.

The JSON parser returns objects from JSON text.

The XML parser returns objects from XML text using `fast-xml-parser`.

The three tests are intentionally simple. Each test:

1. Builds the file path.
2. Calls the parser with `await`.
3. Checks a few important values from the parsed result.

This keeps the tests close to the simple style used in `app-clean.test.ts`.
