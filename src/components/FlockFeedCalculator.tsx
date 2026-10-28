import React, { useState } from 'react';
import { Calculator, Check, ArrowRight, Package, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatUSD } from '../utils/format';

type AnimalType = 'chickens' | 'pigeons' | 'goats' | 'cattle';

interface AnimalConfig {
  id: AnimalType;
  label: string;
  icon: string;
  unit: string;
  defaultCount: number;
  min: number;
  max: number;
  step: number;
  dailyRateLbs: number; // lbs of feed per head per day
  recommendedProductId: string;
  recommendedProductName: string;
  recommendedBagWeight: number;
  samplePricePerBag: number;
  rationTip: string;
}

const ANIMAL_CONFIGS: Record<AnimalType, AnimalConfig> = {
  chickens: {
    id: 'chickens',
    label: 'Backyard Laying Hens',
    icon: '🐔',
    unit: 'Hens',
    defaultCount: 16,
    min: 4,
    max: 80,
    step: 2,
    dailyRateLbs: 0.25, // 1/4 lb per hen per day
    recommendedProductId: 'prod-poultry-layer-16',
    recommendedProductName: 'Laying Hen 16% Crumbles (50 lb)',
    recommendedBagWeight: 50,
    samplePricePerBag: 19.5,
    rationTip: 'Pair with afternoon scratch grain and clean oyster shell for strong eggshell density in California heat.',
  },
  pigeons: {
    id: 'pigeons',
    label: 'Pigeon Loft & Aviary',
    icon: '🕊️',
    unit: 'Pigeons',
    defaultCount: 30,
    min: 8,
    max: 120,
    step: 4,
    dailyRateLbs: 0.08, // ~1.2 oz per bird per day
    recommendedProductId: 'prod-pigeon-loft-mix',
    recommendedProductName: 'Central Valley Loft Conditioning Mix (50 lb)',
    recommendedBagWeight: 50,
    samplePricePerBag: 27.75,
    rationTip: 'Clean whole grains with Austrian peas and safflower provide high endurance for training and loft molting.',
  },
  goats: {
    id: 'goats',
    label: 'Goats & Pasture Sheep',
    icon: '🐐',
    unit: 'Head',
    defaultCount: 6,
    min: 2,
    max: 25,
    step: 1,
    dailyRateLbs: 2.2, // ~2.2 lbs supplement per head per day
    recommendedProductId: 'prod-livestock-allstock-12',
    recommendedProductName: 'All-Stock 12% Pelleted Ration (50 lb)',
    recommendedBagWeight: 50,
    samplePricePerBag: 17.95,
    rationTip: 'Feed alongside clean grass or alfalfa hay roughage and keep fresh water shaded from direct sun.',
  },
  cattle: {
    id: 'cattle',
    label: 'Cattle & Ranch Horses',
    icon: '🐂',
    unit: 'Head',
    defaultCount: 3,
    min: 1,
    max: 15,
    step: 1,
    dailyRateLbs: 5.5, // ~5.5 lbs pelleted supplement per head per day
    recommendedProductId: 'prod-livestock-alfalfa-pellets',
    recommendedProductName: 'Sun-Cured Alfalfa Pellets (50 lb)',
    recommendedBagWeight: 50,
    samplePricePerBag: 18.5,
    rationTip: 'Ideal for soaking or top-dressing pasture hay. Dust-free pellets reduce bunk waste significantly.',
  },
};

