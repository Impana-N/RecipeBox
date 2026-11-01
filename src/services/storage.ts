import { Recipe } from '../types/recipe';

const SAVED_RECIPES_KEY = 'recipebox_saved_recipes';
const FAVORITES_KEY = 'recipebox_favorites_ids';

export function getSavedRecipes(): Recipe[] {
  try {
    const raw = localStorage.getItem(SAVED_RECIPES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved recipes from localStorage:', e);
    return [];
  }
}

export function saveRecipe(recipe: Recipe): { success: boolean; isDuplicate: boolean } {
  try {
    const current = getSavedRecipes();
    const exists = current.some(r => r.id === recipe.id || r.title.toLowerCase().trim() === recipe.title.toLowerCase().trim());
    if (exists) {
      return { success: false, isDuplicate: true };
    }
    const updated = [
      {
        ...recipe,
        dateAdded: recipe.dateAdded || new Date().toISOString(),
      },
      ...current,
    ];
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updated));
    return { success: true, isDuplicate: false };
  } catch (e) {
    console.error('Failed to save recipe to localStorage:', e);
    return { success: false, isDuplicate: false };
  }
}

export function updateCustomRecipe(recipe: Recipe): boolean {
  try {
    const current = getSavedRecipes();
    const index = current.findIndex(r => r.id === recipe.id);
    if (index === -1) {
      // If not yet in saved, add it
      return saveRecipe(recipe).success;
    }
    current[index] = {
      ...recipe,
      dateAdded: current[index].dateAdded || new Date().toISOString(),
    };
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(current));
    return true;
  } catch (e) {
    console.error('Failed to update custom recipe in localStorage:', e);
    return false;
  }
}

export function deleteSavedRecipe(recipeId: string): boolean {
  try {
    const current = getSavedRecipes();
    const filtered = current.filter(r => r.id !== recipeId);
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to delete recipe from localStorage:', e);
    return false;
  }
}

export function isRecipeSaved(recipeId: string, recipeTitle?: string): boolean {
  const current = getSavedRecipes();
  return current.some(r => r.id === recipeId || (recipeTitle && r.title.toLowerCase().trim() === recipeTitle.toLowerCase().trim()));
}

export function getFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse favorites from localStorage:', e);
    return [];
  }
}

export function toggleFavorite(recipeId: string): boolean {
  try {
    const current = getFavoriteIds();
    const exists = current.includes(recipeId);
    let updated: string[];
    if (exists) {
      updated = current.filter(id => id !== recipeId);
    } else {
      updated = [...current, recipeId];
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return !exists; // returns true if now favorited, false if removed
  } catch (e) {
    console.error('Failed to toggle favorite in localStorage:', e);
    return false;
  }
}

export function isFavorite(recipeId: string): boolean {
  const current = getFavoriteIds();
  return current.includes(recipeId);
}
