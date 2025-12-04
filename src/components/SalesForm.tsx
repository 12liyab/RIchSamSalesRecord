import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { ref, push } from 'firebase/database';
import { database } from '../firebase/config';
import { SalesEntry } from '../types/sales';

interface SalesFormProps {
  onSuccess: () => void;
}

export default function SalesForm({ onSuccess }: SalesFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    location: '',
    amountOnInvoice: '',
    amountPaid: '',
    carpentersDiscount: '',
    marketersDiscount: '',
    transport: '',
    installation: '',
    accessories: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amountOnInvoice = parseFloat(formData.amountOnInvoice) || 0;
      const amountPaid = parseFloat(formData.amountPaid) || 0;
      const balance = amountOnInvoice - amountPaid;
      const year = new Date(formData.date).getFullYear();

      const entry: Omit<SalesEntry, 'id'> = {
        date: formData.date,
        clientName: formData.clientName,
        location: formData.location,
        amountOnInvoice,
        amountPaid,
        carpentersDiscount: parseFloat(formData.carpentersDiscount) || 0,
        marketersDiscount: parseFloat(formData.marketersDiscount) || 0,
        transport: parseFloat(formData.transport) || 0,
        installation: parseFloat(formData.installation) || 0,
        accessories: parseFloat(formData.accessories) || 0,
        balance,
        year,
        createdAt: Date.now()
      };

      await push(ref(database, 'sales'), entry);

      setFormData({
        date: new Date().toISOString().split('T')[0],
        clientName: '',
        location: '',
        amountOnInvoice: '',
        amountPaid: '',
        carpentersDiscount: '',
        marketersDiscount: '',
        transport: '',
        installation: '',
        accessories: ''
      });

      onSuccess();
    } catch (error) {
      console.error('Error adding sale:', error);
      alert('Failed to add sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <PlusCircle className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-800">Add New Sale</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Name
          </label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount on Invoice (GH₵)
          </label>
          <input
            type="number"
            step="0.01"
            name="amountOnInvoice"
            value={formData.amountOnInvoice}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount Paid (GH₵)
          </label>
          <input
            type="number"
            step="0.01"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carpenters Discount (GH₵)
          </label>
          <input
            type="number"
            step="0.01"
            name="carpentersDiscount"
            value={formData.carpentersDiscount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marketers Discount (GH₵)
          </label>
          <input
            type="number"
            step="0.01"
            name="marketersDiscount"
            value={formData.marketersDiscount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transport (GH₵)
          </label>
          <input
            type="number"
            step="0.01"
            name="transport"
            value={formData.transport}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Installation (GH₵)
          </label>
          <input
            type="number"
            step="0.01"
            name="installation"
            value={formData.installation}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Accessories (GH₵)
          </label>
          <input
            type="number"
            step="0.01"
            name="accessories"
            value={formData.accessories}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding Sale...' : 'Add Sale'}
      </button>
    </form>
  );
}
