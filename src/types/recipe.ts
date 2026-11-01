export type MealCategory = 'Breakfast' | 'Lunch' | 'Supper' | 'Snacks';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type DietaryOption = 'All' | 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'High-Protein' | 'Dairy-Free';

export type PrepTimeFilter = 'All' | 'Quick (< 20m)' | 'Medium (20-40m)' | 'Slow (40m+)';

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: MealCategory | string;
  mealType: string;
  country: string;
  cuisine: string;
  region?: string;
  difficulty: DifficultyLevel;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
  source: 'sample' | 'themealdb' | 'custom' | 'global-collection';
  dietary?: string[];
  tags?: string[];
  youtubeUrl?: string;
  dateAdded?: string;
  isCustom?: boolean;
}

export interface CuisineInfo {
  id: string;
  name: string;
  country: string;
  region: string;
  flag: string;
  image: string;
  description: string;
  famousDishes: string[];
  themealdbArea?: string;
}

export type SortOption = 'time-asc' | 'time-desc' | 'name-asc' | 'name-desc';
