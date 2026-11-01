# Recipe Box 🍳🌍

A modern, responsive global recipe discovery platform and kitchen companion featuring 110+ authentic recipes from 25 culinary traditions around the world, integrated with TheMealDB API, interactive cooking tools, and local recipe management.

![Recipe Box Preview](https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80)

## ✨ Features

- **Take Your Taste Buds Around the World 🌍**: Interactive **Explore Cuisines** hub covering 25 world culinary traditions (Indian, Italian, Chinese, Japanese, Korean, Thai, Mexican, American, French, Spanish, Greek, Mediterranean, Turkish, Lebanese, Middle Eastern, Vietnamese, Indonesian, Malaysian, Filipino, British, German, African, Caribbean, Brazilian, Australian).
- **110+ Grounded Recipes**: Authentic regional recipes with accurate preparation times, difficulty levels, dietary indicators, serving counts, and comprehensive step-by-step instructions.
- **TheMealDB API Integration**: Live worldwide search and filter by country/area with direct saving to your local kitchen collection.
- **Interactive Kitchen Tools**:
  - **Dynamic Servings Scaler**: Scale recipes up or down; ingredient amounts recalculate automatically.
  - **Interactive Prep Checklist**: Check off ingredients as you prepare them in the kitchen.
  - **Step-by-Step Cooking Mode**: Mark steps completed as you cook.
  - **Print / Cook Mode**: Clean print-ready formatting for the kitchen counter.
- **Personal Recipe Box & LocalStorage Persistence**:
  - Save dishes from TheMealDB or the curated collection.
  - Create, edit, and organize custom family recipes.
  - Heart favorite recipes with a dedicated Favorites view.
  - Persistent state in browser LocalStorage.
- **Multi-Attribute Filters & Search**: Search across dish names, countries of origin, cuisines, ingredients, and tags. Filter by meal category, dietary preference, skill level, and prep time.

## 🛠️ Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Lucide Icons**
- **TheMealDB REST API**
- **LocalStorage API**

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Impana-N/RecipeBox.git
cd RecipeBox

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

```bash
npm run build
npm run preview
```

## 📄 License

This project is licensed under the Apache-2.0 License.
