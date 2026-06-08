import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });


export default {
    secret: process.env.secret || "default secret"
}