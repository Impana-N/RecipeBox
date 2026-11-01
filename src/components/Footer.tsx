import { UtensilsCrossed, Heart, Compass, Bookmark } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'home' | 'explore' | 'my-recipes' | 'favorites') => void;
  onSelectCategory: (category: string) => void;
}

export function Footer({ onSelectTab, onSelectCategory }: FooterProps) {
  return (
    <footer className="mt-20 border-t border-[#E8DFC8] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#214834] text-[#FAF7F2] flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-[#E7DCcb]" />
              </div>
              <span className="font-display font-semibold text-xl text-[#193828]">
                Recipe Box
              </span>
            </div>
            <p className="text-xs text-[#627068] max-w-sm leading-relaxed">
              A minimalist, aesthetic kitchen companion built for culinary discovery, meal planning, and preserving cherished personal recipes.
            </p>
            <div className="pt-2 text-xs text-[#89978F]">
              Powered by TheMealDB API · LocalStorage Persistent
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#525E56]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('home')}
                  className="hover:text-[#193828] transition-colors"
                >
                  Featured Recipes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('explore')}
                  className="hover:text-[#193828] transition-colors"
                >
                  Explore TheMealDB
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('my-recipes')}
                  className="hover:text-[#193828] transition-colors"
                >
                  My Saved Recipes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('favorites')}
                  className="hover:text-[#193828] transition-colors"
                >
                  Favorite Dishes
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-[#525E56]">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('home');
                    onSelectCategory('Breakfast');
                  }}
                  className="hover:text-[#193828] transition-colors"
                >
                  Breakfast & Brunch
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('home');
                    onSelectCategory('Lunch');
                  }}
                  className="hover:text-[#193828] transition-colors"
                >
                  Quick Lunches
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('home');
                    onSelectCategory('Supper');
                  }}
                  className="hover:text-[#193828] transition-colors"
                >
                  Comforting Suppers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('home');
                    onSelectCategory('Snacks');
                  }}
                  className="hover:text-[#193828] transition-colors"
                >
                  Appetizers & Snacks
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 mt-8 border-t border-[#F2ECE1] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7F8C84] gap-3">
          <p>© {new Date().getFullYear()} Recipe Box. Built for modern food lovers.</p>
          <p>Fresh ingredients · Clear steps · Seamless cooking</p>
        </div>
      </div>
    </footer>
  );
}
