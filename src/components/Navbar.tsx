import { useState } from 'react';
import { Sparkles, Plus, Bookmark, Heart, UtensilsCrossed, Menu, X, Compass, Globe } from 'lucide-react';

export type NavTab = 'home' | 'cuisines' | 'explore' | 'my-recipes' | 'favorites';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenNewRecipe: () => void;
  onSurpriseMe: () => void;
  savedCount: number;
  favoritesCount: number;
}

export function Navbar({
  activeTab,
  onSelectTab,
  onOpenNewRecipe,
  onSurpriseMe,
  savedCount,
  favoritesCount,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFC8]/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 lg:gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#214834] rounded-lg shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-[#214834] text-[#FAF7F2] flex items-center justify-center shadow-xs group-hover:bg-[#193828] transition-colors">
              <UtensilsCrossed className="w-5 h-5 text-[#E7DCcb]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-2xl tracking-tight text-[#193828]">
                Recipe Box
              </span>
            </div>
          </button>

          {/* Zone 2: Clean Nav Links with hover lines */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'home'
                  ? 'text-[#193828] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#193828]'
                  : 'text-[#5A635D] hover:text-[#193828]'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('cuisines')}
              className={`relative py-1 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'cuisines'
                  ? 'text-[#193828] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#193828]'
                  : 'text-[#5A635D] hover:text-[#193828]'
              }`}
            >
              <Globe className="w-4 h-4 opacity-75 text-[#E06A26]" />
              <span>Explore Cuisines</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('explore')}
              className={`relative py-1 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'explore'
                  ? 'text-[#193828] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#193828]'
                  : 'text-[#5A635D] hover:text-[#193828]'
              }`}
            >
              <Compass className="w-4 h-4 opacity-75" />
              <span>TheMealDB API</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('my-recipes')}
              className={`relative py-1 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'my-recipes'
                  ? 'text-[#193828] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#193828]'
                  : 'text-[#5A635D] hover:text-[#193828]'
              }`}
            >
              <Bookmark className="w-4 h-4 opacity-75" />
              <span>My Recipes</span>
              {savedCount > 0 && (
                <span className="text-xs bg-[#214834]/10 text-[#214834] font-semibold px-1.5 py-0.5 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('favorites')}
              className={`relative py-1 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'favorites'
                  ? 'text-[#193828] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#193828]'
                  : 'text-[#5A635D] hover:text-[#193828]'
              }`}
            >
              <Heart className="w-4 h-4 opacity-75" />
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <span className="text-xs bg-[#E06A26]/10 text-[#E06A26] font-semibold px-1.5 py-0.5 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Primary Action & Quick Tools */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onSurpriseMe}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#193828] bg-[#F1E9DB] hover:bg-[#E8DFC8] rounded-xl transition-all shadow-2xs whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E06A26]" />
              <span>Surprise Me</span>
            </button>

            <button
              type="button"
              onClick={onOpenNewRecipe}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#214834] hover:bg-[#193828] rounded-xl transition-all shadow-xs hover:shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-[#FAF7F2]" />
              <span>New Recipe</span>
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={onSurpriseMe}
              aria-label="Surprise recipe"
              className="p-2 text-[#E06A26] bg-[#F1E9DB] rounded-lg"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-[#193828] hover:bg-[#EFE9DF] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8DFC8] bg-[#FAF7F2] px-4 pt-2 pb-5 space-y-3">
          <div className="flex flex-col space-y-1">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'home' ? 'bg-[#214834]/10 text-[#193828] font-semibold' : 'text-[#4A534D]'
              }`}
            >
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('cuisines')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'cuisines' ? 'bg-[#214834]/10 text-[#193828] font-semibold' : 'text-[#4A534D]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#E06A26]" />
                Explore Cuisines (25 Countries)
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('explore')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'explore' ? 'bg-[#214834]/10 text-[#193828] font-semibold' : 'text-[#4A534D]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#214834]" />
                TheMealDB API
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('my-recipes')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'my-recipes' ? 'bg-[#214834]/10 text-[#193828] font-semibold' : 'text-[#4A534D]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#214834]" />
                My Recipes
              </span>
              {savedCount > 0 && (
                <span className="text-xs bg-[#214834] text-[#FAF7F2] font-semibold px-2 py-0.5 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('favorites')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'favorites' ? 'bg-[#214834]/10 text-[#193828] font-semibold' : 'text-[#4A534D]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#E06A26]" />
                Favorites
              </span>
              {favoritesCount > 0 && (
                <span className="text-xs bg-[#E06A26] text-white font-semibold px-2 py-0.5 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-[#E8DFC8] flex gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenNewRecipe();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-[#FAF7F2] bg-[#214834] hover:bg-[#193828]"
            >
              + Create Recipe
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
