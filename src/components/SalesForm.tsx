import { useState, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { ref, push, update } from 'firebase/database';
import { database } from '../firebase/config';
import { SalesEntry } from '../types/sales';

interface SalesFormProps {
  onSuccess: () => void;
  editingSale?: SalesEntry | null;
  onCancelEdit?: () => void;
}

export default function SalesForm({ onSuccess, editingSale, onCancelEdit }: SalesFormProps) {
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

  useEffect(() => {
    if (editingSale) {
      setFormData({
        date: editingSale.date,
        clientName: editingSale.clientName,
        location: editingSale.location,
        amountOnInvoice: editingSale.amountOnInvoice.toString(),
        amountPaid: editingSale.amountPaid.toString(),
        carpentersDiscount: editingSale.carpentersDiscount.toString(),
        marketersDiscount: editingSale.marketersDiscount.toString(),
        transport: editingSale.transport.toString(),
        installation: editingSale.installation.toString(),
        accessories: editingSale.accessories.toString()
      });
    }
  }, [editingSale]);

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
      const totalDeductions =
        (parseFloat(formData.carpentersDiscount) || 0) +
        (parseFloat(formData.marketersDiscount) || 0) +
        (parseFloat(formData.transport) || 0) +
        (parseFloat(formData.installation) || 0) +
        (parseFloat(formData.accessories) || 0);
      const balance = amountPaid - totalDeductions;
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

      if (editingSale) {
        await update(ref(database, `sales/${editingSale.id}`), entry);
      } else {
        await push(ref(database, 'sales'), entry);
      }

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
      console.error('Error saving sale:', error);
      alert('Failed to save sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
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
    onCancelEdit?.();
  };

  return (
    <form onSubmit={handleSubmit} className={`rounded-xl shadow-lg p-6 mb-6 ${editingSale ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white'}`}>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <PlusCircle className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {editingSale ? 'Edit Sale' : 'Add New Sale'}
          </h2>
        </div>
        {editingSale && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 p-1"
            title="Cancel editing"
          >
            <X className="w-6 h-6" />
          </button>
        )}
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

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (editingSale ? 'Updating Sale...' : 'Adding Sale...') : (editingSale ? 'Update Sale' : 'Add Sale')}
        </button>
        {editingSale && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
