import { Recipe } from '../types/recipe';
import { SAMPLE_RECIPES } from './sampleRecipes';
import { ASIAN_RECIPES } from './recipes/asianRecipes';
import { EUROPEAN_RECIPES } from './recipes/europeanRecipes';
import { AMERICAS_AND_MORE_RECIPES } from './recipes/americasAndMoreRecipes';

export const ALL_GLOBAL_RECIPES: Recipe[] = [
  ...SAMPLE_RECIPES,
  ...ASIAN_RECIPES,
  ...EUROPEAN_RECIPES,
  ...AMERICAS_AND_MORE_RECIPES,
];

// Deduplicate just in case by ID
export const GLOBAL_RECIPES: Recipe[] = Array.from(
  new Map(ALL_GLOBAL_RECIPES.map((recipe) => [recipe.id, recipe])).values()
);

export function getRecipesByCuisine(cuisineName: string): Recipe[] {
  if (!cuisineName || cuisineName === 'All') return GLOBAL_RECIPES;
  const target = cuisineName.toLowerCase().trim();
  return GLOBAL_RECIPES.filter((r) => r.cuisine.toLowerCase().trim() === target);
}

export function getCuisineCount(cuisineName: string): number {
  if (!cuisineName || cuisineName === 'All') return GLOBAL_RECIPES.length;
  const target = cuisineName.toLowerCase().trim();
  return GLOBAL_RECIPES.filter((r) => r.cuisine.toLowerCase().trim() === target).length;
}

export function getRecipesByCountry(countryName: string): Recipe[] {
  if (!countryName || countryName === 'All') return GLOBAL_RECIPES;
  const target = countryName.toLowerCase().trim();
  return GLOBAL_RECIPES.filter((r) => r.country.toLowerCase().trim() === target);
}
