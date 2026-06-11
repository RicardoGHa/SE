import fs from 'fs';
import logger from '../util/logger';

export type CSVRecord = Record<string, string>;

const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentValue += '"';
      index++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }

  if (insideQuotes) {
    throw new Error('CSV contains an unclosed quote');
  }

  values.push(currentValue.trim());
  return values;
};

export const parseCSV = (filePath: string): Promise<CSVRecord[]> => {
  return new Promise((resolve, reject) => {
    let rawData = '';
    const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

    readStream.on('data', (chunk: string) => {
      rawData += chunk;
    });

    readStream.on('end', () => {
      try {
        const lines = rawData.split(/\r?\n/).filter(line => line.trim() !== '');

        if (lines.length === 0) {
          throw new Error('CSV file is empty');
        }

        const headers = parseCSVLine(lines[0]);

        if (headers.length === 0 || headers.some(header => header === '')) {
          throw new Error('CSV header row is missing or contains empty headers');
        }

        const results = lines.slice(1).map((line, index) => {
          const values = parseCSVLine(line);
          const lineNumber = index + 2;

          if (values.length !== headers.length) {
            throw new Error(`CSV row ${lineNumber} has ${values.length} values, but expected ${headers.length}`);
          }

          return headers.reduce<CSVRecord>((record, header, headerIndex) => {
            record[header] = values[headerIndex];
            return record;
          }, {});
        });

        resolve(results);
      } catch (error) {
        logger.error('Error while parsing CSV file %s, %o', filePath, error);
        reject(error);
      }
    });

    readStream.on('error', (error) => {
      const readError = new Error(`Unable to read CSV file "${filePath}": ${error.message}`);
      logger.error('Error while reading the stream of file %s, %o', filePath, readError);
      reject(readError);
    });
  });
};