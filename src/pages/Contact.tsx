import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ExternalLink, Info, MapPin, Phone } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface EnquiryState {
  name: string;
  phone: string;
  topic: string;
  message: string;
}

export function Contact() {
  const [form, setForm] = useState<EnquiryState>({
    name: '',
    phone: '',
    topic: 'Product & Feed Stock Inquiry',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryState, string>>>({});
  const [submittedDemo, setSubmittedDemo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<Record<keyof EnquiryState, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Please enter your name.';
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      nextErrors.phone = 'Please enter a 10-digit callback phone number.';
    }
    if (!form.message.trim() || form.message.trim().length < 8) {
      nextErrors.message = 'Please include a brief question about the feed or supplies you need.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmittedDemo(true);
    }
  };

  return (
    <div className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="pb-6 border-b border-[#E4E1D8] space-y-1.5">
          <p className="text-xs font-medium text-[#79583D]">Location &amp; Store Contact</p>
          <h1 className="font-serif text-3xl font-semibold text-[#292B27] tracking-tight">
            Contact {STORE_INFO.name}
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-2xl">
            Call the store directly for the fastest answer on current operating hours, grain mixes,
            and bag availability in Fresno.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Verified Store Contact Details */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white border border-[#E4E1D8] rounded-md p-6 space-y-5">
              <div className="space-y-1">
                <h2 className="font-serif text-xl font-semibold text-[#292B27]">
                  {STORE_INFO.name}
                </h2>
                <p className="text-xs text-[#595C54]">
                  Livestock, Poultry &amp; Pigeon Feed Supplier
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-[#E4E1D8] text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#263C2D] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold text-[#595C54]">Store Address</p>
                    <p className="text-[#292B27] font-medium mt-0.5">{STORE_INFO.fullAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#263C2D] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold text-[#595C54]">Telephone</p>
                    <a
                      href={STORE_INFO.phoneHref}
                      className="inline-block text-[#263C2D] font-semibold hover:underline underline-offset-4 tabular-nums mt-0.5"
                    >
                      {STORE_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E4E1D8] space-y-2">
                <p className="text-xs font-semibold text-[#292B27]">Store Hours</p>
                <p className="text-xs text-[#595C54] leading-relaxed">
                  Opening hours are not listed here unless verified directly by the store. Please
                  call{' '}
                  <a
                    href={STORE_INFO.phoneHref}
                    className="text-[#263C2D] font-medium underline underline-offset-2 tabular-nums"
                  >
                    {STORE_INFO.phoneDisplay}
                  </a>{' '}
                  before visiting to confirm today&apos;s hours.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={STORE_INFO.phoneHref}
                  className="inline-flex items-center justify-center gap-2 h-11 px-4 text-xs font-medium text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-colors whitespace-nowrap tabular-nums"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <span>Call Store Now</span>
                </a>

                <a
                  href={STORE_INFO.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-4 text-xs font-medium text-[#292B27] bg-[#F7F5EF] hover:bg-[#E9DFC9]/60 border border-[#E4E1D8] rounded-md transition-colors whitespace-nowrap"
                >
                  <span>Map Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Store Enquiry Form */}
          <div className="lg:col-span-7 bg-white border border-[#E4E1D8] rounded-md p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-[#292B27]">Store Enquiry Form (UI Demo)</h2>
              <p className="text-xs text-[#595C54]">
                Prepare a feed or bulk sack inquiry. Because this frontend prototype has no backend
                mail server attached, phone calls to {STORE_INFO.phoneDisplay} reach the store
                directly.
              </p>
            </div>

            {submittedDemo ? (
              <div className="p-6 bg-[#F7F5EF] border border-[#E4E1D8] rounded-md space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#263C2D] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-[#292B27]">
                      Demonstration Enquiry Recorded Locally
                    </h3>
                    <p className="text-xs text-[#595C54] leading-relaxed">
                      This frontend-only preview validated your enquiry locally ({form.topic}) and
                      did not send an external message. To speak directly with {STORE_INFO.name},
                      please call{' '}
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
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedDemo(false);
                    setForm({
                      name: '',
                      phone: '',
                      topic: 'Product & Feed Stock Inquiry',
                      message: '',
                    });
                  }}
                  className="h-10 px-4 text-xs font-medium text-[#292B27] bg-white border border-[#E4E1D8] hover:border-[#263C2D] rounded-md transition-colors cursor-pointer"
                >
                  Write Another Demo Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="enq-name" className="block text-xs font-semibold text-[#292B27] mb-1.5">
                      Your Name <span className="text-[#79583D]">*</span>
                    </label>
                    <input
                      id="enq-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, name: e.target.value }));
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="Full name"
                      className="w-full h-11 px-3.5 bg-white border border-[#E4E1D8] rounded-md text-sm text-[#292B27] focus:border-[#263C2D]"
                    />
                    {errors.name && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-red-700">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="enq-phone" className="block text-xs font-semibold text-[#292B27] mb-1.5">
                      Phone Number <span className="text-[#79583D]">*</span>
                    </label>
                    <input
                      id="enq-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, phone: e.target.value }));
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="(559) 555-0192"
                      className="w-full h-11 px-3.5 bg-white border border-[#E4E1D8] rounded-md text-sm text-[#292B27] tabular-nums focus:border-[#263C2D]"
                    />
                    {errors.phone && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-red-700">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="enq-topic" className="block text-xs font-semibold text-[#292B27] mb-1.5">
                    Enquiry Topic
                  </label>
                  <select
                    id="enq-topic"
                    value={form.topic}
                    onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
                    className="w-full h-11 px-3.5 bg-white border border-[#E4E1D8] rounded-md text-sm text-[#292B27] focus:border-[#263C2D] cursor-pointer"
                  >
                    <option value="Product & Feed Stock Inquiry">Product &amp; Feed Stock Inquiry</option>
                    <option value="Livestock & Alfalfa Pellets">Livestock &amp; Alfalfa Pellets</option>
                    <option value="Poultry Layer & Chick Rations">Poultry Layer &amp; Chick Rations</option>
                    <option value="Pigeon Grain & Loft Mixes">Pigeon Grain &amp; Loft Mixes</option>
                    <option value="Multi-Bag / Pallet Availability">Multi-Bag / Pallet Availability</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="enq-message" className="block text-xs font-semibold text-[#292B27] mb-1.5">
                    Message <span className="text-[#79583D]">*</span>
                  </label>
                  <textarea
                    id="enq-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, message: e.target.value }));
                      if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                    }}
                    placeholder="Let us know which feed type, animal species, and approximate bag count you are looking for..."
                    className="w-full p-3.5 bg-white border border-[#E4E1D8] rounded-md text-sm text-[#292B27] focus:border-[#263C2D]"
                  />
                  {errors.message && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-700">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-2 text-xs text-[#595C54]">
                  <Info className="w-4 h-4 text-[#79583D] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Simulated local enquiry form for UI demonstration. For real inquiries, call{' '}
                    {STORE_INFO.phoneDisplay}.
                  </span>
                </div>

                <button
                  type="submit"
                  className="h-11 px-6 text-sm font-medium text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-colors cursor-pointer"
                >
                  Submit Store Enquiry (Demo)
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
