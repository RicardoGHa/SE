import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });


export default {
    logDir: process.env.LOG_DIR || "./logs",
    isDev: process.env.NODE_ENV === 'development',
    storagePath: {
        csv: {
            cake: "src/data/cake orders.csv"
        },
        sqlite: "src/data/order.db"
    }

}