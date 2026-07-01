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

export class InitalizationException extends Error {
    constructor(message: string, error: Error) {
        super(message);
        this.name = "InitalizationException";
        this.stack = error.stack;
        this.message = `${message}: ${error.message}`;
    }
}

export class DbException extends Error {
    constructor(message: string, error: Error) {
        super(message);
        this.name = "DbException";
        this.stack = error.stack;
        this.message = `${message}: ${error.message}`;
    }
}

