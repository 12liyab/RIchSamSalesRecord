import { TrendingUp, DollarSign, AlertCircle, FileText } from 'lucide-react';
import { YearlySummary } from '../types/sales';

interface SummaryCardsProps {
  summary: YearlySummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const formatCurrency = (amount: number) => {
    return `GH₵ ${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const cards = [
    {
      title: 'Total Invoice Amount',
      value: formatCurrency(summary.totalInvoice),
      icon: FileText,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Total Amount Paid',
      value: formatCurrency(summary.totalPaid),
      icon: DollarSign,
      bgColor: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgLight: 'bg-emerald-50'
    },
    {
      title: 'Balance',
      value: formatCurrency(summary.totalBalance),
      icon: AlertCircle,
      bgColor: 'bg-red-500',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50'
    },
    {
      title: 'Total Entries',
      value: summary.entriesCount.toString(),
      icon: TrendingUp,
      bgColor: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgLight: 'bg-amber-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
            <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
