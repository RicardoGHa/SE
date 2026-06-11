
import path from 'path';
import {parseCSV} from './util/parser'
import logger from './util/logger';

const filePath = path.resolve(__dirname, './data/cake orders.csv');

async function main() {
    try {
        const products = await parseCSV(filePath)
        for (const product of products) {
            logger.info(product + '\n');
        }
    } catch(error) {
        logger.error(error)
    }
}

main();