export function FlockFeedCalculator() {
  const { products, addToPreOrder } = useStore();
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType>('chickens');
  const [animalCount, setAnimalCount] = useState<number>(ANIMAL_CONFIGS.chickens.defaultCount);
  const [added, setAdded] = useState(false);

  const config = ANIMAL_CONFIGS[selectedAnimal];

  // Calculations for 30-day month
  const monthlyTotalLbs = Math.round(animalCount * config.dailyRateLbs * 30);
  const bagsNeeded = Math.max(1, Math.ceil(monthlyTotalLbs / config.recommendedBagWeight));
  const estimatedCost = bagsNeeded * config.samplePricePerBag;

  const targetProduct = products.find((p) => p.id === config.recommendedProductId);

  const handleAnimalSelect = (type: AnimalType) => {
    setSelectedAnimal(type);
    setAnimalCount(ANIMAL_CONFIGS[type].defaultCount);
    setAdded(false);
  };

  const handleAddCalculatedToPreOrder = () => {
    if (!targetProduct) return;
    addToPreOrder(targetProduct, bagsNeeded, targetProduct.variants?.[0], true);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-[#263C2D] text-[#F7F5EF] rounded-2xl border-2 border-[#1E3024] p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-xl">
      {/* Subtle organic watermark */}
      <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none select-none text-9xl font-serif">
        SFS
      </div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/15">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-[#E9DFC9]">
              <Calculator className="w-3.5 h-3.5 text-[#E9DFC9]" />
              <span>Fresno Central Valley Feed Planning</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Flock &amp; Herd 30-Day Feed Calculator
            </h2>
            <p className="text-sm text-[#E9DFC9]/85 max-w-xl">
              Estimate your monthly 50 lb sack requirements based on your flock or herd count.
            </p>
          </div>

          <div className="text-xs text-[#E9DFC9]/70 bg-black/20 px-3.5 py-2 rounded-lg border border-white/10">
            Based on standard agricultural nutritional rates
          </div>
        </div>

        {/* Animal Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(Object.keys(ANIMAL_CONFIGS) as AnimalType[]).map((key) => {
            const item = ANIMAL_CONFIGS[key];
            const isSelected = selectedAnimal === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleAnimalSelect(key)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#F7F5EF] text-[#263C2D] border-white font-semibold shadow-md translate-y-[-2px]'
                    : 'bg-white/5 hover:bg-white/10 text-[#E9DFC9] border-white/10'
                }`}
              >
                <div className="text-2xl mb-1.5">{item.icon}</div>
                <div className="text-xs font-semibold leading-snug">{item.label}</div>
              </button>
            );
          })}
        </div>

        {/* Interactive Slider & Result Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black/20 p-6 sm:p-8 rounded-xl border border-white/10">
          {/* Left: Slider */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-baseline justify-between">
              <label htmlFor="feed-animal-slider" className="text-sm font-semibold text-white">
                How many {config.unit.toLowerCase()} do you maintain?
              </label>
              <div className="flex items-baseline gap-1 font-mono text-2xl font-bold text-[#E9DFC9] tabular-nums">
                <span>{animalCount}</span>
                <span className="text-xs font-normal text-white/70 font-sans">{config.unit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <input
                id="feed-animal-slider"
                type="range"
                min={config.min}
                max={config.max}
                step={config.step}
                value={animalCount}
                onChange={(e) => {
                  setAnimalCount(parseInt(e.target.value, 10));
                  setAdded(false);
                }}
                className="w-full h-2.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E9DFC9]"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#E9DFC9]/60">
                <span>Min: {config.min} {config.unit}</span>
                <span>Max: {config.max} {config.unit}</span>
              </div>
            </div>

            <div className="p-3.5 bg-white/5 rounded-lg border border-white/10 text-xs text-[#E9DFC9]/90 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#E9DFC9] shrink-0 mt-0.5" />
              <span>
                <strong>Feeding Note:</strong> {config.rationTip}
              </span>
            </div>
          </div>

          {/* Right: Calculated Requirement Card */}
          <div className="lg:col-span-5 bg-[#F7F5EF] text-[#292B27] p-6 rounded-xl border border-white/30 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E1D8]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#697A45]">
                Monthly Requirement
              </span>
              <span className="font-mono text-xs text-[#595C54] tabular-nums">
                ~{monthlyTotalLbs} lbs / mo
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-bold text-[#263C2D] tabular-nums">
                  {bagsNeeded}
                </span>
                <span className="text-sm font-semibold text-[#292B27]">
                  &times; 50 lb Sacks
                </span>
              </div>
              <p className="text-xs text-[#595C54] font-medium">
                Recommended: {config.recommendedProductName}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E4E1D8] flex items-baseline justify-between text-xs">
              <span className="text-[#595C54]">Estimated Sample Cost:</span>
              <span className="font-mono text-lg font-bold text-[#263C2D] tabular-nums">
                {formatUSD(estimatedCost)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddCalculatedToPreOrder}
              disabled={!targetProduct}
              className={`w-full h-11 px-4 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                added
                  ? 'bg-[#697A45] text-white'
                  : 'bg-[#263C2D] hover:bg-[#1E3024] text-white shadow-sm'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added {bagsNeeded} Sacks to Pre-Order!</span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  <span>Add {bagsNeeded} Sacks to Pre-Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
