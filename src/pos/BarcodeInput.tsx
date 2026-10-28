import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, CornerDownLeft, ScanBarcode } from 'lucide-react';
import { BarcodeLookupResult, useStore } from '../context/StoreContext';
import { soundFx } from '../utils/audio';

interface BarcodeInputProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const QUICK_SAMPLE_CODES = [
  { label: 'Layer 50lb (048210500101)', code: '048210500101' },
  { label: 'Pigeon Mix (048210500204)', code: '048210500204' },
  { label: 'All-Stock (048210500301)', code: '048210500301' },
  { label: 'Test Unknown (099999000000)', code: '099999000000' },
];

export function BarcodeInput({ inputRef }: BarcodeInputProps) {
  const { scanOrAddByBarcode } = useStore();
  const [codeValue, setCodeValue] = useState('');
  const [lastResult, setLastResult] = useState<BarcodeLookupResult | null>(null);

  const executeLookup = (raw: string) => {
    const result = scanOrAddByBarcode(raw);
    setLastResult(result);
    if (result.matched) {
      soundFx.playScannerBeep();
      setCodeValue('');
    } else {
      soundFx.playErrorBuzz();
      inputRef.current?.select();
    }
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLookup(codeValue);
  };

  return (
    <div className="bg-white border border-[#E4E1D8] rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor="pos-barcode-input"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#292B27]"
        >
          <ScanBarcode className="w-4 h-4 text-[#263C2D]" aria-hidden="true" />
          <span>Barcode / SKU Lookup (Keyboard-Wedge USB Scanner)</span>
        </label>
        <span className="text-[11px] text-[#595C54]">
          Press <kbd className="font-mono px-1.5 py-0.5 bg-[#F7F5EF] border border-[#E4E1D8] rounded">F2</kbd> to focus &middot;{' '}
          <kbd className="font-mono px-1.5 py-0.5 bg-[#F7F5EF] border border-[#E4E1D8] rounded">Enter</kbd> to scan
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex items-stretch gap-2">
        <input
          ref={inputRef}
          id="pos-barcode-input"
          type="text"
          autoComplete="off"
          value={codeValue}
          onChange={(e) => setCodeValue(e.target.value)}
          placeholder="Scan barcode with USB keyboard-wedge scanner or type UPC / SKU..."
          className="flex-1 h-12 px-4 font-mono text-base text-[#292B27] bg-[#F7F5EF] border-2 border-[#E4E1D8] rounded-lg focus:bg-white focus:border-[#263C2D] tabular-nums transition-colors"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 h-12 px-5 text-xs font-bold text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-lg transition-colors duration-100 whitespace-nowrap cursor-pointer shadow-xs"
        >
          <span>Scan Code</span>
          <CornerDownLeft className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>

      {/* Quick Test Trigger Row for Desktop Evaluation Without Physical Scanner */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#595C54] pt-1 border-t border-[#E4E1D8]/60">
        <span className="font-medium text-[#292B27]">Click to test scan:</span>
        {QUICK_SAMPLE_CODES.map((sample) => (
          <button
            key={sample.code}
            type="button"
            onClick={() => {
              setCodeValue(sample.code);
              executeLookup(sample.code);
            }}
            className="px-2.5 py-1 font-mono text-[11px] text-[#263C2D] bg-[#F7F5EF] hover:bg-[#E9DFC9] border border-[#E4E1D8] rounded-md transition-colors cursor-pointer font-medium"
          >
            {sample.label}
          </button>
        ))}
      </div>

      {/* Feedback Banner */}
      {lastResult && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border text-xs ${
            lastResult.matched
              ? 'bg-[#F7F5EF] border-[#697A45] text-[#263C2D]'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          {lastResult.matched ? (
            <CheckCircle2 className="w-4 h-4 text-[#263C2D] shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <span className="font-semibold">{lastResult.message}</span>
        </div>
      )}
    </div>
  );
}
