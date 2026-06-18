import { Item, ItemCategory } from "./item.model";

export class Book implements Item {
    getCategory():ItemCategory {
        return ItemCategory.BOOK;
}
    private title: string;
    private author: string;
    private genre: string;
    private format: string;
    private language: string;
    private publisher: string;
    private specialEdition: string;
    private packaging: string;
    private price: number;
    private quantity: number;

    constructor(title: string, author: string, genre: string, format: string, language: string, publisher: string, specialEdition: string, packaging: string, price: number, quantity: number) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.format = format;
        this.language = language;
        this.publisher = publisher;
        this.specialEdition = specialEdition;
        this.packaging = packaging;
        this.price = price;
        this.quantity = quantity;
    }
    getTitle():string {
        return this.title;
    }
    getAuthor():string {
        return this.author;
    }
    getGenre():string {
        return this.genre;
    }
    getFormat():string {
        return this.format;
    }
    getLanguage():string {
        return this.language;
    }
    getPublisher():string {
        return this.publisher;
    }
    getSpecialEdition():string {
        return this.specialEdition;
    }
    getPackaging():string {
        return this.packaging;
    }
    getPrice():number {
        return this.price;
    }
    getQuantity():number {
        return this.quantity;
    }
}