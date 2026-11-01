import { Recipe, MealCategory, DifficultyLevel, Ingredient } from '../types/recipe';

interface MealDbMeal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  [key: string]: string | null | undefined;
}

interface MealDbResponse {
  meals: MealDbMeal[] | null;
}

// Maps TheMealDB category to our 4 core categories
function mapToCategory(mealDbCategory?: string | null, area?: string | null): MealCategory {
  const cat = (mealDbCategory || '').toLowerCase();
  const safeArea = (area || '').toLowerCase();
  if (cat.includes('breakfast')) return 'Breakfast';
  if (cat.includes('dessert') || cat.includes('starter') || cat.includes('side') || cat.includes('snack')) {
    return 'Snacks';
  }
  if (cat.includes('beef') || cat.includes('lamb') || cat.includes('pork') || cat.includes('goat')) {
    return 'Supper';
  }
  if (cat.includes('chicken') || cat.includes('pasta') || cat.includes('seafood') || cat.includes('vegetarian') || cat.includes('vegan')) {
    return (cat.includes('vegetarian') || cat.includes('vegan') || safeArea.includes('american')) ? 'Lunch' : 'Supper';
  }
  return 'Supper';
}

function estimateDifficulty(ingredientsCount: number, stepsCount: number): DifficultyLevel {
  if (ingredientsCount <= 6 && stepsCount <= 4) return 'Beginner';
  if (ingredientsCount >= 11 || stepsCount >= 8) return 'Advanced';
  return 'Intermediate';
}

function estimateTimes(stepsCount: number, ingredientsCount: number): { prepTime: number; cookTime: number } {
  const prepTime = Math.min(45, Math.max(10, Math.round(ingredientsCount * 2.5)));
  const cookTime = Math.min(75, Math.max(15, Math.round(stepsCount * 4)));
  return { prepTime, cookTime };
}

