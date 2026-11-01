import { useState } from 'react';
import { ArrowRight, Globe, Utensils, Compass, Sparkles } from 'lucide-react';
import { CUISINES_DATA } from '../data/cuisines';
import { CuisineInfo } from '../types/recipe';
import { getCuisineCount } from '../data/globalRecipes';

interface CuisineExplorerProps {
  onSelectCuisine: (cuisineName: string) => void;
  selectedCuisine: string;
}

const REGIONS = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Middle East', 'Africa', 'Oceania'];

export function CuisineExplorer({ onSelectCuisine, selectedCuisine }: CuisineExplorerProps) {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCuisines = CUISINES_DATA.filter((cuisine) => {
    const matchesRegion =
      selectedRegion === 'All' ||
      (selectedRegion === 'Asia' && (cuisine.region.includes('Asia') || cuisine.region.includes('Southeast'))) ||
      (selectedRegion === 'Europe' && (cuisine.region.includes('Europe') || cuisine.region === 'Mediterranean')) ||
      (selectedRegion === 'North America' && (cuisine.region.includes('North America') || cuisine.region === 'Caribbean')) ||
      (selectedRegion === 'South America' && cuisine.region.includes('South America')) ||
      (selectedRegion === 'Middle East' && cuisine.region.includes('Middle East')) ||
      (selectedRegion === 'Africa' && cuisine.region.includes('Africa')) ||
      (selectedRegion === 'Oceania' && cuisine.region.includes('Oceania'));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      cuisine.name.toLowerCase().includes(q) ||
      cuisine.country.toLowerCase().includes(q) ||
      cuisine.famousDishes.some(d => d.toLowerCase().includes(q));

    return matchesRegion && matchesSearch;
  });

  return (
    <section className="space-y-8 py-4">
      {/* Editorial Title Banner */}
      <div className="bg-gradient-to-br from-[#193828] to-[#10251A] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-md">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#E06A26]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-amber-200">
            <Globe className="w-3.5 h-3.5 text-[#E06A26]" />
            <span>25 Global Culinary Traditions</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
            Take Your Taste Buds Around the World 🌍
          </h2>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl">
            From the bustling street stalls of Bangkok and fragrant tandoors of Punjab to cozy Parisian bistros and coastal Mediterranean villages—explore our curated encyclopedia of international dishes.
          </p>

          {/* Region Tabs */}
          <div className="pt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {REGIONS.map((region) => {
              const active = selectedRegion === region;
              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#E06A26] text-white shadow-xs'
                      : 'bg-white/10 text-stone-200 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cuisines Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#6B7770]">
          <span>Showing <strong className="text-[#193828] tabular-nums font-semibold">{filteredCuisines.length}</strong> world cuisines</span>
          {selectedCuisine !== 'All' && (
            <button
              type="button"
              onClick={() => onSelectCuisine('All')}
              className="text-[#E06A26] hover:underline font-semibold"
            >
              Clear cuisine filter ({selectedCuisine})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCuisines.map((cuisine) => {
            const count = getCuisineCount(cuisine.name);
            const isSelected = selectedCuisine.toLowerCase() === cuisine.name.toLowerCase();

            return (
              <div
                key={cuisine.id}
                onClick={() => onSelectCuisine(cuisine.name)}
                className={`group bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#214834] ring-2 ring-[#214834]/20 shadow-md'
                    : 'border-[#E8DFC8] hover:border-[#214834]/40'
                }`}
              >
                {/* Media header */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-[#F3ECE1]">
                  <img
                    src={cuisine.image}
                    alt={cuisine.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {/* Flag and recipe count badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-2xl filter drop-shadow-sm select-none" role="img" aria-label={cuisine.name}>
                      {cuisine.flag}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/95 backdrop-blur-xs text-[#193828] shadow-xs tabular-nums">
                      {count} Recipes
                    </span>
                  </div>

                  {/* Name and Region on photo */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-medium text-amber-200 tracking-wider uppercase block">
                      {cuisine.country} · {cuisine.region}
                    </span>
                    <h3 className="font-display text-xl font-bold tracking-tight text-white group-hover:text-amber-100 transition-colors">
                      {cuisine.name} Cuisine
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-[#525E56] line-clamp-2 leading-relaxed">
                    {cuisine.description}
                  </p>

                  {/* Famous signature dishes */}
                  <div className="space-y-1 pt-1 border-t border-[#F2ECE1]">
                    <span className="text-[11px] font-semibold text-[#86928A] uppercase tracking-wider block">
                      Famous Specialties:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {cuisine.famousDishes.slice(0, 3).map((dish) => (
                        <span
                          key={dish}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#3D4741] border border-[#E8DFC8]/60"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Explore Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCuisine(cuisine.name);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-[#214834] text-white shadow-xs'
                          : 'bg-[#F1E9DB] text-[#193828] group-hover:bg-[#214834] group-hover:text-white'
                      }`}
                    >
                      <span>{isSelected ? 'Viewing Dishes' : `Explore ${cuisine.name}`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
