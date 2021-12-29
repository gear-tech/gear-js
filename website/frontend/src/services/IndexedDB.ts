export default class IndexedDBService {
  private dbName: string;

  private dbVersion: number;

  private storeName: string;

  constructor(dbName: string = 'Programs', dbVersion: number = 1, storeName: string = 'list') {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.storeName = storeName;
  }

  public connectDB(callback: (db: IDBDatabase) => void) {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(this.storeName, { keyPath: 'id' });
    };

    request.onsuccess = () => {
      callback(request.result);
    };

    request.onerror = (error) => {
      console.error(error);
    };
  }

  public getStore(db: IDBDatabase) {
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);

    return store;
  }

  public add(db: IDBDatabase, data: any) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(db);
      const request = store.put(data);

      request.onsuccess = () => {
        resolve(`Program added ${data.id}`);
      };

      request.onerror = () => {
        reject(request.result);
      };
    });
  }

  public get(db: IDBDatabase, id?: string) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(db);
      const request = id ? store.get(id) : store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.result);
      };
    });
  }

  public update(db: IDBDatabase) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(db);
      const request = store.openCursor();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.result);
      };
    });
  }
}
