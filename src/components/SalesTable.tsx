import { Trash2, Edit } from 'lucide-react';
import { SalesEntry } from '../types/sales';

interface SalesTableProps {
  sales: SalesEntry[];
  onDelete: (id: string) => void;
  onEdit: (sale: SalesEntry) => void;
}

export default function SalesTable({ sales, onDelete, onEdit }: SalesTableProps) {
  const formatCurrency = (amount: number) => {
    return `GH₵ ${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (sales.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">No sales entries found for this year.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Client Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Location</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Invoice</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Paid</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Carpenter Disc.</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Marketer Disc.</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Transport</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Installation</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Accessories</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Balance</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.map((sale, index) => (
              <tr
                key={sale.id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-emerald-50 transition`}
              >
                <td className="px-4 py-3 text-sm text-gray-700">{formatDate(sale.date)}</td>
                <td className="px-4 py-3 text-sm text-gray-700 font-medium">{sale.clientName}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{sale.location}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-700 font-medium">
                  {formatCurrency(sale.amountOnInvoice)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-emerald-600 font-medium">
                  {formatCurrency(sale.amountPaid)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-700">
                  {formatCurrency(sale.carpentersDiscount)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-700">
                  {formatCurrency(sale.marketersDiscount)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-700">
                  {formatCurrency(sale.transport)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-700">
                  {formatCurrency(sale.installation)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-700">
                  {formatCurrency(sale.accessories)}
                </td>
                <td className={`px-4 py-3 text-sm text-right font-semibold ${
                  sale.balance > 0 ? 'text-red-600' : sale.balance < 0 ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {formatCurrency(sale.balance)}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => onEdit(sale)}
                      className="text-blue-600 hover:text-blue-800 transition p-1 hover:bg-blue-50 rounded"
                      title="Edit entry"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(sale.id)}
                      className="text-red-600 hover:text-red-800 transition p-1 hover:bg-red-50 rounded"
                      title="Delete entry"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
