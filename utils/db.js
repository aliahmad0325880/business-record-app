// utils/db.js
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject('IndexedDB not supported');
      return;
    }

    const request = indexedDB.open('CustomerDB', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('customers')) {
        const store = db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('date', 'date', { unique: false });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject('Error opening database');
  });
};

// Add all other database functions here (same as before)
export const addCustomer = async (customer) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['customers'], 'readwrite');
    const store = transaction.objectStore('customers');
    const request = store.add({
      ...customer,
      date: new Date().toISOString()
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject('Error adding customer');
  });
};

// Include all other functions from the original implementation...