//index import path from 'path';
import { parseCSV } from './parsers/csvParser';
import { parseJSON } from './parsers/jsonParser';
import { parseXML } from './parsers/xmlParser';
import logger from './util/logger';


// const dataDir = path.resolve(__dirname, './data');

interface ToyOrdersXml {
  data: {
    row: Record<string, string | number>[];
  };
}

async function main() {
  try {
    const [cakeOrders, bookOrders, toyOrdersData] = await Promise.all([
        parseCSV('src/data/cake orders.csv'),
        parseJSON<Record<string, string>[]>('src/data/book orders.json'),
        parseXML<ToyOrdersXml>('src/data/toy orders.xml'),
      ]);

    const toyOrders = toyOrdersData.data.row;

    logger.info('Cake orders (CSV): %d rows', cakeOrders.length);
    for (const order of cakeOrders) {
      logger.info('%o', order);
    }

    logger.info('Book orders (JSON): %d rows', bookOrders.length);
    for (const order of bookOrders) {
      logger.info('%o', order);
    }

    logger.info('Toy orders (XML): %d rows', toyOrders.length);
    for (const order of toyOrders) {
      logger.info('%o', order);
    }
  } catch (error) {
    logger.error(error);
  }
}
main();
