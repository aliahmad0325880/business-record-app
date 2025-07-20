'use client'; // Important for client-side functionality

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  addCustomer, 
  getAllCustomers, 
  searchCustomers, 
  getMonthlySummary 
} from '@/utils/db';

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [summary, setSummary] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    amount: '',
    type: 'debit',
    details: ''
  });

  // Load data on component mount
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.replace('/login');
      } else {
        await loadData();
      }
    };
    checkAuthAndLoadData();
  }, []);

  // Load customer data and summary
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [customersData, summaryData] = await Promise.all([
        getAllCustomers(),
        getMonthlySummary()
      ]);
      setCustomers(customersData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle customer search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      await loadData();
      return;
    }
    setIsLoading(true);
    try {
      const results = await searchCustomers(searchQuery);
      setCustomers(results);
    } catch (error) {
      console.error('Error searching:', error);
      alert('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Add new customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.amount) {
      alert('Name and amount are required');
      return;
    }
    
    setIsLoading(true);
    try {
      await addCustomer({
        ...newCustomer,
        amount: parseFloat(newCustomer.amount)
      });
      setNewCustomer({
        name: '',
        amount: '',
        type: 'debit',
        details: ''
      });
      await loadData();
      alert('Customer added successfully!');
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.replace('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Records</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Monthly Summary Cards */}
      {summary && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-3">Monthly Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-3 rounded border border-green-100">
              <p className="text-sm text-gray-500">Income</p>
              <p className="text-2xl font-bold text-green-600">${summary.income.toFixed(2)}</p>
            </div>
            <div className="bg-red-50 p-3 rounded border border-red-100">
              <p className="text-sm text-gray-500">Expense</p>
              <p className="text-2xl font-bold text-red-600">${summary.expense.toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded border border-blue-100">
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-2xl font-bold text-blue-600">{summary.transactions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Customer Form */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Add New Record</h2>
          <form onSubmit={handleAddCustomer} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name*</label>
              <input
                type="text"
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount*</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
                value={newCustomer.amount}
                onChange={(e) => setNewCustomer({...newCustomer, amount: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
              <select
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
                value={newCustomer.type}
                onChange={(e) => setNewCustomer({...newCustomer, type: e.target.value})}
              >
                <option value="debit">Debit (Expense)</option>
                <option value="credit">Credit (Income)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <textarea
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={newCustomer.details}
                onChange={(e) => setNewCustomer({...newCustomer, details: e.target.value})}
                placeholder="Additional notes..."
              />
            </div>
            
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Add Record'}
            </button>
          </form>
        </div>

        {/* Customer Records */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Customer Records</h2>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4 flex">
            <input
              type="text"
              placeholder="Search by name or ID"
              className="border p-2 w-full rounded-l focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-gray-100 px-4 py-2 rounded-r hover:bg-gray-200 transition-colors border border-l-0"
              disabled={isLoading}
            >
              Search
            </button>
          </form>
          
          {/* Records Table */}
          <div className="overflow-x-auto">
            {customers.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">{customer.id}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{customer.name}</td>
                      <td className={`px-4 py-2 whitespace-nowrap font-medium ${
                        customer.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${customer.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          customer.type === 'credit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {customer.type}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {new Date(customer.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No customer records found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}