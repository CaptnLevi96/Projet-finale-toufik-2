import { Db, MongoClient } from "mongodb";

type MongoClientUnofficial = MongoClient & {
    topology: {
        isConnected: () => boolean;
    }
}

export type MongoDb = Db | Promise<Db> | null;
// @Desc 
// - MongoDB agent, used to connect to a database
// @Params
//   - url: string 
//     * Connection url
//   - dbName: string
//     * Database name
// @Functions
//   - connect(): Promise<void>
//     * Connects to mongodb
//   - isConnected(): boolean
//     * Checks client connection status
//   - database(): Promise<DbConnection>
//     * Connects to the client and returns a database
export class MongoAgent {
    #db: MongoDb;
    #dbName: string;
    #url: string;
    #client: MongoClientUnofficial;

    constructor(url: string, dbName: string) {
        // Set properties
        this.#url = url;
        this.#dbName = dbName;
        // Start client
        this.#client = new MongoClient(this.#url) as MongoClientUnofficial;
        this.#db = null;
    }

    isConnected() {
        console.log(this.#client.topology)
        return !!this.#client && !!this.#client.topology && this.#client.topology.isConnected();
    }

    async connect() {
        if(this.isConnected()) {
            return 
        }
        await this.#client.connect();
    }

    async database () {
        if (!this.isConnected()) {
            await this.connect();
        }

        if(this.#db instanceof Promise) {
            this.#db = await this.#db
        } else if(!this.#db) {
            this.#db = await this.#client.db(this.#dbName);
        }

        return this.#db;
    }
}
