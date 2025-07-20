export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CustomerDB', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('customers')) {
        const store = db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('date', 'date', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject('Error opening database');
    };
  });
};

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

export const getAllCustomers = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['customers'], 'readonly');
    const store = transaction.objectStore('customers');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Error fetching customers');
  });
};

export const searchCustomers = async (query) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['customers'], 'readonly');
    const store = transaction.objectStore('customers');
    const request = store.getAll();

    request.onsuccess = () => {
      const results = request.result.filter(customer => 
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.id.toString().includes(query)
      );
      resolve(results);
    };
    request.onerror = () => reject('Error searching customers');
  });
};

export const getMonthlySummary = async () => {
  const customers = await getAllCustomers();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyData = customers.filter(customer => {
    const date = new Date(customer.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const summary = {
    income: 0,
    expense: 0,
    transactions: monthlyData.length
  };

  monthlyData.forEach(customer => {
    if (customer.type === 'credit') {
      summary.income += customer.amount;
    } else {
      summary.expense += customer.amount;
    }
  });

  return summary;
};