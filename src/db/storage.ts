import { openDB } from 'idb';

const DB_NAME = 'fitcal-db';
const STORE_NAME = 'fitcal-store';
const DB_VERSION = 1;

const isIndexedDbAvailable = () => typeof indexedDB !== 'undefined';

const getDb = () =>
  openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });

export const storage = {
  async getItem(key: string) {
    if (!isIndexedDbAvailable()) {
      return localStorage.getItem(key);
    }
    const db = await getDb();
    const value = await db.get(STORE_NAME, key);
    return value ?? null;
  },
  async setItem(key: string, value: string) {
    if (!isIndexedDbAvailable()) {
      localStorage.setItem(key, value);
      return;
    }
    const db = await getDb();
    await db.put(STORE_NAME, value, key);
  },
  async removeItem(key: string) {
    if (!isIndexedDbAvailable()) {
      localStorage.removeItem(key);
      return;
    }
    const db = await getDb();
    await db.delete(STORE_NAME, key);
  },
};
