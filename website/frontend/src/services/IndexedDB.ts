import { ProgramModel } from 'types/program';

export default class IndexedDBService {
  private dbName: string;

  private dbVersion: number;

  private storeName: string;

  constructor(dbName: string = 'Programs', dbVersion: number = 1, storeName: string = 'list') {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.storeName = storeName;
  }

  public connectDB(callback: (db: any) => void) {
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

  public add(db: IDBDatabase, data: ProgramModel) {
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    const addRequest = store.put(data);

    return addRequest;
  }

  public get(db: IDBDatabase) {
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    const getRequest = store.getAll();

    return getRequest;
  }
}
