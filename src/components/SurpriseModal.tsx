import { useState, useEffect } from 'react';
import { Sparkles, X, Clock, Flame, RotateCw, ArrowRight, Bookmark } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { getRandomMeal } from '../services/mealDbApi';
import { SAMPLE_RECIPES } from '../data/sampleRecipes';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRecipe: (recipe: Recipe) => void;
  onSaveRecipe: (recipe: Recipe) => void;
  isSaved: (id: string, title: string) => boolean;
}

export function SurpriseModal({
  isOpen,
  onClose,
  onOpenRecipe,
  onSaveRecipe,
  isSaved,
}: SurpriseModalProps) {
  if (!isOpen) return null;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRandom = async () => {
    setLoading(true);
    setError('');
    try {
      // Try TheMealDB first
      const meal = await getRandomMeal();
      setRecipe(meal);
    } catch {
      // Fallback to random sample recipe if offline or rate limited
      const randomIdx = Math.floor(Math.random() * SAMPLE_RECIPES.length);
      setRecipe(SAMPLE_RECIPES[randomIdx]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandom();
  }, [isOpen]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl border border-[#E8DFC8] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFC8] bg-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E06A26] animate-bounce" />
            <span className="font-display font-semibold text-lg text-[#193828]">
              Chef's Surprise
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-3 border-[#214834]/20 border-t-[#214834] animate-spin" />
              <p className="font-display text-sm text-[#193828] font-medium">
                Rolling the kitchen dice...
              </p>
            </div>
          ) : recipe ? (
            <div className="space-y-4">
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-stone-100 border border-[#E8DFC8]">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">
                    {recipe.category}
                  </span>
                  <h3 className="font-display text-xl font-bold line-clamp-1">
                    {recipe.title}
                  </h3>
                </div>
              </div>

              {/* Quick details */}
              <div className="flex items-center justify-between text-xs text-[#525E56] px-1">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#214834]" />
                  {recipe.cookTime} mins cook
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Flame className="w-3.5 h-3.5 text-[#E06A26]" />
                  {recipe.difficulty}
                </span>
                <span className="font-medium">
                  {recipe.ingredients.length} ingredients
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E8DFC8] text-xs text-[#525E56] line-clamp-3 leading-relaxed">
                {recipe.instructions[0] || 'A delicious dish waiting to be discovered.'}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={fetchRandom}
                  className="px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] bg-white text-xs font-medium text-[#242A26] hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#525E56]" />
                  <span>Spin Again</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSaveRecipe(recipe);
                  }}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isSaved(recipe.id, recipe.title)
                      ? 'bg-[#EBF3EE] border-[#C2DBCB] text-[#214834]'
                      : 'bg-white border-[#E8DFC8] text-[#242A26] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isSaved(recipe.id, recipe.title) ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRecipe(recipe);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#214834] hover:bg-[#193828] text-white text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Cook This Recipe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-stone-600">Could not find a surprise recipe. Try again.</p>
              <button
                type="button"
                onClick={fetchRandom}
                className="mt-3 px-4 py-2 bg-[#214834] text-white text-xs rounded-xl"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
