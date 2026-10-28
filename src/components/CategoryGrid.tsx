import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { FEED_CATEGORIES } from '../data/categories';
import { SmartImage } from './SmartImage';
import { Reveal } from './Reveal';
import { useStore } from '../context/StoreContext';

const CATEGORY_EMBLEMS: Record<string, { icon: string; tag: string }> = {
  livestock: { icon: '🐂', tag: 'Cattle · Horses · Goats' },
  poultry: { icon: '🐔', tag: 'Layers · Broilers · Chicks' },
  pigeon: { icon: '🕊️', tag: 'Loft · Fanciers · Breeders' },
  supplies: { icon: '🌾', tag: 'Whole Grain · Salt Blocks' },
};

export function CategoryGrid() {
  const { products } = useStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {FEED_CATEGORIES.map((category, idx) => {
        const emblem = CATEGORY_EMBLEMS[category.id] || { icon: '🌾', tag: 'Feed Supply' };
        const count = products.filter((p) => p.category === category.id).length;

        return (
          <Reveal key={category.id} delay={idx * 0.06}>
            <Link
              to={`/shop?category=${category.id}`}
              className="group flex flex-col h-full bg-white border border-[#E4E1D8] rounded-2xl overflow-hidden hover:border-[#263C2D] hover:shadow-lg transition-all duration-300 relative"
            >
              {/* Arched image container */}
              <div className="aspect-[4/3] w-full relative overflow-hidden bg-[#E9DFC9]/20 border-b border-[#E4E1D8]">
                <SmartImage
                  src={category.image}
                  alt={category.imageAlt}
                  fallbackTitle={category.name}
                  className="w-full h-full"
                  imgClassName="transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Floating Animal Emblem Badge */}
                <div className="absolute top-3 left-3 bg-[#263C2D]/90 text-white backdrop-blur-xs px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 shadow-sm">
                  <span>{emblem.icon}</span>
                  <span className="font-semibold text-[11px]">{category.shortName}</span>
                </div>

                {/* Sample Sacks Count */}
                <div className="absolute bottom-2.5 right-2.5 bg-white/95 text-[#292B27] backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono font-medium shadow-xs">
                  {count} sample feeds
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-[#697A45] uppercase tracking-wider">
                    {emblem.tag}
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#292B27] group-hover:text-[#263C2D] transition-colors leading-snug">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[#595C54] leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E4E1D8] flex items-center justify-between text-xs font-semibold text-[#263C2D]">
                  <span>Explore {category.shortName}</span>
                  <div className="w-6 h-6 rounded-full bg-[#F7F5EF] group-hover:bg-[#263C2D] group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
