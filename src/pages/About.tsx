import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, MapPin, Phone } from 'lucide-react';
import { FEED_CATEGORIES } from '../data/categories';
import { STORE_IMAGES } from '../data/images';
import { STORE_INFO } from '../data/products';
import { Reveal } from '../components/Reveal';
import { SmartImage } from '../components/SmartImage';
import { HandDrawnWheat } from '../components/HandDrawnWheat';

export function About() {
  return (
    <div className="py-10 sm:py-14 space-y-14">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#79583D]">
                About {STORE_INFO.name}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#292B27] tracking-tight balance-text">
                A Local Feed Supplier for Fresno Flocks, Lofts, and Herds
              </h1>
            </div>

            <p className="text-base text-[#595C54] leading-relaxed">
              Situated on South Elm Avenue in Fresno, California, {STORE_INFO.name} provides feed
              and everyday barn essentials for livestock owners, poultry keepers, and pigeon
              breeders in the surrounding community.
            </p>

            <p className="text-sm sm:text-base text-[#595C54] leading-relaxed">
              Whether you are picking up 50 lb sacks of pelleted livestock rations, layer crumbles
              for a backyard coop, or clean whole-grain conditioning mixes for a pigeon loft, our
              goal is straightforward service and practical feed selection.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 h-11 px-5 text-sm font-medium text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-colors whitespace-nowrap"
              >
                <span>Browse Sample Catalog</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href={STORE_INFO.phoneHref}
                className="inline-flex items-center gap-2 h-11 px-5 text-sm font-medium text-[#292B27] bg-white hover:bg-[#E9DFC9]/60 border border-[#E4E1D8] rounded-md transition-colors whitespace-nowrap tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#263C2D]" aria-hidden="true" />
                <span>Call {STORE_INFO.phoneDisplay}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <SmartImage
              src={STORE_IMAGES.fresnoFeedYard}
              alt="Feed pallets and loading yard in Central Valley California"
              fallbackTitle="Santos Feed Store — Fresno, CA"
              loading="eager"
              className="aspect-[16/9] w-full rounded-md border border-[#E4E1D8]"
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white border-y border-[#E4E1D8] py-12 sm:py-16">
        {/* Subtle authentic hand-drawn wheat marginalia along right edge */}
        <HandDrawnWheat
          variant="image"
          flip={false}
          rotate={6}
          sway="normal"
          opacity={0.5}
          heightClass="h-64 sm:h-80"
          className="hidden lg:block absolute -right-6 top-8 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          <Reveal>
            <div className="max-w-2xl space-y-2">
              <h2 className="font-serif text-2xl font-semibold text-[#292B27]">
                Animals &amp; Feed Categories We Serve
              </h2>
              <p className="text-sm text-[#595C54]">
                Focused on practical nutrition and feed-room staples suited to Fresno properties,
                acreage ranches, and lofts.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEED_CATEGORIES.map((cat, idx) => (
              <Reveal key={cat.id} delay={idx * 0.05}>
                <div className="h-full p-5 bg-[#F7F5EF] border border-[#E4E1D8] rounded-md flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-[#292B27]">{cat.name}</h3>
                    <p className="text-sm text-[#595C54] leading-relaxed">{cat.description}</p>
                  </div>
                  <p className="pt-3 border-t border-[#E4E1D8] text-xs text-[#79583D]">
                    {cat.examples}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E4E1D8] rounded-md p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="font-serif text-xl font-semibold text-[#292B27]">
              Visiting {STORE_INFO.name}
            </h2>
            <p className="flex items-center gap-2 text-sm text-[#595C54]">
              <MapPin className="w-4 h-4 text-[#263C2D] shrink-0" aria-hidden="true" />
              <span>{STORE_INFO.fullAddress}</span>
            </p>
            <p className="text-xs text-[#595C54]">
              Call ahead at {STORE_INFO.phoneDisplay} to confirm current store hours and check
              specific grain or pellet availability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={STORE_INFO.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-10 px-4 text-xs font-medium text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-colors whitespace-nowrap"
            >
              <span>Open Directions</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 h-10 px-4 text-xs font-medium text-[#292B27] bg-[#F7F5EF] hover:bg-[#E9DFC9]/60 border border-[#E4E1D8] rounded-md transition-colors whitespace-nowrap"
            >
              <span>Send Store Enquiry</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
