// components/InvoiceTemplate.js
export default function InvoiceTemplate({ invoice, businessInfo }) {
  // Calculate totals
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = subtotal * (invoice.taxRate / 100);
  const total = subtotal + taxAmount - invoice.discount;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white">
      {/* Business Header */}
      <div className="flex justify-between items-start mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">{businessInfo.name}</h1>
          <p className="text-gray-700">{businessInfo.address}</p>
          <p className="text-gray-700">GSTIN: {businessInfo.gstin}</p>
          <p className="text-gray-700">Phone: {businessInfo.phone}</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">TAX INVOICE</h2>
          <p className="text-gray-700">No: {invoice.number}</p>
          <p className="text-gray-700">Date: {new Date(invoice.date).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">Billed To:</h3>
          <p>{invoice.customer.name}</p>
          <p>{invoice.customer.address}</p>
          <p>Phone: {invoice.customer.phone}</p>
          {invoice.customer.gstin && <p>GSTIN: {invoice.customer.gstin}</p>}
        </div>
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">Shipping To:</h3>
          <p>{invoice.shippingAddress || invoice.customer.address}</p>
        </div>
      </div>

      {/* Invoice Items Table */}
      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left border">Item</th>
            <th className="p-2 text-left border">HSN/SAC</th>
            <th className="p-2 text-right border">Rate</th>
            <th className="p-2 text-right border">Qty</th>
            <th className="p-2 text-right border">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.hsnCode || '-'}</td>
              <td className="p-2 border text-right">₹{item.price.toFixed(2)}</td>
              <td className="p-2 border text-right">{item.quantity}</td>
              <td className="p-2 border text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="ml-auto w-72">
        <div className="flex justify-between py-1">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>GST ({invoice.taxRate}%):</span>
          <span>₹{taxAmount.toFixed(2)}</span>
        </div>
        {invoice.discount > 0 && (
          <div className="flex justify-between py-1">
            <span>Discount:</span>
            <span>-₹{invoice.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between py-2 font-bold border-t mt-2">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment and Footer */}
      <div className="mt-12 pt-4 border-t">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold mb-2">Payment Information</h4>
            <p>Method: {invoice.paymentMethod}</p>
            <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p>For {businessInfo.name}</p>
            <div className="mt-12">
              <p className="font-bold">Authorized Signature</p>
              <div className="mt-2 border-t w-48 mx-auto"></div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p>Subject to Ahmedabad Jurisdiction</p>
        </div>
      </div>
    </div>
  );
}