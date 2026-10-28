import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_DEMO_TRANSACTIONS,
  INITIAL_SAMPLE_PRODUCTS,
  STORE_INFO,
} from '../data/products';
import { STORE_IMAGES } from '../data/images';
import {
  CartItem,
  FeedCategoryId,
  FeedProduct,
  PaymentMethod,
  PosTransaction,
  PreOrderCustomerDetails,
  PreOrderRecord,
  ProductVariant,
  TransactionStatus,
} from '../types/store';

const STORAGE_KEYS = {
  products: 'santos_feed_demo_products_v1',
  preOrderCart: 'santos_feed_demo_preorder_cart_v1',
  preOrders: 'santos_feed_demo_preorders_v1',
  posCart: 'santos_feed_demo_pos_cart_v1',
  posTransactions: 'santos_feed_demo_pos_tx_v1',
  posTaxEnabled: 'santos_feed_demo_pos_tax_enabled_v1',
  posTaxRate: 'santos_feed_demo_pos_tax_rate_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors in restricted iframe contexts
  }
}

export interface BarcodeLookupResult {
  matched: boolean;
  product?: FeedProduct;
  variant?: ProductVariant;
  addedItem?: CartItem;
  newQuantity?: number;
  message: string;
}

export interface NewProductInput {
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
  description: string;
  handlingNotes: string;
}

interface StoreContextValue {
  products: FeedProduct[];
  preOrderCart: CartItem[];
  preOrderCount: number;
  preOrderSubtotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToPreOrder: (
    product: FeedProduct,
    quantity?: number,
    variant?: ProductVariant,
    openDrawer?: boolean
  ) => void;
  updatePreOrderQty: (lineId: string, quantity: number) => void;
  removeFromPreOrder: (lineId: string) => void;
  clearPreOrder: () => void;
  submittedPreOrders: PreOrderRecord[];
  submitDemoPreOrder: (customer: PreOrderCustomerDetails) => PreOrderRecord;

  // POS Register state
  posCart: CartItem[];
  posItemCount: number;
  posSubtotal: number;
  taxEnabled: boolean;
  setTaxEnabled: (enabled: boolean) => void;
  taxRatePercent: number;
  setTaxRatePercent: (rate: number) => void;
  posTaxAmount: number;
  posTotal: number;
  lastScannedLineId: string | null;
  scanOrAddByBarcode: (rawCode: string) => BarcodeLookupResult;
  addToPosCart: (product: FeedProduct, variant?: ProductVariant, quantity?: number) => void;
  updatePosQty: (lineId: string, quantity: number) => void;
  removeFromPosCart: (lineId: string) => void;
  clearPosCart: () => void;
  completeDemoPosSale: (params: {
    paymentMethod: PaymentMethod;
    cashTendered?: number;
    customerMemo?: string;
  }) => PosTransaction;

