export class ItemsNotFoundException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ItemsNotFoundException";
    }
}

export class InvalidItemException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidItemException";
    }
}