function parseInstructions(raw: string): string[] {
  if (!raw) return ['Follow standard cooking procedures for this recipe.'];
  
  const clean = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  let steps = clean
    .split(/\n\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (steps.length <= 1) {
    steps = clean
      .split(/\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  if (steps.length <= 1) {
    steps = clean
      .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
      .map(s => s.trim())
      .filter(s => s.length > 15);
  }

  const cleanedSteps = steps.map(s => s.replace(/^(step\s*\d+[:.]?|\d+[\).\s-]+)/i, '').trim()).filter(s => s.length > 0);
  return cleanedSteps.length > 0 ? cleanedSteps : [clean];
}

function extractIngredients(meal: MealDbMeal): Ingredient[] {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingKey = `strIngredient${i}`;
    const measKey = `strMeasure${i}`;
    const ingVal = meal[ingKey]?.trim();
    const measVal = meal[measKey]?.trim() || '';

    if (ingVal && ingVal.length > 0) {
      ingredients.push({
        name: ingVal,
        amount: measVal || 'To taste',
      });
    }
  }
  return ingredients;
}

function inferDietary(ingredients: Ingredient[], category?: string | null): string[] {
  const text = (ingredients.map(i => i.name || '').join(' ') + ' ' + (category || '')).toLowerCase();
  const dietary: string[] = [];

  const meatTerms = ['chicken', 'beef', 'pork', 'lamb', 'mutton', 'duck', 'turkey', 'bacon', 'sausage', 'veal', 'meat'];
  const seafoodTerms = ['fish', 'salmon', 'tuna', 'prawn', 'shrimp', 'crab', 'lobster', 'clam', 'mussel', 'squid'];
  const dairyTerms = ['milk', 'cheese', 'cream', 'butter', 'yogurt', 'paneer', 'ricotta', 'mozzarella'];

  const hasMeat = meatTerms.some(term => text.includes(term));
  const hasSeafood = seafoodTerms.some(term => text.includes(term));
  const hasDairy = dairyTerms.some(term => text.includes(term));

  if (!hasMeat && !hasSeafood) {
    dietary.push('Vegetarian');
    if (!hasDairy && !text.includes('egg') && !text.includes('honey')) {
      dietary.push('Vegan');
    }
  }

  if (hasMeat || hasSeafood || text.includes('protein') || text.includes('egg')) {
    dietary.push('High-Protein');
  }

  if (!text.includes('flour') && !text.includes('bread') && !text.includes('pasta') && !text.includes('wheat') && !text.includes('noodle')) {
    dietary.push('Gluten-Free');
  }

  return dietary;
}

// Convert TheMealDB meal into our standardized Recipe object
export function transformMealDbRecipe(meal: MealDbMeal): Recipe {
  const ingredients = extractIngredients(meal);
  const instructions = parseInstructions(meal.strInstructions || '');
  const { prepTime, cookTime } = estimateTimes(instructions.length, ingredients.length);
  const difficulty = estimateDifficulty(ingredients.length, instructions.length);
  const category = mapToCategory(meal.strCategory, meal.strArea);
  const dietary = inferDietary(ingredients, meal.strCategory);

  const fallbackTags = [meal.strCategory, meal.strArea].filter((t): t is string => typeof t === 'string' && t.trim().length > 0);
  const tags = typeof meal.strTags === 'string' && meal.strTags.trim().length > 0
    ? meal.strTags.split(',').map(t => t.trim()).filter(Boolean)
    : fallbackTags;

  const country = (meal.strArea && meal.strArea.trim()) || 'International';
  const cuisine = (meal.strArea && meal.strArea.trim()) || 'International';

  return {
    id: `mealdb-${meal.idMeal || Date.now()}`,
    title: meal.strMeal || 'International Dish',
    country,
    cuisine,
    region: meal.strArea || 'Global',
    category,
    mealType: meal.strCategory || 'Main Dish',
    difficulty,
    prepTime,
    cookTime,
    servings: 4,
    image: meal.strMealThumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    ingredients,
    instructions,
    source: 'themealdb',
    dietary,
    tags,
    youtubeUrl: meal.strYoutube || undefined,
  };
}

export async function searchMealsByName(query: string): Promise<Recipe[]> {
  if (!query || !query.trim()) return [];
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query.trim())}`);
    if (!res.ok) {
      throw new Error(`TheMealDB API error: ${res.status}`);
    }
    const data: MealDbResponse = await res.json();
    if (!data.meals) return [];
    return data.meals.map(transformMealDbRecipe);
  } catch (error) {
    console.error('Failed to search recipes from TheMealDB:', error);
    throw error;
  }
}

export async function filterMealsByArea(area: string): Promise<Recipe[]> {
  if (!area || !area.trim()) return [];
  try {
    // filter.php returns meal summaries: idMeal, strMeal, strMealThumb
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(area.trim())}`);
    if (!res.ok) throw new Error(`TheMealDB area filter error: ${res.status}`);
    const data: MealDbResponse = await res.json();
    if (!data.meals || data.meals.length === 0) return [];
    
    // Fetch details for first 6 to provide rich preview
    const detailPromises = data.meals.slice(0, 8).map(m => getMealById(m.idMeal));
    const detailed = await Promise.all(detailPromises);
    return detailed.filter((r): r is Recipe => r !== null);
  } catch (error) {
    console.error(`Failed to filter recipes by area ${area} from TheMealDB:`, error);
    return [];
  }
}

export async function getMealById(id: string): Promise<Recipe | null> {
  const cleanId = id.replace('mealdb-', '');
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${cleanId}`);
    if (!res.ok) throw new Error(`TheMealDB API lookup error: ${res.status}`);
    const data: MealDbResponse = await res.json();
    if (!data.meals || data.meals.length === 0) return null;
    return transformMealDbRecipe(data.meals[0]);
  } catch (error) {
    console.error('Failed to lookup recipe by id from TheMealDB:', error);
    return null;
  }
}

export async function getRandomMeal(): Promise<Recipe> {
  try {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    if (!res.ok) throw new Error(`TheMealDB API random error: ${res.status}`);
    const data: MealDbResponse = await res.json();
    if (!data.meals || data.meals.length === 0) {
      throw new Error('No random meal returned');
    }
    return transformMealDbRecipe(data.meals[0]);
  } catch (error) {
    console.error('Failed to get random recipe from TheMealDB:', error);
    throw error;
  }
}
