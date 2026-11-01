import { useState, useMemo } from 'react';
import {
  X,
  Heart,
  Bookmark,
  BookmarkCheck,
  Clock,
  Flame,
  Users,
  Check,
  RotateCcw,
  Printer,
  ExternalLink,
  Edit3,
  Trash2,
  ChefHat,
  Sparkles,
} from 'lucide-react';
import { Recipe } from '../types/recipe';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  isFavorite: boolean;
  isSaved: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
  onToggleSave: (recipe: Recipe) => void;
  onEditRecipe?: (recipe: Recipe) => void;
  onDeleteRecipe?: (recipe: Recipe) => void;
}

// Helper to scale quantities intelligently
function scaleQuantity(amountStr: string, factor: number): string {
  if (factor === 1 || !amountStr) return amountStr;
  
  // Try matching numbers, fractions (e.g., "1 1/2", "3/4", "2.5", "2")
  return amountStr.replace(/(\d+\s+\d+\/\d+|\d+\/\d+|\d+(\.\d+)?)/g, (match) => {
    let val = 0;
    if (match.includes('/')) {
      const parts = match.trim().split(/\s+/);
      if (parts.length === 2) {
        const whole = parseFloat(parts[0]);
        const [num, den] = parts[1].split('/').map(Number);
        val = whole + (num / den);
      } else {
        const [num, den] = match.split('/').map(Number);
        val = num / den;
      }
    } else {
      val = parseFloat(match);
    }

    if (isNaN(val)) return match;

    const scaled = val * factor;
    // Format nicely
    if (Number.isInteger(scaled)) return scaled.toString();
    // Round to 1 decimal place or nice fraction if close
    return scaled.toFixed(1).replace(/\.0$/, '');
  });
}

