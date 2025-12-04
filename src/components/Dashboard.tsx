import { useState, useEffect } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { LogOut, Download, Filter } from 'lucide-react';
import { database } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { SalesEntry, YearlySummary } from '../types/sales';
import SalesForm from './SalesForm';
import SalesTable from './SalesTable';
import SummaryCards from './SummaryCards';

export default function Dashboard() {
  const [sales, setSales] = useState<SalesEntry[]>([]);
  const [filteredSales, setFilteredSales] = useState<SalesEntry[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [summary, setSummary] = useState<YearlySummary>({
    totalInvoice: 0,
    totalPaid: 0,
    totalBalance: 0,
    entriesCount: 0
  });
  const [editingSale, setEditingSale] = useState<SalesEntry | null>(null);
  const { signOut} = useAuth();

  useEffect(() => {
    const salesRef = ref(database, 'sales');
    const unsubscribe = onValue(salesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const salesArray: SalesEntry[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<SalesEntry, 'id'>)
        }));
        salesArray.sort((a, b) => b.createdAt - a.createdAt);
        setSales(salesArray);

        const years = [...new Set(salesArray.map(sale => sale.year))].sort((a, b) => b - a);
        setAvailableYears(years);
      } else {
        setSales([]);
        setAvailableYears([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = sales.filter(sale => sale.year === selectedYear);
    setFilteredSales(filtered);

    const newSummary = filtered.reduce(
      (acc, sale) => ({
        totalInvoice: acc.totalInvoice + sale.amountOnInvoice,
        totalPaid: acc.totalPaid + sale.amountPaid,
        totalBalance: acc.totalBalance + sale.balance,
        entriesCount: acc.entriesCount + 1
      }),
      { totalInvoice: 0, totalPaid: 0, totalBalance: 0, entriesCount: 0 }
    );

    setSummary(newSummary);
  }, [sales, selectedYear]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await remove(ref(database, `sales/${id}`));
      } catch (error) {
        console.error('Error deleting sale:', error);
        alert('Failed to delete entry. Please try again.');
      }
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Client Name',
      'Location',
      'Amount on Invoice',
      'Amount Paid',
      'Carpenters Discount',
      'Marketers Discount',
      'Transport',
      'Installation',
      'Accessories',
      'Balance'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredSales.map(sale =>
        [
          sale.date,
          `"${sale.clientName}"`,
          `"${sale.location}"`,
          sale.amountOnInvoice,
          sale.amountPaid,
          sale.carpentersDiscount,
          sale.marketersDiscount,
          sale.transport,
          sale.installation,
          sale.accessories,
          sale.balance
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/Adobe Express - file.png" alt="RichSam Roofing" className="h-12 w-12 object-contain" />
              <h1 className="text-3xl font-bold text-gray-800">Company Sales Record</h1>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <label htmlFor="year-select" className="text-sm font-medium text-gray-700">
              Filter by Year:
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {availableYears.length > 0 ? (
                availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))
              ) : (
                <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
              )}
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={filteredSales.length === 0}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Export to CSV
          </button>
        </div>

        <SummaryCards summary={summary} />
        <SalesForm
          onSuccess={() => setEditingSale(null)}
          editingSale={editingSale}
          onCancelEdit={() => setEditingSale(null)}
        />
        <SalesTable
          sales={filteredSales}
          onDelete={handleDelete}
          onEdit={setEditingSale}
        />
      </main>
    </div>
  );
}
