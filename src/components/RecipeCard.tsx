import React, { useState } from 'react';
import { Heart, Clock, Bookmark, BookmarkCheck, Utensils, Globe } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { CUISINES_DATA } from '../data/cuisines';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  isSaved: boolean;
  onToggleFavorite: (recipe: Recipe, e: React.MouseEvent) => void;
  onToggleSave: (recipe: Recipe, e: React.MouseEvent) => void;
  onClick: () => void;
}

export function RecipeCard({
  recipe,
  isFavorite,
  isSaved,
  onToggleFavorite,
  onToggleSave,
  onClick,
}: RecipeCardProps) {
  const [imageError, setImageError] = useState(false);

  // Find flag matching cuisine or country
  const cuisineInfo = CUISINES_DATA.find(
    (c) => c.name.toLowerCase() === recipe.cuisine?.toLowerCase() || c.country.toLowerCase() === recipe.country?.toLowerCase()
  );

  return (
    <article
      onClick={onClick}
      className="group bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Media Slot */}
      <div className="relative aspect-4/3 w-full bg-[#F3ECE1] overflow-hidden">
        {!imageError ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#F3ECE1] text-[#78857E] p-4 text-center">
            <Utensils className="w-8 h-8 mb-2 opacity-50 text-[#214834]" />
            <span className="text-xs font-medium font-display">{recipe.title}</span>
          </div>
        )}

        {/* Origin Badge overlay */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-white text-[11px] font-medium">
          {cuisineInfo?.flag && <span role="img" aria-label={recipe.country}>{cuisineInfo.flag}</span>}
          <span>{recipe.cuisine || recipe.country || 'Global'}</span>
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => onToggleFavorite(recipe, e)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-xs ${
            isFavorite
              ? 'bg-[#E06A26] text-white scale-110'
              : 'bg-white/90 text-[#54625A] hover:text-[#E06A26] hover:bg-white hover:scale-105'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Save Bookmark Button */}
        <button
          type="button"
          onClick={(e) => onToggleSave(recipe, e)}
          aria-label={isSaved ? 'Saved to My Recipes' : 'Save to My Recipes'}
          className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-xs ${
            isSaved
              ? 'bg-[#214834] text-white scale-105'
              : 'bg-white/90 text-[#54625A] hover:text-[#214834] hover:bg-white hover:scale-105'
          }`}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4 fill-current" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Content Slot */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Zero-Pill Metadata Line */}
          <div className="flex items-center gap-1.5 text-xs text-[#738078] font-medium flex-wrap">
            <span className="text-[#E06A26] font-semibold">{recipe.category}</span>
            <span aria-hidden="true" className="text-[#C2BAAB]">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#88968E]" />
              <span className="tabular-nums">{recipe.prepTime + recipe.cookTime}</span>m total
            </span>
            <span aria-hidden="true" className="text-[#C2BAAB]">·</span>
            <span>{recipe.difficulty}</span>
          </div>

          {/* Recipe Title */}
          <h3 className="font-display text-base sm:text-lg font-semibold text-[#193828] leading-snug group-hover:text-[#214834] line-clamp-2 transition-colors">
            {recipe.title}
          </h3>

          {/* Dietary tags as quiet text */}
          {recipe.dietary && recipe.dietary.length > 0 && (
            <p className="text-[11px] text-[#86928A] line-clamp-1">
              {recipe.dietary.join(' · ')}
            </p>
          )}
        </div>

        {/* Card Footer: Ingredients and Servings Preview */}
        <div className="pt-3 mt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs text-[#738078]">
          <span className="tabular-nums truncate max-w-[150px]">
            {recipe.country || recipe.cuisine}
          </span>
          <span className="tabular-nums">
            {recipe.servings} servings
          </span>
        </div>
      </div>
    </article>
  );
}
