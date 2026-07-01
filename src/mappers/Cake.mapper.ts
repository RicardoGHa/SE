import { IMapper } from "./IMapper";
import { Cake, IdentifiableCake } from "../model/Cake.model";
import { CakeBuilder, IdentifaibleCakeBuilder } from "../model/builders/Cake.builder";

export class CSVCakeMapper implements IMapper<string[], Cake> {
    map(data: string[]): Cake {
        return CakeBuilder.newBuilder()
            .setType(data[1])
            .setFlavor(data[2])
            .setFilling(data[3])
            .setSize(parseInt(data[4]))
            .setLayers(parseInt(data[5]))
            .setFrostingType(data[6])
            .setFrostingFlavor(data[7])
            .setDecorationType(data[8])
            .setDecorationColor(data[9])
            .setCustomMessage(data[10])
            .setShape(data[11])
            .setAllergies(data[12])
            .setSpecialIngredients(data[13])
            .setPackagingType(data[14])
            .build();

    }
    reverseMap(data: Cake): string[] {
        return [
            data.getType(),
            data.getFlavor(),
            data.getFilling(),
            data.getSize().toString(),
            data.getLayers().toString(),
            data.getFrostingType(),
            data.getFrostingFlavor(),
            data.getDecorationType(),
            data.getDecorationColor(),
            data.getCustomMessage(),
            data.getShape(),
            data.getAllergies(),
            data.getSpecialIngredients(),
            data.getPackagingType(),
        ]
    }
}

export interface SQLiteCake {
    id: string;
    type: string;
    flavor: string;
    filling: string;
    size: number;
    layers: number;
    frostingType: string;
    frostingFlavor: string;
    decorationType: string;
    decorationColor: string;
    customMessage: string;
    shape: string;
    allergies: string;
    specialIngredients: string;
    packagingType: string;
}

export class SQLiteCakeMapper implements IMapper<SQLiteCake, IdentifiableCake> {
    map(data: SQLiteCake): IdentifiableCake {
        return IdentifaibleCakeBuilder
            .newBuilder()
            .setId(data.id)
            .setCake(
                CakeBuilder.newBuilder()
                    .setType(data.type)
                    .setFlavor(data.flavor)
                    .setFilling(data.filling)
                    .setSize(data.size)
                    .setLayers(data.layers)
                    .setFrostingType(data.frostingType)
                    .setFrostingFlavor(data.frostingFlavor)
                    .setDecorationType(data.decorationType)
                    .setDecorationColor(data.decorationColor)
                    .setCustomMessage(data.customMessage)
                    .setShape(data.shape)
                    .setAllergies(data.allergies)
                    .setSpecialIngredients(data.specialIngredients)
                    .setPackagingType(data.packagingType)
                    .build()
            )
            .build();
    }

    reverseMap(data: IdentifiableCake): SQLiteCake {


        return {
            id: data.getId(),
            type: data.getType(),
            flavor: data.getFlavor(),
            filling: data.getFilling(),
            size: data.getSize(),
            layers: data.getLayers(),
            frostingType: data.getFrostingType(),
            frostingFlavor: data.getFrostingFlavor(),
            decorationType: data.getDecorationType(),
            decorationColor: data.getDecorationColor(),
            customMessage: data.getCustomMessage(),
            shape: data.getShape(),
            allergies: data.getAllergies(),
            specialIngredients: data.getSpecialIngredients(),
            packagingType: data.getPackagingType(),
        };
    }
}