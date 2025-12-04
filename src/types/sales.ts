export interface SalesEntry {
  id: string;
  date: string;
  clientName: string;
  location: string;
  amountOnInvoice: number;
  amountPaid: number;
  carpentersDiscount: number;
  marketersDiscount: number;
  transport: number;
  installation: number;
  accessories: number;
  balance: number;
  year: number;
  createdAt: number;
}

export interface YearlySummary {
  totalInvoice: number;
  totalPaid: number;
  totalBalance: number;
  entriesCount: number;
}

export interface MarketerPerformance {
  marketerName: string;
  totalSales: number;
  totalDiscount: number;
  salesCount: number;
}