export function RecipeModal({
  recipe,
  onClose,
  isFavorite,
  isSaved,
  onToggleFavorite,
  onToggleSave,
  onEditRecipe,
  onDeleteRecipe,
}: RecipeModalProps) {
  if (!recipe) return null;

  const [currentServings, setCurrentServings] = useState<number>(recipe.servings || 4);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const scaleFactor = useMemo(() => {
    const base = recipe.servings || 4;
    return currentServings / base;
  }, [currentServings, recipe.servings]);

  const toggleIngredientCheck = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleStepComplete = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const resetProgress = () => {
    setCheckedIngredients({});
    setCompletedSteps({});
  };

  const checkedCount = Object.values(checkedIngredients).filter(Boolean).length;
  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl border border-[#E8DFC8] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header Close & Quick Action Bar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleFavorite(recipe)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              isFavorite
                ? 'bg-[#E06A26] text-white scale-105'
                : 'bg-white/90 text-[#36423B] hover:text-[#E06A26] hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => onToggleSave(recipe)}
            aria-label={isSaved ? 'Saved in My Recipes' : 'Save to My Recipes'}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              isSaved
                ? 'bg-[#214834] text-white'
                : 'bg-white/90 text-[#36423B] hover:text-[#214834] hover:bg-white'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2.5 rounded-full bg-white/90 text-[#36423B] hover:text-black hover:bg-white backdrop-blur-md transition-all shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 divide-y divide-[#E8DFC8]/60">
          
          {/* Top Hero Media */}
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full bg-[#EFE9DF] overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10251A]/85 via-[#10251A]/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-200">
                <span className="text-white bg-[#E06A26] px-2 py-0.5 rounded-md font-semibold text-xs">
                  {recipe.country || recipe.cuisine || 'International'}
                </span>
                <span className="text-[#F6B287] font-semibold">{recipe.cuisine} Cuisine</span>
                <span aria-hidden="true">·</span>
                <span>{recipe.category}</span>
                <span aria-hidden="true">·</span>
                <span>{recipe.mealType}</span>
                {recipe.source === 'custom' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-300">My Custom Recipe</span>
                  </>
                )}
                {recipe.source === 'themealdb' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-200">TheMealDB Source</span>
                  </>
                )}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-white">
                {recipe.title}
              </h2>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="px-6 py-4 bg-white grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#214834]" />
              <div>
                <p className="text-[#7C8880] text-xs">Prep Time</p>
                <p className="font-semibold text-[#193828] tabular-nums">{recipe.prepTime} mins</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#E06A26]" />
              <div>
                <p className="text-[#7C8880] text-xs">Cook Time</p>
                <p className="font-semibold text-[#193828] tabular-nums">{recipe.cookTime} mins</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#214834]" />
              <div>
                <p className="text-[#7C8880] text-xs">Servings</p>
                <div className="flex items-center gap-2 font-semibold text-[#193828]">
                  <button
                    type="button"
                    onClick={() => setCurrentServings((s) => Math.max(1, s - 1))}
                    className="w-5 h-5 flex items-center justify-center rounded-sm bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                    aria-label="Decrease servings"
                  >
                    -
                  </button>
                  <span className="tabular-nums">{currentServings}</span>
                  <button
                    type="button"
                    onClick={() => setCurrentServings((s) => Math.min(20, s + 1))}
                    className="w-5 h-5 flex items-center justify-center rounded-sm bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                    aria-label="Increase servings"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-[#E06A26]" />
              <div>
                <p className="text-[#7C8880] text-xs">Difficulty</p>
                <p className="font-semibold text-[#193828]">{recipe.difficulty}</p>
              </div>
            </div>
          </div>

          {/* Main Content: 2-Column Split (Ingredients Checklist + Instructions) */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#FAF7F2]">
            
            {/* Ingredients Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#193828]">
                    Ingredients
                  </h3>
                  <p className="text-xs text-[#7C8880]">
                    {checkedCount} of {recipe.ingredients.length} prepared
                  </p>
                </div>

                {(checkedCount > 0 || completedStepsCount > 0) && (
                  <button
                    type="button"
                    onClick={resetProgress}
                    className="text-xs text-[#E06A26] hover:underline flex items-center gap-1 font-medium"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Interactive Ingredient Checkboxes */}
              <ul className="space-y-2 text-sm">
                {recipe.ingredients.map((ing, idx) => {
                  const isChecked = !!checkedIngredients[idx];
                  const displayAmount = scaleQuantity(ing.amount, scaleFactor);
                  return (
                    <li
                      key={idx}
                      onClick={() => toggleIngredientCheck(idx)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'bg-[#EBF3EE] border-[#C2DBCB] text-[#55695D]'
                          : 'bg-white border-[#E8DFC8] text-[#242A26] hover:border-[#214834]/40'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-[#214834] border-[#214834] text-white'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1 flex justify-between gap-2">
                        <span className={`font-medium ${isChecked ? 'line-through text-stone-400' : ''}`}>
                          {ing.name}
                        </span>
                        <span className={`text-xs font-semibold tabular-nums text-right shrink-0 ${isChecked ? 'text-stone-400' : 'text-[#E06A26]'}`}>
                          {displayAmount}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {scaleFactor !== 1 && (
                <p className="text-xs text-[#7C8880] italic">
                  * Ingredient quantities automatically scaled for {currentServings} servings.
                </p>
              )}

              {/* Tags if available */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="pt-3 border-t border-[#E8DFC8]/60">
                  <p className="text-xs font-medium text-[#7C8880] mb-1.5">Tags:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {recipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-md bg-[#F1E9DB] text-[#424C46]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* YouTube video guide link if provided */}
              {recipe.youtubeUrl && (
                <div className="pt-2">
                  <a
                    href={recipe.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#E06A26] hover:text-[#C8591A] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Watch cooking video on YouTube
                  </a>
                </div>
              )}
            </div>

            {/* Instructions Column */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#193828]">
                    Cooking Instructions
                  </h3>
                  <p className="text-xs text-[#7C8880]">
                    Step-by-step preparation guide
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 text-xs text-[#525E56] hover:text-[#193828] bg-white border border-[#E8DFC8] px-2.5 py-1 rounded-lg shadow-2xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
              </div>

              <div className="space-y-3">
                {recipe.instructions.map((step, idx) => {
                  const isDone = !!completedSteps[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStepComplete(idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isDone
                          ? 'bg-[#EBF3EE]/60 border-[#C2DBCB]'
                          : 'bg-white border-[#E8DFC8] hover:border-[#214834]/40'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isDone
                              ? 'bg-[#214834] text-white'
                              : 'bg-[#F1E9DB] text-[#193828]'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </span>
                        <p className={`text-sm leading-relaxed ${isDone ? 'text-stone-500 line-through' : 'text-[#2D3631]'}`}>
                          {step}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="px-6 py-4 bg-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleSave(recipe)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all ${
                  isSaved
                    ? 'bg-[#F1E9DB] text-[#193828] hover:bg-[#E8DFC8]'
                    : 'bg-[#214834] text-[#FAF7F2] hover:bg-[#193828] shadow-xs'
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-[#214834]" />
                    <span>Saved in My Recipes</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save to My Recipes</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onToggleFavorite(recipe)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 border transition-colors ${
                  isFavorite
                    ? 'bg-[#FDF3EC] border-[#F4CEB4] text-[#E06A26]'
                    : 'bg-white border-[#E8DFC8] text-[#424C46] hover:bg-[#FAF7F2]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {recipe.isCustom && onEditRecipe && (
                <button
                  type="button"
                  onClick={() => onEditRecipe(recipe)}
                  className="px-3 py-2 text-xs font-medium text-[#214834] bg-[#EBF3EE] hover:bg-[#D9E9DF] rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}

              {(isSaved || recipe.isCustom) && onDeleteRecipe && (
                <button
                  type="button"
                  onClick={() => onDeleteRecipe(recipe)}
                  className="px-3 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
