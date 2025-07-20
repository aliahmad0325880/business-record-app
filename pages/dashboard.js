import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  addCustomer, 
  getCustomers,
  addProduct,
  getProducts,
  createInvoice,
  getDailySummary
} from '@/utils/db';

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [newInvoice, setNewInvoice] = useState({
    customerId: '',
    items: [],
    discount: 0,
    tax: 0,
    paymentMethod: 'cash'
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const [customersData, productsData, summaryData] = await Promise.all([
        getCustomers(),
        getProducts(),
        getDailySummary()
      ]);
      setCustomers(customersData);
      setProducts(productsData);
      setSummary(summaryData);
    };
    loadData();
  }, []);

  // Add new customer
  const handleAddCustomer = async (customerData) => {
    await addCustomer(customerData);
    setCustomers(await getCustomers());
  };

  // Add new product (wire type)
  const handleAddProduct = async (productData) => {
    await addProduct(productData);
    setProducts(await getProducts());
  };

  // Create new invoice
  const handleCreateInvoice = async () => {
    const invoiceId = await createInvoice(newInvoice);
    router.push(`/invoice/${invoiceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AAF Cable & Electrical</h1>
          <button 
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              router.push('/login');
            }}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Navigation Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'customers' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'products' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'invoices' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('invoices')}
          >
            Invoices
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'reports' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Today's Summary</h2>
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded border border-green-100">
                  <p className="text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold">₹{summary.totalSales.toFixed(2)}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded border border-blue-100">
                  <p className="text-gray-600">Invoices</p>
                  <p className="text-2xl font-bold">{summary.invoiceCount}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded border border-purple-100">
                  <p className="text-gray-600">New Customers</p>
                  <p className="text-2xl font-bold">{summary.newCustomers}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded border border-yellow-100">
                  <p className="text-gray-600">Products Sold</p>
                  <p className="text-2xl font-bold">{summary.productsSold}</p>
                </div>
              </div>
            )}
            {/* Recent activity, quick actions, etc. */}
          </div>
        )}

        {activeTab === 'customers' && (
          <CustomerManagement 
            customers={customers} 
            onAddCustomer={handleAddCustomer} 
          />
        )}

        {activeTab === 'products' && (
          <ProductManagement 
            products={products} 
            onAddProduct={handleAddProduct} 
          />
        )}

        {activeTab === 'invoices' && (
          <InvoiceCreation 
            customers={customers}
            products={products}
            invoice={newInvoice}
            onChange={setNewInvoice}
            onCreate={handleCreateInvoice}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsSection />
        )}
      </main>
    </div>
  );
}

// Additional components would be defined here or in separate files
// CustomerManagement, ProductManagement, InvoiceCreation, ReportsSection