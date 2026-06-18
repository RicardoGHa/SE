import { parseCSV } from "./util/parser";
import { CSVCakeMapper } from "./mappers/Cake.mapper";
import logger from "./util/logger";
import { CSVOrderMapper } from "./mappers/Order.mapper";

async function main() {
    const data = await parseCSV("src/data/cake orders.csv");
    const cakeMapper = new CSVCakeMapper();
    data.shift(); // remove header row
    const orderMapper = new CSVOrderMapper(cakeMapper);
    const orders = data.map(row => orderMapper.map(row));
    logger.info("list of Orders: \n %o", orders);
}

main();