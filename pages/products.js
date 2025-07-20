'use client'; // Add this at the top for client components
import { useState, useEffect } from 'react';
import { getAllProducts, addProduct } from '@/utils/db';

export default function ProductManagement() {
  // ... rest of your component code
}

// pages/products.js
export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    code: '',
    category: 'wire',
    price: 0,
    hsnCode: '',
    unit: 'meter',
    stock: 0
  });

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      const data = await getAllProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await addProduct(newProduct);
    setProducts(await getAllProducts());
    setNewProduct({
      name: '',
      code: '',
      category: 'wire',
      price: 0,
      hsnCode: '',
      unit: 'meter',
      stock: 0
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Product Inventory</h2>
      
      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Product Name*</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Product Code*</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={newProduct.code}
              onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Category</label>
            <select
              className="w-full p-2 border rounded"
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
            >
              <option value="wire">Wire</option>
              <option value="cable">Cable</option>
              <option value="conduit">Conduit</option>
              <option value="fitting">Fitting</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">HSN Code</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={newProduct.hsnCode}
              onChange={(e) => setNewProduct({...newProduct, hsnCode: e.target.value})}
            />
          </div>
          <div>
            <label className="block mb-1">Price*</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full p-2 border rounded"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Unit</label>
            <select
              className="w-full p-2 border rounded"
              value={newProduct.unit}
              onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
            >
              <option value="meter">Meter</option>
              <option value="roll">Roll</option>
              <option value="piece">Piece</option>
              <option value="kg">Kilogram</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Initial Stock</label>
            <input
              type="number"
              min="0"
              className="w-full p-2 border rounded"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Code</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">HSN</th>
              <th className="px-6 py-3 text-right">Price</th>
              <th className="px-6 py-3 text-right">Stock</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{product.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.hsnCode || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">₹{product.price.toFixed(2)}/{product.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}