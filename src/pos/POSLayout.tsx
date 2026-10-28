import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Boxes,
  Clock,
  Keyboard,
  RotateCcw,
  ScanBarcode,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/products';
import { STORE_LOGO } from '../data/images';
import { soundFx } from '../utils/audio';

const POS_NAV = [
  {
    label: 'Register',
    to: '/pos',
    shortcut: 'Alt+1',
    icon: ScanBarcode,
  },
  {
    label: 'Inventory',
    to: '/pos/inventory',
    shortcut: 'Alt+2',
    icon: Boxes,
  },
  {
    label: 'Sales History',
    to: '/pos/history',
    shortcut: 'Alt+3',
    icon: Clock,
  },
];

export function POSLayout() {
  const { posItemCount, resetAllDemoData } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === '1') {
          e.preventDefault();
          navigate('/pos');
        } else if (e.key === '2') {
          e.preventDefault();
          navigate('/pos/inventory');
        } else if (e.key === '3') {
          e.preventDefault();
          navigate('/pos/history');
        }
      }
      if (e.key === 'Escape' && showShortcutsModal) {
        setShowShortcutsModal(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate, showShortcutsModal]);

  const currentPageTitle =
    location.pathname === '/pos/inventory'
      ? 'Inventory Catalog (Demo)'
      : location.pathname === '/pos/history'
      ? 'Sales History (Demo)'
      : 'Barcode Register';

  const transactionStatusText =
    posItemCount > 0
      ? `Active Draft (${posItemCount} ${posItemCount === 1 ? 'unit' : 'units'} in cart)`
      : 'Ready for Barcode Scan';

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden flex flex-col md:flex-row bg-[#F7F5EF] text-[#292B27]">
      {/* Compact Left Operational Sidebar */}
      <aside className="w-full md:w-56 lg:w-60 bg-[#263C2D] text-[#F7F5EF] flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-[#1E3024]">
        <div>
          <div className="px-4 py-4 border-b border-white/15 flex items-center justify-between md:block">
            <div>
              <div className="bg-white rounded-md px-2.5 py-1 mb-1.5 inline-block shadow-xs">
                <img
                  src={STORE_LOGO}
                  alt={STORE_INFO.name}
                  className="h-6 w-auto object-contain"
                />
              </div>
              <div className="text-[11px] text-[#E9DFC9]/80">
                Desktop POS Prototype
              </div>
            </div>

            <Link
              to="/"
              className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#E9DFC9] bg-white/10 rounded hover:bg-white/15 transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>
          </div>

          <nav
            aria-label="POS sections"
            className="p-2 flex md:flex-col gap-1 overflow-x-auto"
          >
            {POS_NAV.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === '/pos'
                  ? location.pathname === '/pos'
                  : location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-md text-xs sm:text-sm font-medium transition-colors duration-100 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#F7F5EF] text-[#263C2D] font-semibold'
                      : 'text-[#E9DFC9]/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </span>
                  <kbd
                    className={`hidden lg:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-[#E9DFC9] text-[#263C2D]'
                        : 'bg-white/10 text-[#E9DFC9]/80'
                    }`}
                  >
                    {item.shortcut}
                  </kbd>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Operational Controls */}
        <div className="hidden md:flex flex-col gap-2 p-3 border-t border-white/15 text-xs">
          <div className="p-2.5 rounded bg-black/20 text-[#E9DFC9]/85 leading-relaxed text-[11px]">
            Frontend UI only. Browser-local sample data is not synced to hardware or a store
            database.
          </div>

          {confirmReset ? (
            <div className="p-2.5 rounded bg-white/10 space-y-2">
              <p className="text-[11px] text-white">
                Reset sample inventory, carts, and demo sales history?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetAllDemoData();
                    setConfirmReset(false);
                  }}
                  className="flex-1 py-1.5 px-2 text-[11px] font-semibold bg-[#E9DFC9] text-[#263C2D] rounded cursor-pointer"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="py-1.5 px-2 text-[11px] text-[#E9DFC9] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#E9DFC9]/85 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Demo Data</span>
            </button>
          )}

          <Link
            to="/"
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#E9DFC9] hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Public Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main POS Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Bar */}
        <header className="h-14 px-4 lg:px-6 bg-white border-b border-[#E4E1D8] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-base font-semibold text-[#292B27] truncate">
              {currentPageTitle}
            </h1>
            <span aria-hidden="true" className="text-[#E4E1D8]">
              |
            </span>
            <span className="text-xs font-medium text-[#595C54] truncate tabular-nums">
              {transactionStatusText}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden xl:inline text-xs text-[#595C54]">
              Local Demo Mode &middot; {STORE_INFO.streetAddress}
            </span>
            <button
              type="button"
              onClick={() => {
                const nextState = soundFx.toggle();
                setSoundEnabled(nextState);
                if (nextState) {
                  soundFx.playScannerBeep();
                }
              }}
              title={soundEnabled ? 'Scanner Audio Enabled (Click to Mute)' : 'Scanner Audio Muted (Click to Enable)'}
              aria-label={soundEnabled ? 'Mute scanner audio' : 'Enable scanner audio'}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-medium text-[#292B27] bg-[#F7F5EF] hover:bg-[#E9DFC9]/60 border border-[#E4E1D8] rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#263C2D]" aria-hidden="true" />
                  <span className="hidden sm:inline">Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#79583D]" aria-hidden="true" />
                  <span className="hidden sm:inline">Muted</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowShortcutsModal(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-medium text-[#292B27] bg-[#F7F5EF] hover:bg-[#E9DFC9]/60 border border-[#E4E1D8] rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              <Keyboard className="w-3.5 h-3.5 text-[#263C2D]" aria-hidden="true" />
              <span>Shortcuts</span>
            </button>
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Implemented Keyboard Shortcuts Reference Modal */}
      {showShortcutsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292B27]/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pos-shortcuts-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowShortcutsModal(false);
          }}
        >
          <div className="w-full max-w-md bg-white border border-[#E4E1D8] rounded-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
              <h2 id="pos-shortcuts-title" className="text-base font-semibold text-[#292B27]">
                Implemented POS Keyboard Shortcuts
              </h2>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                aria-label="Close shortcuts dialog"
                className="p-1 text-[#595C54] hover:text-[#292B27] rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <dl className="divide-y divide-[#E4E1D8] text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-[#292B27]">Focus Barcode Input (Register)</dt>
                <dd>
                  <kbd className="px-2 py-0.5 font-mono bg-[#F7F5EF] border border-[#E4E1D8] rounded">
                    F2
                  </kbd>
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-[#292B27]">Submit Scanned / Typed Barcode</dt>
                <dd>
                  <kbd className="px-2 py-0.5 font-mono bg-[#F7F5EF] border border-[#E4E1D8] rounded">
                    Enter
                  </kbd>
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-[#292B27]">Focus Manual Product Search (Register)</dt>
                <dd>
                  <kbd className="px-2 py-0.5 font-mono bg-[#F7F5EF] border border-[#E4E1D8] rounded">
                    F4
                  </kbd>
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-[#292B27]">Open Checkout Panel (When Cart Non-Empty)</dt>
                <dd>
                  <kbd className="px-2 py-0.5 font-mono bg-[#F7F5EF] border border-[#E4E1D8] rounded">
                    F9
                  </kbd>
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-[#292B27]">Switch Register / Inventory / History</dt>
                <dd className="space-x-1">
                  <kbd className="px-1.5 py-0.5 font-mono bg-[#F7F5EF] border border-[#E4E1D8] rounded">
                    Alt+1
                  </kbd>
                  <kbd className="px-1.5 py-0.5 font-mono bg-[#F7F5EF] border border-[#E4E1D8] rounded">
                    Alt+2
                  </kbd>
                  <kbd className="px-1.5 py-0.5 font-mono bg-[#F7F5EF] border border-[#E4E1D8] rounded">
                    Alt+3
                  </kbd>
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-[#292B27]">Close Active Modal</dt>
                <dd>
                  <kbd className="px-2 py-0.5 font-mono bg-[#F7F5EF] border border-[#E4E1D8] rounded">
                    Esc
                  </kbd>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
