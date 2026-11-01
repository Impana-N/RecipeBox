import { useState } from 'react';
import {
  ArrowUpDown,
  SlidersHorizontal,
  RotateCcw,
  Globe,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SortOption, DietaryOption, PrepTimeFilter } from '../types/recipe';
import { CUISINES_DATA } from '../data/cuisines';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedCuisine: string;
  onSelectCuisine: (cuisine: string) => void;
  selectedDifficulty: string;
  onSelectDifficulty: (difficulty: string) => void;
  selectedDietary: DietaryOption;
  onSelectDietary: (dietary: DietaryOption) => void;
  selectedPrepTime: PrepTimeFilter;
  onSelectPrepTime: (prep: PrepTimeFilter) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  totalCount: number;
  onResetFilters: () => void;
  isFiltered: boolean;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Dishes', value: 'All' },
  { label: 'Breakfast', value: 'Breakfast' },
  { label: 'Lunch', value: 'Lunch' },
  { label: 'Supper', value: 'Supper' },
  { label: 'Snacks', value: 'Snacks' },
];

const DIFFICULTIES: string[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const DIETARY_OPTIONS: DietaryOption[] = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'High-Protein'];
const PREP_TIMES: PrepTimeFilter[] = ['All', 'Quick (< 20m)', 'Medium (20-40m)', 'Slow (40m+)'];

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  selectedCuisine,
  onSelectCuisine,
  selectedDifficulty,
  onSelectDifficulty,
  selectedDietary,
  onSelectDietary,
  selectedPrepTime,
  onSelectPrepTime,
  selectedSort,
  onSelectSort,
  totalCount,
  onResetFilters,
  isFiltered,
}: CategoryFilterProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="space-y-4 pt-2 pb-6 border-b border-[#E8DFC8]/70">
      
      {/* Row 1: Primary Meal Category & Sort / Count */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onSelectCategory(cat.value)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#214834] text-[#FAF7F2] shadow-xs'
                    : 'bg-white border border-[#E8DFC8] text-[#424C46] hover:bg-[#F8F4EE] hover:text-[#193828]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort and Count */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          <div className="flex items-center gap-2 text-xs text-[#6B7770]">
            <span className="font-semibold text-[#193828] tabular-nums">{totalCount}</span> dishes
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-[#E8DFC8] rounded-xl px-3 py-1.5 text-xs text-[#242A26] shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6B7770]" />
            <select
              value={selectedSort}
              onChange={(e) => onSelectSort(e.target.value as SortOption)}
              className="bg-transparent font-medium text-xs text-[#242A26] focus:outline-none cursor-pointer"
            >
              <option value="time-asc">Fastest Prep Time</option>
              <option value="time-desc">Longest Prep Time</option>
              <option value="name-asc">Recipe Name (A-Z)</option>
              <option value="name-desc">Recipe Name (Z-A)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              showAdvancedFilters || isFiltered
                ? 'bg-[#214834] text-white border-[#214834]'
                : 'bg-white border-[#E8DFC8] text-[#3E4741] hover:bg-[#F8F4EE]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {showAdvancedFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

      </div>

      {/* Row 2: Cuisine Quick Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-[#6B7770] font-semibold flex items-center gap-1 shrink-0">
          <Globe className="w-3.5 h-3.5 text-[#E06A26]" />
          Cuisine:
        </span>

        <button
          type="button"
          onClick={() => onSelectCuisine('All')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            selectedCuisine === 'All'
              ? 'bg-[#193828] text-white'
              : 'bg-white border border-[#E8DFC8] text-[#424C46] hover:bg-[#F3ECE1]'
          }`}
        >
          All 25 Cuisines
        </button>

        {CUISINES_DATA.map((c) => {
          const isSelected = selectedCuisine.toLowerCase() === c.name.toLowerCase();
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectCuisine(isSelected ? 'All' : c.name)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-[#214834] text-white shadow-2xs'
                  : 'bg-white border border-[#E8DFC8] text-[#424C46] hover:bg-[#F3ECE1]'
              }`}
            >
              <span role="img" aria-label={c.name} className="text-xs">{c.flag}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Row 3: Expandable Advanced Filters (Dietary, Difficulty, Prep Time) */}
      {showAdvancedFilters && (
        <div className="p-4 bg-white rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4 animate-in fade-in duration-150 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Dietary Preference Filter */}
            <div className="space-y-1.5">
              <span className="font-semibold text-[#193828] uppercase tracking-wider block">
                Dietary Preference
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onSelectDietary(opt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedDietary === opt
                        ? 'bg-[#214834] text-white'
                        : 'bg-[#FAF7F2] border border-[#E8DFC8] text-[#55625A] hover:bg-[#EFE9DF]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level Filter */}
            <div className="space-y-1.5">
              <span className="font-semibold text-[#193828] uppercase tracking-wider block">
                Skill Level
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => onSelectDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-[#214834] text-white'
                        : 'bg-[#FAF7F2] border border-[#E8DFC8] text-[#55625A] hover:bg-[#EFE9DF]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Preparation Time Filter */}
            <div className="space-y-1.5">
              <span className="font-semibold text-[#193828] uppercase tracking-wider block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#E06A26]" />
                Prep Duration
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PREP_TIMES.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => onSelectPrepTime(time)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedPrepTime === time
                        ? 'bg-[#214834] text-white'
                        : 'bg-[#FAF7F2] border border-[#E8DFC8] text-[#55625A] hover:bg-[#EFE9DF]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom active filters / reset */}
          <div className="pt-2 border-t border-[#F2ECE1] flex items-center justify-between">
            <span className="text-[#7C8880]">
              Filter combinations active
            </span>
            {isFiltered && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 font-semibold text-[#E06A26] hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Clear filters pill indicator if filtered but drawer closed */}
      {isFiltered && !showAdvancedFilters && (
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex flex-wrap items-center gap-1.5 text-[#738078]">
            <span>Active filters:</span>
            {selectedCuisine !== 'All' && (
              <span className="px-2 py-0.5 rounded-md bg-[#FAF0E6] text-[#E06A26] font-semibold border border-[#F3D7C4]">
                Cuisine: {selectedCuisine}
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="px-2 py-0.5 rounded-md bg-[#EBF3EE] text-[#214834] font-semibold border border-[#C2DBCB]">
                {selectedCategory}
              </span>
            )}
            {selectedDietary !== 'All' && (
              <span className="px-2 py-0.5 rounded-md bg-[#EBF3EE] text-[#214834] font-semibold border border-[#C2DBCB]">
                {selectedDietary}
              </span>
            )}
            {selectedDifficulty !== 'All' && (
              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold border border-stone-200">
                {selectedDifficulty}
              </span>
            )}
            {selectedPrepTime !== 'All' && (
              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold border border-stone-200">
                {selectedPrepTime}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 font-medium text-xs text-[#E06A26] hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        </div>
      )}

    </div>
  );
}
