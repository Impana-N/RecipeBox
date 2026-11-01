import React, { useState } from 'react';
import { Search, Sparkles, Clock, Flame, ArrowRight, X } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  onSelectCategory: (category: string) => void;
  activeCategory: string;
  featuredRecipe?: Recipe;
  onOpenRecipe: (recipe: Recipe) => void;
  onSurpriseMe: () => void;
}

export function Hero({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectCategory,
  activeCategory,
  featuredRecipe,
  onOpenRecipe,
  onSurpriseMe,
}: HeroProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
    onSearchSubmit('');
  };

  const categories = ['Breakfast', 'Lunch', 'Supper', 'Snacks'];

  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:py-16">
      {/* Decorative subtle ambient warmth */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F3ECE1]/70 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#E06A26]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold tracking-wider text-[#E06A26] uppercase">
                The Culinary Almanac
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#193828] leading-[1.12] text-balance">
                Discover Your Next Favourite Meal
              </h1>
              <p className="text-base sm:text-lg text-[#525E56] max-w-xl leading-relaxed">
                Explore handcrafted recipes, search thousands of dishes from TheMealDB, and keep your kitchen organized with customized recipe collections.
              </p>
            </div>

            {/* Prominent Search Bar */}
            <form onSubmit={handleSubmit} className="relative max-w-xl">
              <div className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-sm border border-[#E8DFC8] focus-within:border-[#214834] focus-within:ring-2 focus-within:ring-[#214834]/15 transition-all">
                <Search className="w-5 h-5 text-[#86928A] ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => {
                    setLocalQuery(e.target.value);
                    onSearchChange(e.target.value);
                  }}
                  placeholder="Search 100+ dishes, countries (Italy, Mexico, Japan), or ingredients..."
                  className="w-full px-3 py-2.5 text-sm sm:text-base bg-transparent text-[#193828] placeholder-[#9CA6A0] focus:outline-none"
                />
                {localQuery && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 mr-1 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-[#FAF7F2] bg-[#214834] hover:bg-[#193828] rounded-xl transition-colors shrink-0 shadow-xs"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Popular category shortcuts & Surprise Me */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-[#7C8880] mr-1">Popular:</span>
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onSelectCategory(isActive ? 'All' : cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#214834] text-[#FAF7F2] shadow-2xs'
                        : 'bg-white border border-[#E8DFC8] text-[#3D4741] hover:border-[#214834]/40 hover:bg-[#FDFBF7]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={onSurpriseMe}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FAF0E6] text-[#E06A26] border border-[#F3D7C4] hover:bg-[#F8E3D4] transition-colors ml-auto sm:ml-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E06A26]" />
                <span>Surprise Me</span>
              </button>
            </div>
          </div>

          {/* Right Hero Column: Featured Recipe Showcase */}
          {featuredRecipe && (
            <div className="lg:col-span-5">
              <div 
                onClick={() => onOpenRecipe(featuredRecipe)}
                className="group relative bg-white rounded-3xl p-3 border border-[#E8DFC8] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-100">
                  <img
                    src={featuredRecipe.image}
                    alt={featuredRecipe.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Subtle category & featured indicator */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-white/90 backdrop-blur-xs text-[#193828] shadow-xs">
                      Today's Selection
                    </span>
                  </div>

                  {/* Card bottom details */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <div className="flex items-center gap-2 text-xs text-stone-200 mb-1">
                      <span>{featuredRecipe.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredRecipe.cookTime} mins
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        {featuredRecipe.difficulty}
                      </span>
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold leading-snug line-clamp-1 group-hover:text-amber-200 transition-colors">
                      {featuredRecipe.title}
                    </h3>
                  </div>
                </div>

                <div className="pt-3 pb-1 px-1 flex items-center justify-between text-xs text-[#525E56]">
                  <span className="truncate max-w-[200px]">
                    {featuredRecipe.ingredients.length} ingredients · {featuredRecipe.servings} servings
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#214834] group-hover:text-[#193828] group-hover:translate-x-0.5 transition-all">
                    View Recipe <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
