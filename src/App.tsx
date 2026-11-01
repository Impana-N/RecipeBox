/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Plus,
  Sparkles,
  Bookmark,
  Heart,
  ChefHat,
  Filter,
  ArrowRight,
  AlertCircle,
  RotateCcw,
  Compass,
  UtensilsCrossed,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';

import {
  Recipe,
  MealCategory,
  DifficultyLevel,
  SortOption,
  DietaryOption,
  PrepTimeFilter,
} from './types/recipe';
import { GLOBAL_RECIPES } from './data/globalRecipes';
import { CUISINES_DATA } from './data/cuisines';
import { searchMealsByName, filterMealsByArea, getRandomMeal } from './services/mealDbApi';
import {
  getSavedRecipes,
  saveRecipe,
  updateCustomRecipe,
  deleteSavedRecipe,
  getFavoriteIds,
  toggleFavorite,
} from './services/storage';

import { Navbar, NavTab } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { CuisineExplorer } from './components/CuisineExplorer';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { AddEditRecipeModal } from './components/AddEditRecipeModal';
import { SurpriseModal } from './components/SurpriseModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedDietary, setSelectedDietary] = useState<DietaryOption>('All');
  const [selectedPrepTime, setSelectedPrepTime] = useState<PrepTimeFilter>('All');
  const [selectedSort, setSelectedSort] = useState<SortOption>('time-asc');

  // Persistent States
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // TheMealDB API State (Explore Tab)
  const [apiSearchResults, setApiSearchResults] = useState<Recipe[]>([]);
  const [apiSearchQuery, setApiSearchQuery] = useState('Chicken');
  const [apiSelectedArea, setApiSelectedArea] = useState('All');
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Modals State
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isNewRecipeModalOpen, setIsNewRecipeModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial load from LocalStorage
  useEffect(() => {
    setSavedRecipes(getSavedRecipes());
    setFavoriteIds(getFavoriteIds());
  }, []);

  // Initial fetch for explore tab
  useEffect(() => {
    handleSearchTheMealDb('Chicken');
  }, []);

  const handleSearchTheMealDb = async (term: string) => {
    if (!term.trim()) return;
    setIsApiLoading(true);
    setApiError('');
    try {
      const results = await searchMealsByName(term);
      setApiSearchResults(results);
    } catch (err) {
      console.error(err);
      setApiError('Unable to connect to TheMealDB. Please check your connection or try another search term.');
      setApiSearchResults([]);
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleFilterTheMealDbArea = async (area: string) => {
    setIsApiLoading(true);
    setApiError('');
    setApiSelectedArea(area);
    try {
      const results = await filterMealsByArea(area);
      setApiSearchResults(results);
    } catch (err) {
      console.error(err);
      setApiError(`Could not load dishes for area ${area}.`);
    } finally {
      setIsApiLoading(false);
    }
  };

  // Favorites logic
  const handleToggleFavorite = (recipe: Recipe, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowFav = toggleFavorite(recipe.id);
    const updated = getFavoriteIds();
    setFavoriteIds(updated);

    if (isNowFav && !savedRecipes.some((r) => r.id === recipe.id)) {
      saveRecipe(recipe);
      setSavedRecipes(getSavedRecipes());
    }

    addToast(
      isNowFav ? `Added "${recipe.title}" to Favorites` : `Removed "${recipe.title}" from Favorites`,
      isNowFav ? 'success' : 'info'
    );
  };

  // Save to My Recipes logic
  const handleToggleSave = (recipe: Recipe, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const alreadySaved = savedRecipes.some(
      (r) => r.id === recipe.id || r.title.toLowerCase().trim() === recipe.title.toLowerCase().trim()
    );

    if (alreadySaved) {
      deleteSavedRecipe(recipe.id);
      setSavedRecipes(getSavedRecipes());
      addToast(`Removed "${recipe.title}" from My Recipes`, 'info');
    } else {
      const res = saveRecipe(recipe);
      if (res.isDuplicate) {
        addToast(`"${recipe.title}" is already in your Recipe Box.`, 'info');
      } else if (res.success) {
        setSavedRecipes(getSavedRecipes());
        addToast(`Saved "${recipe.title}" to My Recipes!`, 'success');
      } else {
        addToast(`Could not save recipe.`, 'error');
      }
    }
  };

  // Custom Recipe Creation / Editing
  const handleSaveCustomRecipe = (recipe: Recipe) => {
    if (recipeToEdit) {
      updateCustomRecipe(recipe);
      setSavedRecipes(getSavedRecipes());
      addToast(`Recipe "${recipe.title}" updated successfully!`, 'success');
      setRecipeToEdit(null);
    } else {
      const res = saveRecipe(recipe);
      if (res.success) {
        setSavedRecipes(getSavedRecipes());
        addToast(`Recipe "${recipe.title}" created successfully!`, 'success');
        setActiveTab('my-recipes');
      } else {
        addToast(`A recipe with that name already exists.`, 'info');
      }
    }
    if (selectedRecipe && selectedRecipe.id === recipe.id) {
      setSelectedRecipe(recipe);
    }
  };

  const handleConfirmDelete = (recipe: Recipe) => {
    deleteSavedRecipe(recipe.id);
    setSavedRecipes(getSavedRecipes());
    if (selectedRecipe && selectedRecipe.id === recipe.id) {
      setSelectedRecipe(null);
    }
    addToast(`"${recipe.title}" was deleted.`, 'info');
  };

  const isRecipeInSaved = useCallback(
    (id: string, title?: string) => {
      return savedRecipes.some(
        (r) => r.id === id || (title && r.title.toLowerCase().trim() === title.toLowerCase().trim())
      );
    },
    [savedRecipes]
  );

  const isRecipeFavorite = useCallback(
    (id: string) => {
      return favoriteIds.includes(id);
    },
    [favoriteIds]
  );

  // Master list of all available recipes (110+ Global Recipes + User Saved Recipes)
  const allKnownRecipes = useMemo(() => {
    const map = new Map<string, Recipe>();
    GLOBAL_RECIPES.forEach((r) => map.set(r.id, r));
    savedRecipes.forEach((r) => map.set(r.id, r));
    return Array.from(map.values());
  }, [savedRecipes]);

  // Master Filter & Search Logic across 100+ recipes
  const filteredRecipes = useMemo(() => {
    let list: Recipe[] = [];

    if (activeTab === 'home' || activeTab === 'cuisines') {
      list = [...allKnownRecipes];
    } else if (activeTab === 'my-recipes') {
      list = [...savedRecipes];
    } else if (activeTab === 'favorites') {
      list = allKnownRecipes.filter((r) => favoriteIds.includes(r.id));
    } else if (activeTab === 'explore') {
      list = [...apiSearchResults];
    }

    // 1. Global Search: Dish Name, Country, Cuisine, and Ingredients
    if (activeTab !== 'explore' && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((r) => {
        const titleMatch = r.title.toLowerCase().includes(q);
        const countryMatch = r.country?.toLowerCase().includes(q);
        const cuisineMatch = r.cuisine?.toLowerCase().includes(q);
        const categoryMatch = r.category?.toLowerCase().includes(q);
        const mealTypeMatch = r.mealType?.toLowerCase().includes(q);
        const ingredientMatch = r.ingredients.some((ing) => ing.name.toLowerCase().includes(q));
        const tagMatch = r.tags?.some((t) => t.toLowerCase().includes(q));
        return titleMatch || countryMatch || cuisineMatch || categoryMatch || mealTypeMatch || ingredientMatch || tagMatch;
      });
    }

    // 2. Filter by Cuisine / Country
    if (selectedCuisine !== 'All') {
      const targetCuisine = selectedCuisine.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.cuisine?.toLowerCase().trim() === targetCuisine ||
          r.country?.toLowerCase().trim() === targetCuisine
      );
    }

    // 3. Filter by Meal Category (Breakfast, Lunch, Supper, Snacks)
    if (selectedCategory !== 'All') {
      list = list.filter((r) => r.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 4. Filter by Difficulty
    if (selectedDifficulty !== 'All') {
      list = list.filter((r) => r.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());
    }

    // 5. Filter by Dietary Preference
    if (selectedDietary !== 'All') {
      list = list.filter((r) => r.dietary?.includes(selectedDietary));
    }

    // 6. Filter by Prep Time
    if (selectedPrepTime !== 'All') {
      list = list.filter((r) => {
        const total = r.prepTime + r.cookTime;
        if (selectedPrepTime === 'Quick (< 20m)') return total <= 20;
        if (selectedPrepTime === 'Medium (20-40m)') return total > 20 && total <= 40;
        if (selectedPrepTime === 'Slow (40m+)') return total > 40;
        return true;
      });
    }

    // 7. Sorting
    list.sort((a, b) => {
      if (selectedSort === 'time-asc') return (a.cookTime + a.prepTime) - (b.cookTime + b.prepTime);
      if (selectedSort === 'time-desc') return (b.cookTime + b.prepTime) - (a.cookTime + a.prepTime);
      if (selectedSort === 'name-asc') return a.title.localeCompare(b.title);
      if (selectedSort === 'name-desc') return b.title.localeCompare(a.title);
      return 0;
    });

    return list;
  }, [
    activeTab,
    allKnownRecipes,
    savedRecipes,
    favoriteIds,
    apiSearchResults,
    searchQuery,
    selectedCuisine,
    selectedCategory,
    selectedDifficulty,
    selectedDietary,
    selectedPrepTime,
    selectedSort,
  ]);

  const isFiltered =
    selectedCategory !== 'All' ||
    selectedCuisine !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedDietary !== 'All' ||
    selectedPrepTime !== 'All' ||
    searchQuery.trim().length > 0;

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedCuisine('All');
    setSelectedDifficulty('All');
    setSelectedDietary('All');
    setSelectedPrepTime('All');
    setSearchQuery('');
  };

  const handleCuisineSelectFromExplorer = (cuisineName: string) => {
    setSelectedCuisine(cuisineName);
    setActiveTab('home');
    setTimeout(() => {
      document.getElementById('recipes-grid')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#242A26] flex flex-col selection:bg-[#E06A26]/20 selection:text-[#193828]">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNewRecipe={() => {
          setRecipeToEdit(null);
          setIsNewRecipeModalOpen(true);
        }}
        onSurpriseMe={() => setIsSurpriseModalOpen(true)}
        savedCount={savedRecipes.length}
        favoritesCount={favoriteIds.length}
      />

      <main className="flex-1">
        
        {/* Tab 1: Home View */}
        {activeTab === 'home' && (
          <>
            <Hero
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={(q) => {
                setSearchQuery(q);
                document.getElementById('recipes-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                document.getElementById('recipes-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              activeCategory={selectedCategory}
              featuredRecipe={GLOBAL_RECIPES[0]}
              onOpenRecipe={(recipe) => setSelectedRecipe(recipe)}
              onSurpriseMe={() => setIsSurpriseModalOpen(true)}
            />

            {/* Quick World Cuisine Exploration Strip */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6">
              <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E06A26]">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Global Culinary Journey</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#193828]">
                    Take Your Taste Buds Around the World 🌍
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E6862] max-w-xl">
                    Discover recipes from India, Italy, Japan, Mexico, France, Thailand, Lebanon, Brazil, and 17 other vibrant culinary cultures.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('cuisines');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#FAF7F2] bg-[#214834] hover:bg-[#193828] transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span>Browse All 25 Cuisines</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* Main Recipe Collection Section */}
            <section id="recipes-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#E06A26]">
                    {selectedCuisine !== 'All' ? `${selectedCuisine} Collection` : 'Global Collection (100+ Dishes)'}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#193828]">
                    {searchQuery
                      ? `Results for "${searchQuery}"`
                      : selectedCuisine !== 'All'
                      ? `${selectedCuisine} Authentic Recipes`
                      : 'Explore World Recipes'}
                  </h2>
                </div>
              </div>

              {/* Comprehensive Category & Cuisine Filters */}
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedCuisine={selectedCuisine}
                onSelectCuisine={setSelectedCuisine}
                selectedDifficulty={selectedDifficulty}
                onSelectDifficulty={setSelectedDifficulty}
                selectedDietary={selectedDietary}
                onSelectDietary={setSelectedDietary}
                selectedPrepTime={selectedPrepTime}
                onSelectPrepTime={setSelectedPrepTime}
                selectedSort={selectedSort}
                onSelectSort={setSelectedSort}
                totalCount={filteredRecipes.length}
                onResetFilters={resetFilters}
                isFiltered={isFiltered}
              />

              {/* Responsive Recipe Grid (1 col mobile, 2 cols tablet, 3-4 cols desktop) */}
              <div className="pt-8">
                {filteredRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        isFavorite={isRecipeFavorite(recipe.id)}
                        isSaved={isRecipeInSaved(recipe.id, recipe.title)}
                        onToggleFavorite={handleToggleFavorite}
                        onToggleSave={handleToggleSave}
                        onClick={() => setSelectedRecipe(recipe)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white rounded-3xl border border-[#E8DFC8] p-8 max-w-lg mx-auto space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F3ECE1] text-[#214834] flex items-center justify-center mx-auto">
                      <ChefHat className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[#193828]">
                      No recipes matched your search
                    </h3>
                    <p className="text-sm text-[#5E6862] leading-relaxed">
                      We couldn't find matching dishes with your current filters. Try resetting your filters or search for another dish or cuisine.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="px-4 py-2 text-xs font-semibold text-[#193828] bg-[#F1E9DB] hover:bg-[#E8DFC8] rounded-xl transition-colors"
                      >
                        Reset All Filters
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setApiSearchQuery(searchQuery || 'Chicken');
                          handleSearchTheMealDb(searchQuery || 'Chicken');
                          setActiveTab('explore');
                        }}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#214834] hover:bg-[#193828] rounded-xl transition-colors"
                      >
                        Search TheMealDB
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* Tab 2: Dedicated Cuisines Explorer */}
        {activeTab === 'cuisines' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <CuisineExplorer
              onSelectCuisine={handleCuisineSelectFromExplorer}
              selectedCuisine={selectedCuisine}
            />
          </section>
        )}

        {/* Tab 3: Explore TheMealDB API Live Integration */}
        {activeTab === 'explore' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-semibold tracking-wider text-[#E06A26] uppercase">
                International Recipe API
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#193828]">
                Explore TheMealDB Worldwide Database
              </h1>
              <p className="text-sm sm:text-base text-[#525E56] max-w-2xl">
                Retrieve authentic culinary preparations directly from TheMealDB API. Filter by cultural area or search by dish to view recipes, and save them permanently to your Recipe Box.
              </p>
            </div>

            {/* TheMealDB Area Filter Bar */}
            <div className="bg-white rounded-3xl p-5 border border-[#E8DFC8] shadow-sm space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchTheMealDb(apiSearchQuery);
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1 flex items-center rounded-2xl border border-[#E8DFC8] bg-[#FAF7F2] px-3.5 py-2.5 focus-within:border-[#214834] focus-within:ring-2 focus-within:ring-[#214834]/15">
                  <Search className="w-5 h-5 text-[#86928A] mr-2 shrink-0" />
                  <input
                    type="text"
                    value={apiSearchQuery}
                    onChange={(e) => setApiSearchQuery(e.target.value)}
                    placeholder="Search international dishes (e.g. Biryani, Tacos, Ramen, Carbonara, Curry)..."
                    className="w-full bg-transparent text-sm sm:text-base focus:outline-none text-[#193828]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isApiLoading}
                  className="px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#214834] hover:bg-[#193828] disabled:opacity-50 rounded-2xl transition-colors shrink-0 shadow-xs"
                >
                  {isApiLoading ? 'Searching...' : 'Search'}
                </button>
              </form>

              {/* Filter by TheMealDB Area buttons */}
              <div className="space-y-2 pt-1 text-xs">
                <span className="text-[#6B7770] font-semibold block">Filter TheMealDB by Country / Area:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Indian',
                    'Italian',
                    'Chinese',
                    'Japanese',
                    'Mexican',
                    'Thai',
                    'French',
                    'Spanish',
                    'Greek',
                    'Turkish',
                    'British',
                    'American',
                    'Vietnamese',
                    'Malaysian',
                    'Filipino',
                    'Moroccan',
                    'Jamaican',
                  ].map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => handleFilterTheMealDbArea(area)}
                      className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors ${
                        apiSelectedArea === area
                          ? 'bg-[#214834] text-white border-[#214834]'
                          : 'bg-[#FAF7F2] text-[#424C46] border-[#E8DFC8] hover:bg-[#F3ECE1]'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {apiError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <p>{apiError}</p>
              </div>
            )}

            {/* Results Grid or Skeleton Loading */}
            {isApiLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#E8DFC8] p-4 space-y-3 animate-pulse">
                    <div className="aspect-4/3 w-full bg-[#EFE9DF] rounded-xl" />
                    <div className="h-4 bg-[#EFE9DF] rounded-md w-1/3" />
                    <div className="h-5 bg-[#EFE9DF] rounded-md w-3/4" />
                    <div className="h-4 bg-[#EFE9DF] rounded-md w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredRecipes.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#6B7770]">
                  <span>Found <strong className="text-[#193828] tabular-nums font-semibold">{filteredRecipes.length}</strong> international recipes</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFavorite={isRecipeFavorite(recipe.id)}
                      isSaved={isRecipeInSaved(recipe.id, recipe.title)}
                      onToggleFavorite={handleToggleFavorite}
                      onToggleSave={handleToggleSave}
                      onClick={() => setSelectedRecipe(recipe)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-[#E8DFC8] p-8 max-w-lg mx-auto space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F3ECE1] text-[#214834] flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-semibold text-[#193828]">
                  No meals found on TheMealDB
                </h3>
                <p className="text-sm text-[#5E6862] leading-relaxed">
                  Try another keyword like "Curry", "Pasta", "Chicken", or click one of the international country filters above.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setApiSearchQuery('Pasta');
                    handleSearchTheMealDb('Pasta');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#214834] hover:bg-[#193828] rounded-xl transition-colors"
                >
                  Try "Pasta" Instead
                </button>
              </div>
            )}
          </section>
        )}

        {/* Tab 4: My Recipes */}
        {activeTab === 'my-recipes' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold tracking-wider text-[#E06A26] uppercase">
                  Personal Kitchen Library
                </span>
                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#193828]">
                  My Saved Recipes
                </h1>
                <p className="text-xs sm:text-sm text-[#525E56]">
                  {savedRecipes.length} recipe{savedRecipes.length === 1 ? '' : 's'} saved in your local kitchen box
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRecipeToEdit(null);
                  setIsNewRecipeModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#214834] hover:bg-[#193828] rounded-xl shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your Own Recipe</span>
              </button>
            </div>

            {/* Filter bar for My Recipes */}
            {savedRecipes.length > 0 && (
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedCuisine={selectedCuisine}
                onSelectCuisine={setSelectedCuisine}
                selectedDifficulty={selectedDifficulty}
                onSelectDifficulty={setSelectedDifficulty}
                selectedDietary={selectedDietary}
                onSelectDietary={setSelectedDietary}
                selectedPrepTime={selectedPrepTime}
                onSelectPrepTime={setSelectedPrepTime}
                selectedSort={selectedSort}
                onSelectSort={setSelectedSort}
                totalCount={filteredRecipes.length}
                onResetFilters={resetFilters}
                isFiltered={isFiltered}
              />
            )}

            {/* My Recipes Grid */}
            {savedRecipes.length > 0 ? (
              filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFavorite={isRecipeFavorite(recipe.id)}
                      isSaved={true}
                      onToggleFavorite={handleToggleFavorite}
                      onToggleSave={handleToggleSave}
                      onClick={() => setSelectedRecipe(recipe)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-white rounded-3xl border border-[#E8DFC8] p-8 max-w-md mx-auto space-y-3">
                  <p className="text-sm font-medium text-[#193828]">No saved recipes match the selected filters.</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 text-xs font-semibold text-[#193828] bg-[#F1E9DB] rounded-xl hover:bg-[#E8DFC8]"
                  >
                    Clear Filters
                  </button>
                </div>
              )
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-[#E8DFC8] p-8 max-w-lg mx-auto space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F3ECE1] text-[#214834] flex items-center justify-center mx-auto">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-semibold text-[#193828]">
                  Your Recipe Box is empty
                </h3>
                <p className="text-sm text-[#5E6862] leading-relaxed">
                  Start filling your collection! Browse our 100+ global recipes, search TheMealDB, or record your own heritage family recipes.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('home')}
                    className="px-4 py-2 text-xs font-semibold text-[#193828] bg-[#F1E9DB] hover:bg-[#E8DFC8] rounded-xl transition-colors"
                  >
                    Browse World Recipes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRecipeToEdit(null);
                      setIsNewRecipeModalOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#214834] hover:bg-[#193828] rounded-xl transition-colors"
                  >
                    + Add New Recipe
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Tab 5: Favorites */}
        {activeTab === 'favorites' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="space-y-1">
              <span className="text-xs font-semibold tracking-wider text-[#E06A26] uppercase">
                Cherished Dishes
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#193828]">
                Favorites
              </h1>
              <p className="text-xs sm:text-sm text-[#525E56]">
                {favoriteIds.length} recipe{favoriteIds.length === 1 ? '' : 's'} marked as your kitchen staples
              </p>
            </div>

            {favoriteIds.length > 0 && (
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedCuisine={selectedCuisine}
                onSelectCuisine={setSelectedCuisine}
                selectedDifficulty={selectedDifficulty}
                onSelectDifficulty={setSelectedDifficulty}
                selectedDietary={selectedDietary}
                onSelectDietary={setSelectedDietary}
                selectedPrepTime={selectedPrepTime}
                onSelectPrepTime={setSelectedPrepTime}
                selectedSort={selectedSort}
                onSelectSort={setSelectedSort}
                totalCount={filteredRecipes.length}
                onResetFilters={resetFilters}
                isFiltered={isFiltered}
              />
            )}

            {favoriteIds.length > 0 ? (
              filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFavorite={true}
                      isSaved={isRecipeInSaved(recipe.id, recipe.title)}
                      onToggleFavorite={handleToggleFavorite}
                      onToggleSave={handleToggleSave}
                      onClick={() => setSelectedRecipe(recipe)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-white rounded-3xl border border-[#E8DFC8] p-8 max-w-md mx-auto space-y-3">
                  <p className="text-sm font-medium text-[#193828]">No favorite recipes match your current filters.</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 text-xs font-semibold text-[#193828] bg-[#F1E9DB] rounded-xl hover:bg-[#E8DFC8]"
                  >
                    Clear Filters
                  </button>
                </div>
              )
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-[#E8DFC8] p-8 max-w-lg mx-auto space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF0E6] text-[#E06A26] flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <h3 className="font-display text-xl font-semibold text-[#193828]">
                  No favorites marked yet
                </h3>
                <p className="text-sm text-[#5E6862] leading-relaxed">
                  Whenever you find a dish you love, click the heart icon on any recipe card to keep it saved right here.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#214834] hover:bg-[#193828] rounded-xl transition-colors"
                >
                  Explore World Recipes
                </button>
              </div>
            )}
          </section>
        )}

      </main>

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Recipe Detail Modal with Servings Scaler and Ingredients Checklist */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        isFavorite={selectedRecipe ? isRecipeFavorite(selectedRecipe.id) : false}
        isSaved={selectedRecipe ? isRecipeInSaved(selectedRecipe.id, selectedRecipe.title) : false}
        onToggleFavorite={(recipe) => handleToggleFavorite(recipe)}
        onToggleSave={(recipe) => handleToggleSave(recipe)}
        onEditRecipe={(recipe) => {
          setSelectedRecipe(null);
          setRecipeToEdit(recipe);
          setIsNewRecipeModalOpen(true);
        }}
        onDeleteRecipe={(recipe) => {
          setRecipeToDelete(recipe);
        }}
      />

      {/* Add / Edit Recipe Modal */}
      <AddEditRecipeModal
        isOpen={isNewRecipeModalOpen}
        onClose={() => {
          setIsNewRecipeModalOpen(false);
          setRecipeToEdit(null);
        }}
        onSave={handleSaveCustomRecipe}
        recipeToEdit={recipeToEdit}
      />

      {/* Surprise Me Modal */}
      <SurpriseModal
        isOpen={isSurpriseModalOpen}
        onClose={() => setIsSurpriseModalOpen(false)}
        onOpenRecipe={(recipe) => {
          setIsSurpriseModalOpen(false);
          setSelectedRecipe(recipe);
        }}
        onSaveRecipe={(recipe) => {
          handleToggleSave(recipe);
        }}
        isSaved={(id, title) => isRecipeInSaved(id, title)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!recipeToDelete}
        recipe={recipeToDelete}
        onClose={() => setRecipeToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}
