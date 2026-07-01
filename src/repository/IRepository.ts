export type id = string;
export interface ID{
    getId(): id;
}

export interface Initializable {
    /**
     * Initialize repository resources.
     * Creates required tables and establishes a connection.
     * Throws an InitializationException on failure.
     */
    init(): Promise<void>;
}

export interface IRepository<T extends ID> {
    create(item: T): Promise<id>;

    // Throw an error if item not found
    get(id: id): Promise<T>;
    getAll(): Promise<T[]>;
    // Throw item not found || invalid item
    update(item: T): Promise<void>;
    // Throw item not found
    delete(id: id): Promise<void>;
}

export interface InitializableRepository<T extends ID> extends IRepository<T>, Initializable  {}