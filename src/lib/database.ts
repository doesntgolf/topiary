/**
 * IndexedDB shtuffz
 */

export const enum Store {
    Directory = "Directory",
    SavedQueries = "SavedQueries",
    Follows = "Follows",
    Tags = "Tags",
    RemoteDirectories = "RemoteDirectories",
    QueryLog = "QueryLog",
    ErrorLog = "ErrorLog",
    Keyval = "Keyval", // for one-time objects like preferences
}

/**
 * This is adapted from idb-keyval.
 * 
 * @TODO add link and copyright notice for idb-keyval
 */
export class IDB {
    readonly _dbp: Promise<IDBDatabase>;

    constructor() {
        this._dbp = new Promise((resolve, reject) => {
            const request = indexedDB.open("topiary", 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = request.result;

                // Note: don't break out of the case statements;
                // the fallthrough behavior is what we want.
                switch(event.oldVersion) {
                    case 0:
                        const directory = db.createObjectStore(Store.Directory, {keyPath: ["id.key", "id.directory_key"]});
                        directory.createIndex("terms", "terms", {multiEntry: true, unique: false});

                        db.createObjectStore(Store.SavedQueries, {keyPath: "name"});
                        db.createObjectStore(Store.Follows, {keyPath: "name"});
                        const tags = db.createObjectStore(Store.Tags, {keyPath: "text"});
                        tags.createIndex("terms", "terms", {multiEntry: true, unique: false});

                        db.createObjectStore(Store.RemoteDirectories, {keyPath: "url"});
                        db.createObjectStore(Store.QueryLog, {autoIncrement: true});
                        db.createObjectStore(Store.ErrorLog, {autoIncrement: true});
                        db.createObjectStore(Store.Keyval);
                }
            }
        });
    }

    open(stores: Array<Store>, type: IDBTransactionMode, callback: ((transaction: IDBTransaction) => void)): Promise<void> {
        return this._dbp.then(db => new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(stores, type);
            transaction.oncomplete = () => resolve();
            transaction.onabort = transaction.onerror = () => reject(transaction.error);
            callback(transaction);
        }));
    }
}

/** 
let req: IDBRequest;
new DB().open(Store.Directory, "readonly", store => {
    req = store.get("key");
})
.then(() => req.result)
.catch(() => req.error)
*/