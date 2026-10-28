export enum FeedCategoryId {
  Livestock = 'livestock',
  Poultry = 'poultry',
  Pigeon = 'pigeon',
  Supplies = 'supplies',
}

export enum StockStatus {
  InStock = 'in_stock',
  LowStock = 'low_stock',
  OutOfStock = 'out_of_stock',
}

export enum PaymentMethod {
  Cash = 'cash',
  CardTerminal = 'card_terminal',
  CheckOrAccount = 'check_account',
}

export enum TransactionStatus {
  CompletedDemo = 'completed_demo',
  VoidedDemo = 'voided_demo',
}

export interface ProductVariant {
  id: string;
  packageSize: string;
  weightLbs?: number;
  sku: string;
  barcode: string;
  samplePrice: number;
}

export interface FeedProduct {
  id: string;
  name: string;
  category: FeedCategoryId;
  feedType: string;
  species: string;
  form: string;
  packageSize: string;
  weightLbs?: number;
  sku: string;
  barcode: string;
  samplePrice: number;
  stockQty: number;
  lowStockThreshold: number;
  image: string;
  imageAlt: string;
  featured: boolean;
  description: string;
  handlingNotes: string;
  variants?: ProductVariant[];
  isSampleData: boolean;
}

export interface CategoryInfo {
  id: FeedCategoryId;
  name: string;
  shortName: string;
  description: string;
  examples: string;
  image: string;
  imageAlt: string;
}

export interface CartItem {
  lineId: string;
  productId: string;
  variantId?: string;
  name: string;
  category: FeedCategoryId;
  packageSize: string;
  sku: string;
  barcode: string;
  sampleUnitPrice: number;
  quantity: number;
  image: string;
}

export interface PreOrderCustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  pickupTimingNote: string;
  orderNotes: string;
}

export interface PreOrderRecord {
  id: string;
  createdAtIso: string;
  customer: PreOrderCustomerDetails;
  items: CartItem[];
  sampleSubtotal: number;
  isDemoSubmission: true;
}

export interface PosTransactionItem {
  productId: string;
  name: string;
  packageSize: string;
  sku: string;
  barcode: string;
  quantity: number;
  sampleUnitPrice: number;
  lineTotal: number;
}

export interface PosTransaction {
  id: string;
  createdAtIso: string;
  items: PosTransactionItem[];
  subtotal: number;
  taxRatePercent: number;
  taxAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashTendered?: number;
  changeDue?: number;
  customerMemo?: string;
  status: TransactionStatus;
  isDemoRecord: true;
}
