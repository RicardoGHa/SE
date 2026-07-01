import { CSVCakeMapper } from "../../mappers/Cake.mapper";
import { CSVOrderMapper } from "../../mappers/Order.mapper";
import { IOrder } from "../../model/IOrder";
import { DbException } from "../../util/exceptions/repositoryException";
import { parseCSV, writeCSVFile } from "../../util/parser";
import { OrderRepository } from "./Order.repository"

export class CakeOrderRepository extends OrderRepository {
    private mapper = new CSVOrderMapper(new CSVCakeMapper())
    constructor(private readonly filePath: string) {
        super();
    }
    protected async load(): Promise<IOrder[]> {

        try {
            // read 2d strings from file
            const csv = await parseCSV(this.filePath)
            const rows = csv.slice(1);
            return rows.map(this.mapper.map.bind(this.mapper))

        } catch (error: unknown) {
            throw new DbException(" Failed to load orders", error as Error)
        }


        //return the last of objects
    }
    protected async save(orders: IOrder[]): Promise<void> {
        try {
            const header = [
                "id", "Type", "Flavor", "Filling", "Size", "Layers",
                "Frosting Type", "Frosting Flavor", "Decoration Type",
                "Decoration Color", "Custom Message", "Shape", "Allergies",
                "Special Ingredients", "Packaging Type", "Price", "Quantity"
            ];
            //convert the orders to 2d strings

            const rawItems = orders.map(this.mapper.reverseMap.bind(this.mapper));
            //pasrse.write
            await writeCSVFile(this.filePath, [header, ...rawItems])

        } catch (error: unknown) {
            throw new DbException(" Failed to load orders", error as Error)
        }
    }

    //generate the list of headers

}