  // Inventory & History management
  posTransactions: PosTransaction[];
  voidDemoTransaction: (txId: string) => void;
  addSampleProduct: (input: NewProductInput) => FeedProduct;
  updateSampleProduct: (productId: string, updates: Partial<FeedProduct>) => void;
  adjustProductStock: (productId: string, newStockQty: number) => void;
  resetAllDemoData: () => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function getDefaultCategoryImage(category: FeedCategoryId): string {
  switch (category) {
    case FeedCategoryId.Livestock:
      return STORE_IMAGES.livestockFeedPellets;
    case FeedCategoryId.Poultry:
      return STORE_IMAGES.poultryLayerGrain;
    case FeedCategoryId.Pigeon:
      return STORE_IMAGES.pigeonGrainMix;
    case FeedCategoryId.Supplies:
      return STORE_IMAGES.farmGrainSupplies;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<FeedProduct[]>(() => {
    const saved = readStorage<FeedProduct[] | null>(STORAGE_KEYS.products, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      return INITIAL_SAMPLE_PRODUCTS;
    }
    // Refresh bundled image URLs so asset hashes never go stale across builds
    return saved.map((item) => {
      const seedMatch = INITIAL_SAMPLE_PRODUCTS.find((p) => p.id === item.id);
      return {
        ...item,
        image: seedMatch ? seedMatch.image : getDefaultCategoryImage(item.category),
      };
    });
  });

  const [preOrderCart, setPreOrderCart] = useState<CartItem[]>(() =>
    readStorage<CartItem[]>(STORAGE_KEYS.preOrderCart, [])
  );
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [submittedPreOrders, setSubmittedPreOrders] = useState<PreOrderRecord[]>(() =>
    readStorage<PreOrderRecord[]>(STORAGE_KEYS.preOrders, [])
  );

  const [posCart, setPosCart] = useState<CartItem[]>(() =>
    readStorage<CartItem[]>(STORAGE_KEYS.posCart, [])
  );
  const [posTransactions, setPosTransactions] = useState<PosTransaction[]>(() =>
    readStorage<PosTransaction[]>(STORAGE_KEYS.posTransactions, INITIAL_DEMO_TRANSACTIONS)
  );
  const [taxEnabled, setTaxEnabled] = useState<boolean>(() =>
    readStorage<boolean>(STORAGE_KEYS.posTaxEnabled, true)
  );
  const [taxRatePercent, setTaxRatePercent] = useState<number>(() =>
    readStorage<number>(STORAGE_KEYS.posTaxRate, STORE_INFO.defaultDemoTaxRatePercent)
  );
  const [lastScannedLineId, setLastScannedLineId] = useState<string | null>(null);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.products, products);
  }, [products]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.preOrderCart, preOrderCart);
  }, [preOrderCart]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.preOrders, submittedPreOrders);
  }, [submittedPreOrders]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.posCart, posCart);
  }, [posCart]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.posTransactions, posTransactions);
  }, [posTransactions]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.posTaxEnabled, taxEnabled);
  }, [taxEnabled]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.posTaxRate, taxRatePercent);
  }, [taxRatePercent]);

  const addToPreOrder = (
    product: FeedProduct,
    quantity = 1,
    variant?: ProductVariant,
    openDrawer = true
  ) => {
    const safeQty = Math.max(1, Math.floor(quantity));
    const chosenVariant = variant ?? product.variants?.[0];
    const lineId = chosenVariant ? `${product.id}::${chosenVariant.id}` : product.id;
    const packageSize = chosenVariant ? chosenVariant.packageSize : product.packageSize;
    const sku = chosenVariant ? chosenVariant.sku : product.sku;
    const barcode = chosenVariant ? chosenVariant.barcode : product.barcode;
    const sampleUnitPrice = chosenVariant ? chosenVariant.samplePrice : product.samplePrice;

    setPreOrderCart((prev) => {
      const existing = prev.find((item) => item.lineId === lineId);
      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId ? { ...item, quantity: item.quantity + safeQty } : item
        );
      }
      return [
        ...prev,
        {
          lineId,
          productId: product.id,
          variantId: chosenVariant?.id,
          name: product.name,
          category: product.category,
          packageSize,
          sku,
          barcode,
          sampleUnitPrice,
          quantity: safeQty,
          image: product.image,
        },
      ];
    });

    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const updatePreOrderQty = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      setPreOrderCart((prev) => prev.filter((item) => item.lineId !== lineId));
      return;
    }
    const safeQty = Math.min(999, Math.floor(quantity));
    setPreOrderCart((prev) =>
      prev.map((item) => (item.lineId === lineId ? { ...item, quantity: safeQty } : item))
    );
  };

  const removeFromPreOrder = (lineId: string) => {
    setPreOrderCart((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  const clearPreOrder = () => {
    setPreOrderCart([]);
  };

  const preOrderCount = useMemo(
    () => preOrderCart.reduce((acc, item) => acc + item.quantity, 0),
    [preOrderCart]
  );

  const preOrderSubtotal = useMemo(
    () =>
      Math.round(
        preOrderCart.reduce((acc, item) => acc + item.sampleUnitPrice * item.quantity, 0) * 100
      ) / 100,
    [preOrderCart]
  );

  const submitDemoPreOrder = (customer: PreOrderCustomerDetails): PreOrderRecord => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const record: PreOrderRecord = {
      id: `DEMO-PO-${randomSuffix}`,
      createdAtIso: new Date().toISOString(),
      customer,
      items: [...preOrderCart],
      sampleSubtotal: preOrderSubtotal,
      isDemoSubmission: true,
    };
    setSubmittedPreOrders((prev) => [record, ...prev]);
    setPreOrderCart([]);
    return record;
  };

  // POS Cart Logic
  const addToPosCart = (product: FeedProduct, variant?: ProductVariant, quantity = 1) => {
    const safeQty = Math.max(1, Math.floor(quantity));
    const chosenVariant = variant;
    const lineId = chosenVariant ? `${product.id}::${chosenVariant.id}` : product.id;
    const packageSize = chosenVariant ? chosenVariant.packageSize : product.packageSize;
    const sku = chosenVariant ? chosenVariant.sku : product.sku;
    const barcode = chosenVariant ? chosenVariant.barcode : product.barcode;
    const sampleUnitPrice = chosenVariant ? chosenVariant.samplePrice : product.samplePrice;

    setPosCart((prev) => {
      const existing = prev.find((item) => item.lineId === lineId);
      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId ? { ...item, quantity: item.quantity + safeQty } : item
        );
      }
      return [
        ...prev,
        {
          lineId,
          productId: product.id,
          variantId: chosenVariant?.id,
          name: product.name,
          category: product.category,
          packageSize,
          sku,
          barcode,
          sampleUnitPrice,
          quantity: safeQty,
          image: product.image,
        },
      ];
    });
    setLastScannedLineId(lineId);
  };

  const scanOrAddByBarcode = (rawCode: string): BarcodeLookupResult => {
    const cleaned = rawCode.trim();
    if (!cleaned) {
      return {
        matched: false,
        message: 'Enter or scan a barcode or SKU first.',
      };
    }

    const normalized = cleaned.toUpperCase();

    for (const product of products) {
      // Check variant barcodes or SKUs first
      if (product.variants && product.variants.length > 0) {
        const matchedVariant = product.variants.find(
          (v) => v.barcode.toUpperCase() === normalized || v.sku.toUpperCase() === normalized
        );
        if (matchedVariant) {
          const lineId = `${product.id}::${matchedVariant.id}`;
          const existing = posCart.find((c) => c.lineId === lineId);
          const nextQty = (existing?.quantity ?? 0) + 1;
          addToPosCart(product, matchedVariant, 1);
          return {
            matched: true,
            product,
            variant: matchedVariant,
            newQuantity: nextQty,
            message: `${product.name} (${matchedVariant.packageSize}) — Qty ${nextQty}`,
          };
        }
      }

      if (
        product.barcode.toUpperCase() === normalized ||
        product.sku.toUpperCase() === normalized
      ) {
        const existing = posCart.find((c) => c.lineId === product.id);
        const nextQty = (existing?.quantity ?? 0) + 1;
        addToPosCart(product, undefined, 1);
        return {
          matched: true,
          product,
          newQuantity: nextQty,
          message: `${product.name} (${product.packageSize}) — Qty ${nextQty}`,
        };
      }
    }

    return {
      matched: false,
      message: `No catalog match for code "${cleaned}". Use manual product search or add the barcode in Inventory.`,
    };
  };

  const updatePosQty = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      setPosCart((prev) => prev.filter((item) => item.lineId !== lineId));
      return;
    }
    const safeQty = Math.min(999, Math.floor(quantity));
    setPosCart((prev) =>
      prev.map((item) => (item.lineId === lineId ? { ...item, quantity: safeQty } : item))
    );
  };

  const removeFromPosCart = (lineId: string) => {
    setPosCart((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  const clearPosCart = () => {
    setPosCart([]);
    setLastScannedLineId(null);
  };

  const posItemCount = useMemo(
    () => posCart.reduce((acc, item) => acc + item.quantity, 0),
    [posCart]
  );

  const posSubtotal = useMemo(
    () =>
      Math.round(
        posCart.reduce((acc, item) => acc + item.sampleUnitPrice * item.quantity, 0) * 100
      ) / 100,
    [posCart]
  );

  const posTaxAmount = useMemo(() => {
    if (!taxEnabled || taxRatePercent <= 0) return 0;
    return Math.round(posSubtotal * (taxRatePercent / 100) * 100) / 100;
  }, [posSubtotal, taxEnabled, taxRatePercent]);

  const posTotal = useMemo(
    () => Math.round((posSubtotal + posTaxAmount) * 100) / 100,
    [posSubtotal, posTaxAmount]
  );

  const completeDemoPosSale = ({
    paymentMethod,
    cashTendered,
    customerMemo,
  }: {
    paymentMethod: PaymentMethod;
    cashTendered?: number;
    customerMemo?: string;
  }): PosTransaction => {
    const nextNumber = 1001 + posTransactions.length;
    const effectiveRate = taxEnabled ? taxRatePercent : 0;
    const changeDue =
      paymentMethod === PaymentMethod.Cash && typeof cashTendered === 'number'
        ? Math.max(0, Math.round((cashTendered - posTotal) * 100) / 100)
        : undefined;

    const tx: PosTransaction = {
      id: `DEMO-TX-${nextNumber}`,
      createdAtIso: new Date().toISOString(),
      items: posCart.map((item) => ({
        productId: item.productId,
        name: item.name,
        packageSize: item.packageSize,
        sku: item.sku,
        barcode: item.barcode,
        quantity: item.quantity,
        sampleUnitPrice: item.sampleUnitPrice,
        lineTotal: Math.round(item.sampleUnitPrice * item.quantity * 100) / 100,
      })),
      subtotal: posSubtotal,
      taxRatePercent: effectiveRate,
      taxAmount: posTaxAmount,
      total: posTotal,
      paymentMethod,
      cashTendered: paymentMethod === PaymentMethod.Cash ? cashTendered : undefined,
      changeDue,
      customerMemo: customerMemo?.trim() || undefined,
      status: TransactionStatus.CompletedDemo,
      isDemoRecord: true,
    };

    // Deduct quantities from local demo stock
    setProducts((prev) =>
      prev.map((prod) => {
        const soldQty = posCart
          .filter((line) => line.productId === prod.id)
          .reduce((sum, line) => sum + line.quantity, 0);
        if (soldQty === 0) return prod;
        return {
          ...prod,
          stockQty: Math.max(0, prod.stockQty - soldQty),
        };
      })
    );

    setPosTransactions((prev) => [tx, ...prev]);
    setPosCart([]);
    setLastScannedLineId(null);
    return tx;
  };

  const voidDemoTransaction = (txId: string) => {
    const target = posTransactions.find((t) => t.id === txId);
    if (!target || target.status === TransactionStatus.VoidedDemo) return;

    setPosTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: TransactionStatus.VoidedDemo } : t))
    );

    // Restore stock in local demo inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const returnedQty = target.items
          .filter((i) => i.productId === prod.id)
          .reduce((sum, i) => sum + i.quantity, 0);
        if (returnedQty === 0) return prod;
        return {
          ...prod,
          stockQty: prod.stockQty + returnedQty,
        };
      })
    );
  };

  const addSampleProduct = (input: NewProductInput): FeedProduct => {
    const id = `prod-custom-${Date.now()}`;
    const newProd: FeedProduct = {
      id,
      name: input.name.trim(),
      category: input.category,
      feedType: input.feedType.trim() || 'Feed & Supply Item',
      species: input.species.trim() || 'General Farm Use',
      form: input.form.trim() || 'Standard Pack',
      packageSize: input.packageSize.trim(),
      weightLbs: input.weightLbs,
      sku: input.sku.trim().toUpperCase(),
      barcode: input.barcode.trim(),
      samplePrice: Math.max(0, Number(input.samplePrice) || 0),
      stockQty: Math.max(0, Math.floor(Number(input.stockQty) || 0)),
      lowStockThreshold: Math.max(0, Math.floor(Number(input.lowStockThreshold) || 5)),
      image: getDefaultCategoryImage(input.category),
      imageAlt: `${input.name.trim()} — ${input.packageSize.trim()}`,
      featured: false,
      description:
        input.description.trim() ||
        'Sample catalog entry created locally in the POS inventory interface.',
      handlingNotes: input.handlingNotes.trim() || 'Store in a clean, dry location.',
      isSampleData: true,
    };

    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateSampleProduct = (productId: string, updates: Partial<FeedProduct>) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const nextCategory = updates.category ?? prod.category;
        const categoryChanged = updates.category && updates.category !== prod.category;
        return {
          ...prod,
          ...updates,
          image: categoryChanged ? getDefaultCategoryImage(nextCategory) : prod.image,
        };
      })
    );
  };

  const adjustProductStock = (productId: string, newStockQty: number) => {
    const safeStock = Math.max(0, Math.floor(newStockQty));
    setProducts((prev) =>
      prev.map((prod) => (prod.id === productId ? { ...prod, stockQty: safeStock } : prod))
    );
  };

  const resetAllDemoData = () => {
    setProducts(INITIAL_SAMPLE_PRODUCTS);
    setPreOrderCart([]);
    setSubmittedPreOrders([]);
    setPosCart([]);
    setPosTransactions(INITIAL_DEMO_TRANSACTIONS);
    setTaxEnabled(true);
    setTaxRatePercent(STORE_INFO.defaultDemoTaxRatePercent);
    setLastScannedLineId(null);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        preOrderCart,
        preOrderCount,
        preOrderSubtotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToPreOrder,
        updatePreOrderQty,
        removeFromPreOrder,
        clearPreOrder,
        submittedPreOrders,
        submitDemoPreOrder,
        posCart,
        posItemCount,
        posSubtotal,
        taxEnabled,
        setTaxEnabled,
        taxRatePercent,
        setTaxRatePercent,
        posTaxAmount,
        posTotal,
        lastScannedLineId,
        scanOrAddByBarcode,
        addToPosCart,
        updatePosQty,
        removeFromPosCart,
        clearPosCart,
        completeDemoPosSale,
        posTransactions,
        voidDemoTransaction,
        addSampleProduct,
        updateSampleProduct,
        adjustProductStock,
        resetAllDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
