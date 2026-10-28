import { StockStatus } from '../types/store';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatUSD(amount: number): string {
  if (!Number.isFinite(amount)) {
    return '$0.00';
  }
  return usdFormatter.format(amount);
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function getStockStatus(stockQty: number, lowStockThreshold: number): StockStatus {
  if (stockQty <= 0) {
    return StockStatus.OutOfStock;
  }
  if (stockQty <= lowStockThreshold) {
    return StockStatus.LowStock;
  }
  return StockStatus.InStock;
}

export function getStockStatusLabel(status: StockStatus, stockQty?: number): string {
  const countSuffix = typeof stockQty === 'number' ? ` (${stockQty})` : '';
  switch (status) {
    case StockStatus.InStock:
      return `In Stock${countSuffix}`;
    case StockStatus.LowStock:
      return `Low Stock${countSuffix}`;
    case StockStatus.OutOfStock:
      return 'Out of Stock (0)';
  }
}
