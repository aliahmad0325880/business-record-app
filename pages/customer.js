// pages/customer.js
import { openDB } from 'idb';
import { useEffect, useState } from 'react';

export default function CustomerPage() {
  const [db, setDb] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      const db = await openDB('customer-db', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('customers')) {
            db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
          }
        },
      });
      setDb(db);
      const all = await db.getAll('customers');
      setCustomers(all);
    };

    initDB();
  }, []);

  // Add a new customer
  const handleAdd = async () => {
    if (!name || !balance) return;
    const newCustomer = { name, balance: parseFloat(balance) };
    await db.add('customers', newCustomer);
    const all = await db.getAll('customers');
    setCustomers(all);
    setName('');
    setBalance('');
  };

  // Search
  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
      
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          className="border p-2 w-full"
        />
        <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded">
          Add Customer
        </button>
      </div>

      <input
        type="text"
        placeholder="Search Customers"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <div className="space-y-2">
        {filtered.map((cust) => (
          <div key={cust.id} className="border p-2">
            <p><strong>Name:</strong> {cust.name}</p>
            <p><strong>Balance:</strong> Rs. {cust.balance}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
