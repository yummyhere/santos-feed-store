import React, { useEffect } from 'react';
import { X, Check, ShoppingBag, Eye, Wheat, ShieldCheck } from 'lucide-react';
import { FeedProduct } from '../types/store';
import { formatUSD } from '../utils/format';
import { SmartImage } from './SmartImage';
import { useStore } from '../context/StoreContext';

interface GrainInspectModalProps {
  product: FeedProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GrainInspectModal({ product, isOpen, onClose }: GrainInspectModalProps) {
  const { addToPreOrder } = useStore();
  const [added, setAdded] = React.useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAdded(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    addToPreOrder(product, 1, product.variants?.[0], false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292B27]/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="grain-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-[#F7F5EF] border border-[#E4E1D8] rounded-xl overflow-hidden shadow-xl animate-receipt-print">
        {/* Header with vintage sack stencil feel */}
        <div className="px-6 py-4 bg-white border-b border-[#E4E1D8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E9DFC9]/60 flex items-center justify-center text-[#263C2D]">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#697A45] uppercase tracking-wider">
                Feed Physical Texture Inspection
              </p>
              <h2 id="grain-modal-title" className="font-serif text-lg font-semibold text-[#292B27]">
                {product.name}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close grain inspector"
            className="p-1.5 text-[#595C54] hover:text-[#292B27] hover:bg-[#F7F5EF] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Arched image container */}
            <div className="relative">
              <SmartImage
                src={product.image}
                alt={product.imageAlt}
                className="aspect-square w-full rounded-2xl border-2 border-[#E4E1D8] overflow-hidden"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#263C2D]/90 text-white backdrop-blur-xs px-3 py-1.5 rounded-md text-[11px] flex items-center justify-between">
                <span>Texture: {product.form}</span>
                <span className="font-mono">{product.packageSize}</span>
              </div>
            </div>

            {/* Grain Specification Ledger */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-[#E4E1D8] space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#E4E1D8]">
                  <span className="text-[#595C54]">Species Target:</span>
                  <span className="font-semibold text-[#292B27]">{product.species}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E4E1D8]">
                  <span className="text-[#595C54]">Physical Form:</span>
                  <span className="font-semibold text-[#263C2D]">{product.form}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E4E1D8]">
                  <span className="text-[#595C54]">Sample Barcode:</span>
                  <span className="font-mono tabular-nums text-[#292B27]">{product.barcode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#595C54]">Standard Unit Price:</span>
                  <span className="font-mono font-semibold text-sm text-[#263C2D] tabular-nums">
                    {formatUSD(product.samplePrice)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#E9DFC9]/40 rounded-lg border border-[#E4E1D8] text-xs text-[#595C54] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#697A45] shrink-0 mt-0.5" />
                <p>
                  <strong>Handling &amp; Storage:</strong> {product.handlingNotes}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 h-11 px-4 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    added
                      ? 'bg-[#697A45] text-white'
                      : 'bg-[#263C2D] hover:bg-[#1E3024] text-white shadow-sm'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Pre-Order!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Pre-Order Sample Sack ({formatUSD(product.samplePrice)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
