import React from 'react';
import { SunMedium, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

const SEASONAL_ADVISORIES = [
  {
    title: 'Laying Hen Winter Feather & Egg Care',
    season: 'Current Season: Fall & Early Winter',
    species: 'Poultry & Waterfowl',
    body: 'As daylight hours shorten in the Central Valley, hens naturally finish molting and require consistent 16% protein crumbles to rebuild feather plumage before winter chill sets in.',
    recommendation: 'Top-dress with Three-Grain Scratch Grain in the late afternoon to generate internal body warmth overnight.',
    tag: 'Poultry Nutrition',
  },
  {
    title: 'Pigeon Loft Molting & Winter Conditioning',
    season: 'Loft Conditioning Window',
    species: 'Sporting & Utility Pigeons',
    body: 'Clean whole grains with high safflower and maple pea ratios ensure dense feather bloom and robust pectoral muscle mass before the spring breeding season begins.',
    recommendation: 'Keep red mineral grit and clean waterers elevated off timber loft floors.',
    tag: 'Loft Management',
  },
  {
    title: 'Cold Valley Pasture Hay Supplementation',
    season: 'Roughage Support',
    species: 'Cattle, Goats & Sheep',
    body: 'When Central Valley irrigated pastures go dormant in December and January, pelleted alfalfa cubes and 12% all-stock pellets provide essential digestible energy without bulk wastage.',
    recommendation: 'Place weather-resistant 50 lb trace mineral salt blocks near shaded water troughs.',
    tag: 'Herd Health',
  },
];

export function SeasonalFeedGuide() {
  return (
    <section className="bg-white border-y border-[#E4E1D8] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#697A45]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Fresno Central Valley Seasonal Advisory</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292B27] tracking-tight">
              Practical Seasonal Feeding Notes
            </h2>
            <p className="text-sm text-[#595C54] max-w-xl">
              Grounded advice for feeding flocks and herds during Central Valley seasonal shifts.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-[#263C2D] bg-[#F7F5EF] px-3.5 py-2 rounded-lg border border-[#E4E1D8]">
            <SunMedium className="w-4 h-4 text-[#697A45]" />
            <span>Updated for Fresno Climate &middot; 8844 S Elm Ave</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEASONAL_ADVISORIES.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F7F5EF] border border-[#E4E1D8] rounded-xl p-6 flex flex-col justify-between gap-5 hover:border-[#697A45] transition-all hover:shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#595C54]">
                  <span className="font-semibold text-[#697A45] uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <span>{item.season}</span>
                </div>

                <h3 className="font-serif text-lg font-semibold text-[#292B27] leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-[#595C54] leading-relaxed">
                  {item.body}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E4E1D8] text-xs text-[#263C2D] bg-white/70 p-3 rounded-lg flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#697A45] shrink-0 mt-0.5" />
                <span className="leading-snug">{item.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
