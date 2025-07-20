// Enhanced for electrical business
const DB_VERSION = 3;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('WireBusinessDB', DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Customers (enhanced with electrical business fields)
      if (!db.objectStoreNames.contains('customers')) {
        const store = db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('phone', 'phone', { unique: true });
        store.createIndex('gstin', 'gstin', { unique: false });
      }

      // Products (wire types and electrical items)
      if (!db.objectStoreNames.contains('products')) {
        const store = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
        store.createIndex('name', 'name', { unique: true });
        store.createIndex('code', 'code', { unique: true });
        store.createIndex('category', 'category', { unique: false });
      }

      // Invoices (professional format)
      if (!db.objectStoreNames.contains('invoices')) {
        const store = db.createObjectStore('invoices', { keyPath: 'id', autoIncrement: true });
        store.createIndex('number', 'number', { unique: true });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('customer', 'customerId', { unique: false });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};