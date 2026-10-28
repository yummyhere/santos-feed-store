import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  Info,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/products';
import { PreOrderCustomerDetails, PreOrderRecord } from '../types/store';
import { formatDateTime, formatUSD } from '../utils/format';
import { SmartImage } from '../components/SmartImage';

type StepState = 'edit' | 'review' | 'submitted';

export function PreOrder() {
  const {
    preOrderCart,
    preOrderCount,
    preOrderSubtotal,
    updatePreOrderQty,
    removeFromPreOrder,
    clearPreOrder,
    submitDemoPreOrder,
  } = useStore();

  const [step, setStep] = useState<StepState>('edit');
  const [customer, setCustomer] = useState<PreOrderCustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    pickupTimingNote: '',
    orderNotes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PreOrderCustomerDetails, string>>>({});
  const [completedRecord, setCompletedRecord] = useState<PreOrderRecord | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<keyof PreOrderCustomerDetails, string>> = {};

    if (!customer.fullName.trim() || customer.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    const phoneDigits = customer.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      nextErrors.phone = 'Please enter a valid 10-digit callback phone number.';
    }

    if (customer.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      nextErrors.email = 'Please enter a valid email address or leave this field blank.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (preOrderCart.length === 0) return;
    if (validateForm()) {
      setStep('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmDemoSubmission = () => {
    const record = submitDemoPreOrder(customer);
    setCompletedRecord(record);
    setStep('submitted');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyListForPhone = async () => {
    if (!completedRecord) return;
    const lines = [
      `${STORE_INFO.name} — Pre-Order Inquiry List (${completedRecord.id})`,
      `Customer: ${completedRecord.customer.fullName} (${completedRecord.customer.phone})`,
      ...completedRecord.items.map(
        (i) => `- ${i.quantity}x ${i.name} (${i.packageSize}) [SKU: ${i.sku}]`
      ),
      completedRecord.customer.pickupTimingNote
        ? `Preferred Timing Note: ${completedRecord.customer.pickupTimingNote}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(lines);
      setCopiedSummary(true);
      window.setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // Clipboard fallback ignored if blocked
    }
  };

  // Submitted Demo Confirmation View
  if (step === 'submitted' && completedRecord) {
    return (
      <div className="py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-[#E9DFC9]/65 border border-[#79583D]/40 rounded-md p-5 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#79583D] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1 text-sm text-[#292B27]">
              <p className="font-semibold">
                Demonstration Pre-Order Only — Not Sent to Store
              </p>
              <p className="text-xs sm:text-sm text-[#595C54] leading-relaxed">
                Because this storefront is running as a frontend-only prototype without a backend
                connection, this pre-order has been saved locally in your browser only. To place an
                actual feed order or check bag availability, please call {STORE_INFO.name} at{' '}
                <a
                  href={STORE_INFO.phoneHref}
                  className="font-semibold text-[#263C2D] underline underline-offset-2 tabular-nums"
                >
                  {STORE_INFO.phoneDisplay}
                </a>
                .
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E4E1D8] rounded-md p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#E4E1D8]">
              <div>
                <p className="text-xs font-mono text-[#595C54] tabular-nums">
                  Local Demo Reference: {completedRecord.id}
                </p>
                <h1 className="font-serif text-2xl font-semibold text-[#292B27] mt-1">
                  Simulated Pre-Order Summary
                </h1>
              </div>
              <span className="text-xs text-[#595C54] tabular-nums">
                {formatDateTime(completedRecord.createdAtIso)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#595C54]">Customer Contact</p>
                <p className="font-medium text-[#292B27] mt-0.5">
                  {completedRecord.customer.fullName}
                </p>
                <p className="text-[#595C54] tabular-nums">{completedRecord.customer.phone}</p>
                {completedRecord.customer.email && (
                  <p className="text-[#595C54]">{completedRecord.customer.email}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-[#595C54]">Store Pickup Location</p>
                <p className="font-medium text-[#292B27] mt-0.5">{STORE_INFO.name}</p>
                <p className="text-[#595C54]">{STORE_INFO.fullAddress}</p>
                {completedRecord.customer.pickupTimingNote && (
                  <p className="text-xs text-[#595C54] mt-1">
                    Note: {completedRecord.customer.pickupTimingNote}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-[#E4E1D8] pt-4 space-y-2.5">
              <h2 className="text-xs font-semibold text-[#595C54]">
                Requested Sample Items
              </h2>
              <div className="divide-y divide-[#E4E1D8]">
                {completedRecord.items.map((item) => (
                  <div
                    key={item.lineId}
                    className="py-2.5 flex items-center justify-between gap-4 text-sm"
                  >
                    <div>
                      <span className="font-medium text-[#292B27]">{item.name}</span>
                      <span className="text-xs text-[#595C54] ml-2">
                        {item.packageSize} &times; {item.quantity}
                      </span>
                    </div>
                    <span className="font-medium tabular-nums text-[#292B27]">
                      {formatUSD(item.sampleUnitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E4E1D8] flex items-baseline justify-between">
                <span className="text-sm font-medium text-[#595C54]">
                  Estimated Sample Subtotal
                </span>
                <span className="text-lg font-semibold tabular-nums text-[#292B27]">
                  {formatUSD(completedRecord.sampleSubtotal)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E4E1D8] flex flex-wrap items-center gap-3">
              <a
                href={STORE_INFO.phoneHref}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm font-medium text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-colors tabular-nums"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>Call Store to Place Real Order ({STORE_INFO.phoneDisplay})</span>
              </a>

              <button
                type="button"
                onClick={handleCopyListForPhone}
                className="inline-flex items-center justify-center gap-2 h-11 px-4 text-xs font-medium text-[#292B27] bg-[#F7F5EF] hover:bg-[#E9DFC9]/60 border border-[#E4E1D8] rounded-md transition-colors cursor-pointer"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#263C2D]" />
                    <span>Copied Item List</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Item List</span>
                  </>
                )}
              </button>

              <Link
                to="/shop"
                className="inline-flex items-center justify-center h-11 px-4 text-xs font-medium text-[#595C54] hover:text-[#292B27] transition-colors"
              >
                Return to Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="pb-5 border-b border-[#E4E1D8] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#79583D]">
              {STORE_INFO.name} &middot; Online Pre-Order Prototype
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292B27] tracking-tight">
              {step === 'review' ? 'Review Demonstration Pre-Order' : 'Prepare a Feed Pre-Order'}
            </h1>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#263C2D] hover:underline underline-offset-4 whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Continue Browsing Feed</span>
          </Link>
        </div>

        {/* Honest Demonstration Notice */}
        <div className="flex items-start gap-2.5 px-4 py-3 bg-[#E9DFC9]/55 border border-[#E4E1D8] rounded-md text-xs text-[#292B27]">
          <Info className="w-4 h-4 text-[#79583D] shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            <strong>Frontend Demonstration:</strong> Submitting this form simulates an order review
            locally in your browser. It does not transmit orders to {STORE_INFO.name} or reserve
            inventory. Call{' '}
            <a
              href={STORE_INFO.phoneHref}
              className="font-semibold text-[#263C2D] underline underline-offset-2 tabular-nums"
            >
              {STORE_INFO.phoneDisplay}
            </a>{' '}
            for real store orders, operating hours, and pickup confirmation.
          </p>
        </div>

        {preOrderCart.length === 0 ? (
          <div className="bg-white border border-[#E4E1D8] rounded-md p-10 text-center space-y-4">
            <ShoppingBag className="w-8 h-8 text-[#697A45] mx-auto" aria-hidden="true" />
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-[#292B27]">
                No feed items in your pre-order list yet
              </h2>
              <p className="text-sm text-[#595C54] max-w-md mx-auto">
                Browse the sample catalog to select livestock, poultry, or pigeon feed bags before
                completing your pre-order details.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center h-11 px-5 text-sm font-medium text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-colors"
            >
              Browse Sample Feed Catalog
            </Link>
          </div>
        ) : step === 'review' ? (
          /* Step 2: Order Review Screen */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white border border-[#E4E1D8] rounded-md p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
                <h2 className="text-base font-semibold text-[#292B27]">
                  1. Verify Items ({preOrderCount} bags/units)
                </h2>
                <button
                  type="button"
                  onClick={() => setStep('edit')}
                  className="text-xs font-medium text-[#263C2D] hover:underline underline-offset-4 cursor-pointer"
                >
                  Edit quantities
                </button>
              </div>

              <div className="divide-y divide-[#E4E1D8]">
                {preOrderCart.map((item) => (
                  <div key={item.lineId} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#292B27]">{item.name}</p>
                      <p className="text-xs text-[#595C54]">
                        {item.packageSize} &middot; {formatUSD(item.sampleUnitPrice)} sample &times;{' '}
                        {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-[#292B27]">
                      {formatUSD(item.sampleUnitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E4E1D8] space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[#292B27]">
                    2. Customer Contact Details
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStep('edit')}
                    className="text-xs font-medium text-[#263C2D] hover:underline underline-offset-4 cursor-pointer"
                  >
                    Edit contact info
                  </button>
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-[#595C54]">Name</dt>
                    <dd className="font-medium text-[#292B27]">{customer.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#595C54]">Callback Phone</dt>
                    <dd className="font-medium text-[#292B27] tabular-nums">{customer.phone}</dd>
                  </div>
                  {customer.email && (
                    <div>
                      <dt className="text-xs text-[#595C54]">Email</dt>
                      <dd className="text-[#292B27]">{customer.email}</dd>
                    </div>
                  )}
                  {customer.pickupTimingNote && (
                    <div>
                      <dt className="text-xs text-[#595C54]">In-Store Pickup Inquiry Note</dt>
                      <dd className="text-[#292B27]">{customer.pickupTimingNote}</dd>
                    </div>
                  )}
                  {customer.orderNotes && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs text-[#595C54]">Additional Notes</dt>
                      <dd className="text-[#292B27]">{customer.orderNotes}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-[#E4E1D8] rounded-md p-6 space-y-4">
              <h2 className="text-base font-semibold text-[#292B27]">
                Confirm Demonstration Pre-Order
              </h2>
              <div className="py-3 border-y border-[#E4E1D8] flex items-baseline justify-between">
                <span className="text-sm text-[#595C54]">Estimated Sample Subtotal</span>
                <span className="text-xl font-semibold tabular-nums text-[#292B27]">
                  {formatUSD(preOrderSubtotal)}
                </span>
              </div>
              <p className="text-xs text-[#595C54] leading-relaxed">
                No payment is collected online. Final pricing, applicable California tax or
                agricultural exemption, and pickup availability are confirmed directly at{' '}
                {STORE_INFO.fullAddress}.
              </p>
              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleConfirmDemoSubmission}
                  className="w-full h-11 px-5 text-sm font-medium text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-colors cursor-pointer"
                >
                  Submit Pre-Order (UI Demo)
                </button>
                <button
                  type="button"
                  onClick={() => setStep('edit')}
                  className="w-full h-10 px-4 text-xs font-medium text-[#292B27] bg-[#F7F5EF] hover:bg-[#E9DFC9]/60 border border-[#E4E1D8] rounded-md transition-colors cursor-pointer"
                >
                  Back to Edit Details
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Step 1: Editable Cart + Customer Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Editable Cart Items */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-[#E4E1D8] rounded-md overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E4E1D8] flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[#292B27]">
                    Selected Feed Items ({preOrderCount})
                  </h2>
                  <button
                    type="button"
                    onClick={clearPreOrder}
                    className="text-xs font-medium text-[#595C54] hover:text-[#292B27] cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-[#E4E1D8]">
                  {preOrderCart.map((item) => (
                    <div key={item.lineId} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        fallbackTitle={item.name}
                        className="w-20 h-20 rounded border border-[#E4E1D8] shrink-0"
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-base font-semibold text-[#292B27] hover:text-[#263C2D]"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-[#595C54]">
                          {item.packageSize} &middot; SKU{' '}
                          <span className="font-mono">{item.sku}</span>
                        </p>
                        <p className="text-xs text-[#595C54] tabular-nums">
                          {formatUSD(item.sampleUnitPrice)} sample price each
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="inline-flex items-center border border-[#E4E1D8] rounded-md bg-[#F7F5EF]">
                          <button
                            type="button"
                            onClick={() => updatePreOrderQty(item.lineId, item.quantity - 1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="w-9 h-9 inline-flex items-center justify-center text-[#292B27] hover:bg-[#E9DFC9]/60 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={999}
                            aria-label={`Quantity for ${item.name}`}
                            value={item.quantity}
                            onChange={(e) => {
                              const parsed = parseInt(e.target.value, 10);
                              if (Number.isFinite(parsed)) {
                                updatePreOrderQty(item.lineId, parsed);
                              }
                            }}
                            className="w-11 text-center text-xs font-semibold tabular-nums text-[#292B27] bg-transparent focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => updatePreOrderQty(item.lineId, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="w-9 h-9 inline-flex items-center justify-center text-[#292B27] hover:bg-[#E9DFC9]/60 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right min-w-[76px]">
                          <div className="text-sm font-semibold tabular-nums text-[#292B27]">
                            {formatUSD(item.sampleUnitPrice * item.quantity)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromPreOrder(item.lineId)}
                          aria-label={`Remove ${item.name} from pre-order`}
                          className="p-2 text-[#595C54] hover:text-[#292B27] rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-4 bg-[#F7F5EF] border-t border-[#E4E1D8] flex items-baseline justify-between">
                  <span className="text-sm font-medium text-[#595C54]">
                    Estimated Sample Subtotal
                  </span>
                  <span className="text-lg font-semibold tabular-nums text-[#292B27]">
                    {formatUSD(preOrderSubtotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Customer Details Form */}
            <form
              onSubmit={handleProceedToReview}
              noValidate
              className="lg:col-span-5 bg-white border border-[#E4E1D8] rounded-md p-6 space-y-4"
            >
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-[#292B27]">
                  Customer Contact Information
                </h2>
                <p className="text-xs text-[#595C54]">
                  Enter contact details to review your pre-order summary.
                </p>
              </div>

              <div>
                <label htmlFor="po-name" className="block text-xs font-semibold text-[#292B27] mb-1.5">
                  Full Name <span className="text-[#79583D]">*</span>
                </label>
                <input
                  id="po-name"
                  type="text"
                  required
                  value={customer.fullName}
                  onChange={(e) => {
                    setCustomer((prev) => ({ ...prev, fullName: e.target.value }));
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                  placeholder="e.g. Maria Morales"
                  className="w-full h-11 px-3.5 bg-white border border-[#E4E1D8] rounded-md text-sm text-[#292B27] focus:border-[#263C2D]"
                />
                {errors.fullName && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-700">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="po-phone" className="block text-xs font-semibold text-[#292B27] mb-1.5">
                  Callback Phone Number <span className="text-[#79583D]">*</span>
                </label>
                <input
                  id="po-phone"
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => {
                    setCustomer((prev) => ({ ...prev, phone: e.target.value }));
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="(559) 555-0148"
                  className="w-full h-11 px-3.5 bg-white border border-[#E4E1D8] rounded-md text-sm text-[#292B27] tabular-nums focus:border-[#263C2D]"
                />
                {errors.phone && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-700">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="po-email" className="block text-xs font-semibold text-[#292B27] mb-1.5">
                  Email Address <span className="text-[#595C54] font-normal">(optional)</span>
                </label>
                <input
                  id="po-email"
                  type="email"
                  value={customer.email}
                  onChange={(e) => {
                    setCustomer((prev) => ({ ...prev, email: e.target.value }));
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="you@example.com"
                  className="w-full h-11 px-3.5 bg-white border border-[#E4E1D8] rounded-md text-sm text-[#292B27] focus:border-[#263C2D]"
                />
                {errors.email && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-700">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="po-pickup" className="block text-xs font-semibold text-[#292B27] mb-1.5">
                  Store Visit Timing Inquiry{' '}
                  <span className="text-[#595C54] font-normal">(confirmed with store)</span>
                </label>
                <input
                  id="po-pickup"
                  type="text"
                  value={customer.pickupTimingNote}
                  onChange={(e) =>
                    setCustomer((prev) => ({ ...prev, pickupTimingNote: e.target.value }))
                  }
                  placeholder="e.g. Hoping to stop by 8844 S Elm Ave tomorrow morning"
                  className="w-full h-11 px-3.5 bg-white border border-[#E4E1D8] rounded-md text-sm text-[#292B27] focus:border-[#263C2D]"
                />
              </div>

              <div>
                <label htmlFor="po-notes" className="block text-xs font-semibold text-[#292B27] mb-1.5">
                  Order or Loading Notes <span className="text-[#595C54] font-normal">(optional)</span>
                </label>
                <textarea
                  id="po-notes"
                  rows={3}
                  value={customer.orderNotes}
                  onChange={(e) =>
                    setCustomer((prev) => ({ ...prev, orderNotes: e.target.value }))
                  }
                  placeholder="Pickup truck bed loading, alternative bag size acceptable, etc."
                  className="w-full p-3.5 bg-white border border-[#E4E1D8] rounded-md text-sm text-[#292B27] focus:border-[#263C2D]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 px-5 text-sm font-medium text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-colors cursor-pointer"
              >
                Review Pre-Order Summary
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
