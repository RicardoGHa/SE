import logger from "../../util/logger";
import { Cake, IdentifiableCake } from "../Cake.model";

export class CakeBuilder {
    private type!: string;
    private flavor!: string;
    private filling!: string;
    private size!: number;
    private layers!: number;
    private frostingType!: string;
    private frostingFlavor!: string;
    private decorationType!: string;
    private decorationColor!: string;
    private customMessage!: string;
    private shape!: string;
    private allergies!: string;
    private specialIngredients!: string;
    private packagingType!: string;

    public static newBuilder(): CakeBuilder {
        return new CakeBuilder();
    }

    setType(type: string): CakeBuilder {
        this.type = type;
        return this;
    }
    setFlavor(flavor: string): CakeBuilder {
        this.flavor = flavor;
        return this;
    }
    setFilling(filling: string): CakeBuilder {
        this.filling = filling;
        return this;
    }
    setSize(size: number): CakeBuilder {
        this.size = size;
        return this;
    }
    setLayers(layers: number): CakeBuilder {
        this.layers = layers;
        return this;
    }
    setFrostingType(frostingType: string): CakeBuilder {
        this.frostingType = frostingType;
        return this;
    }
    setFrostingFlavor(frostingFlavor: string): CakeBuilder {
        this.frostingFlavor = frostingFlavor;
        return this;
    }
    setDecorationType(decorationType: string): CakeBuilder {
        this.decorationType = decorationType;
        return this;
    }
    setDecorationColor(decorationColor: string): CakeBuilder {
        this.decorationColor = decorationColor;
        return this;
    }
    setCustomMessage(customMessage: string): CakeBuilder {
        this.customMessage = customMessage;
        return this;
    }
    setShape(shape: string): CakeBuilder {
        this.shape = shape;
        return this;
    }
    setAllergies(allergies: string): CakeBuilder {
        this.allergies = allergies;
        return this;
    }
    setSpecialIngredients(specialIngredients: string): CakeBuilder {
        this.specialIngredients = specialIngredients;
        return this;
    }
    setPackagingType(packagingType: string): CakeBuilder {
        this.packagingType = packagingType;
        return this;
    }
    build(): Cake {
        const requiredProperties = [
            this.type,
            this.flavor,
            this.filling,
            this.size,
            this.layers,
            this.frostingType,
            this.frostingFlavor,
            this.decorationType,
            this.decorationColor,
            this.shape,
            this.allergies,
            this.specialIngredients,
            this.packagingType
        ];
        for (const property of requiredProperties) {
            if (property === undefined || property === null || property === "") {
                console.error('Required properties are missing, you cant build a cake');
                throw new Error('Required properties are missing');
            }
        }
        if (Number.isNaN(this.size) || Number.isNaN(this.layers)) {
            console.error('Cake size and layers must be valid numbers');
            throw new Error('Cake size and layers must be valid numbers');
        }
        return new Cake(
            this.type,
            this.flavor,
            this.filling,
            this.size,
            this.layers,
            this.frostingType,
            this.frostingFlavor,
            this.decorationType,
            this.decorationColor,
            this.customMessage,
            this.shape, this.allergies,
            this.specialIngredients,
            this.packagingType);
    }
}

export class IdentifaibleCakeBuilder {
    private id!: string;
    private cake!: Cake;

    static newBuilder(): IdentifaibleCakeBuilder {
        return new IdentifaibleCakeBuilder
    }
    
    setId(id: string): IdentifaibleCakeBuilder {
        this.id = id;
        return this;
    }
    setCake(cake: Cake): IdentifaibleCakeBuilder {
        this.cake = cake;
        return this;
    }

    build(): IdentifiableCake {
        if (!this.id || !this.cake){
            logger.error("Missing required properties, could not build an identifiable cake");
            throw new Error("Missing required properties")
        }
        return new IdentifiableCake(
            this.id,
            this.cake.getType(),
            this.cake.getFlavor(),
            this.cake.getFilling(),
            this.cake.getSize(),
            this.cake.getLayers(),
            this.cake.getFrostingType(),
            this.cake.getFrostingFlavor(),
            this.cake.getDecorationType(),
            this.cake.getDecorationColor(),
            this.cake.getCustomMessage(),
            this.cake.getShape(),
            this.cake.getAllergies(),
            this.cake.getSpecialIngredients(),
            this.cake.getPackagingType()
        );
    }
}