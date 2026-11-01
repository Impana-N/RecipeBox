import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image, Sparkles } from 'lucide-react';
import { Recipe, MealCategory, DifficultyLevel, Ingredient } from '../types/recipe';

interface AddEditRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
  recipeToEdit?: Recipe | null;
}

const PRESET_IMAGES = [
  { label: 'Berry Pancakes', url: '/src/assets/images/recipe_berry_pancakes_1793509491904.jpg' },
  { label: 'Avocado Toast', url: '/src/assets/images/recipe_avocado_toast_1793509493628.jpg' },
  { label: 'Crispy Salmon', url: '/src/assets/images/recipe_hero_salmon_1793509491274.jpg' },
  { label: 'Creamy Truffle Pasta', url: '/src/assets/images/recipe_creamy_pasta_1793509491899.jpg' },
  { label: 'Mediterranean Bowl', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80' },
  { label: 'French Onion Soup', url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Thai Red Curry', url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Whipped Crostini', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1000&q=80' },
];

export function AddEditRecipeModal({
  isOpen,
  onClose,
  onSave,
  recipeToEdit,
}: AddEditRecipeModalProps) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('Italy');
  const [cuisine, setCuisine] = useState('Italian');
  const [category, setCategory] = useState<MealCategory>('Supper');
  const [mealType, setMealType] = useState('Main Course');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [prepTime, setPrepTime] = useState<number>(15);
  const [cookTime, setCookTime] = useState<number>(20);
  const [servings, setServings] = useState<number>(4);
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '' },
    { name: '', amount: '' },
    { name: '', amount: '' },
  ]);

  const [instructions, setInstructions] = useState<string[]>(['', '']);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setCountry(recipeToEdit.country || 'Italy');
      setCuisine(recipeToEdit.cuisine || 'Italian');
      setCategory((recipeToEdit.category as MealCategory) || 'Supper');
      setMealType(recipeToEdit.mealType || 'Main Course');
      setDifficulty(recipeToEdit.difficulty);
      setPrepTime(recipeToEdit.prepTime);
      setCookTime(recipeToEdit.cookTime);
      setServings(recipeToEdit.servings);
      setImage(recipeToEdit.image);
      setIngredients(recipeToEdit.ingredients.length > 0 ? recipeToEdit.ingredients : [{ name: '', amount: '' }]);
      setInstructions(recipeToEdit.instructions.length > 0 ? recipeToEdit.instructions : ['']);
      setTagsInput(recipeToEdit.tags ? recipeToEdit.tags.join(', ') : '');
      const isPreset = PRESET_IMAGES.some(p => p.url === recipeToEdit.image);
      if (!isPreset) {
        setUseCustomUrl(true);
        setCustomImageUrl(recipeToEdit.image);
      }
    } else {
      // Defaults for new recipe
      setTitle('');
      setCategory('Supper');
      setMealType('Main Course');
      setDifficulty('Beginner');
      setPrepTime(15);
      setCookTime(20);
      setServings(4);
      setImage(PRESET_IMAGES[0].url);
      setCustomImageUrl('');
      setUseCustomUrl(false);
      setIngredients([
        { name: '', amount: '' },
        { name: '', amount: '' },
        { name: '', amount: '' },
      ]);
      setInstructions(['', '']);
      setTagsInput('');
    }
  }, [recipeToEdit, isOpen]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleRemoveInstruction = (index: number) => {
    if (instructions.length <= 1) return;
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleInstructionChange = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a recipe title.');
      return;
    }

    const validIngredients = ingredients.filter(i => i.name.trim().length > 0);
    if (validIngredients.length === 0) {
      setFormError('Please add at least one ingredient with a name.');
      return;
    }

    const validInstructions = instructions.filter(s => s.trim().length > 0);
    if (validInstructions.length === 0) {
      setFormError('Please add at least one instruction step.');
      return;
    }

    const selectedImage = useCustomUrl && customImageUrl.trim() ? customImageUrl.trim() : image;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const recipe: Recipe = {
      id: recipeToEdit ? recipeToEdit.id : `custom-${Date.now()}`,
      title: title.trim(),
      country: country.trim() || 'International',
      cuisine: cuisine.trim() || 'Global',
      category,
      mealType: mealType.trim() || category,
      difficulty,
      prepTime: Number(prepTime) || 10,
      cookTime: Number(cookTime) || 15,
      servings: Number(servings) || 4,
      image: selectedImage || PRESET_IMAGES[0].url,
      ingredients: validIngredients,
      instructions: validInstructions,
      source: 'custom',
      isCustom: true,
      tags: tags.length > 0 ? tags : [category],
      dateAdded: recipeToEdit?.dateAdded || new Date().toISOString(),
    };

    onSave(recipe);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl border border-[#E8DFC8] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFC8] bg-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E06A26]" />
            <h2 className="font-display text-xl font-semibold text-[#193828]">
              {recipeToEdit ? 'Edit Recipe' : 'Create New Recipe'}
            </h2>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {formError}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
              Recipe Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grandma's Rosemary Focaccia"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#214834]/20 focus:border-[#214834]"
            />
          </div>

          {/* Country of Origin and Cuisine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
                Country of Origin *
              </label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Italy, India, Mexico, Japan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#214834]/20 focus:border-[#214834]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
                Cuisine *
              </label>
              <input
                type="text"
                required
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="e.g. Italian, Indian, Mexican, Japanese"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#214834]/20 focus:border-[#214834]"
              />
            </div>
          </div>

          {/* Category, Difficulty, Meal Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MealCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#214834]/20 focus:border-[#214834]"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Supper">Supper</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#214834]/20 focus:border-[#214834]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
                Meal Type
              </label>
              <input
                type="text"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                placeholder="e.g. Pasta, Salad, Dessert"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#214834]/20 focus:border-[#214834]"
              />
            </div>
          </div>

          {/* Times and Servings */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
                Prep (Mins)
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#214834]/20 focus:border-[#214834]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
                Cook (Mins)
              </label>
              <input
                type="number"
                min="0"
                max="600"
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#214834]/20 focus:border-[#214834]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
                Servings
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#214834]/20 focus:border-[#214834]"
              />
            </div>
          </div>

          {/* Food Photography Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
                Recipe Image
              </label>
              <button
                type="button"
                onClick={() => setUseCustomUrl(!useCustomUrl)}
                className="text-xs text-[#E06A26] hover:underline font-medium"
              >
                {useCustomUrl ? 'Pick from Presets' : 'Use Custom URL'}
              </button>
            </div>

            {useCustomUrl ? (
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="https://example.com/recipe-photo.jpg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#214834]/20"
              />
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className={`relative rounded-xl overflow-hidden aspect-4/3 border-2 transition-all group ${
                      image === preset.url ? 'border-[#214834] ring-2 ring-[#214834]/20' : 'border-transparent hover:border-stone-300'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-semibold text-white px-1 text-center leading-tight">
                        {preset.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Ingredients */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
                Ingredients *
              </label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#214834] hover:text-[#193828]"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Ingredient
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                    placeholder="e.g. Sourdough Flour"
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E8DFC8] bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#214834]/20"
                  />
                  <input
                    type="text"
                    value={ing.amount}
                    onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                    placeholder="e.g. 2 cups / 300g"
                    className="w-28 sm:w-36 px-3 py-2 rounded-xl border border-[#E8DFC8] bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#214834]/20"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    disabled={ingredients.length <= 1}
                    aria-label="Remove ingredient"
                    className="p-2 text-stone-400 hover:text-red-600 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Instructions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
                Step-by-Step Instructions *
              </label>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#214834] hover:text-[#193828]"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Step
              </button>
            </div>

            <div className="space-y-2.5">
              {instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#F1E9DB] text-[#193828] text-xs font-bold flex items-center justify-center shrink-0 mt-2">
                    {idx + 1}
                  </span>
                  <textarea
                    rows={2}
                    value={step}
                    onChange={(e) => handleInstructionChange(idx, e.target.value)}
                    placeholder={`Describe step ${idx + 1}...`}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E8DFC8] bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#214834]/20 resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(idx)}
                    disabled={instructions.length <= 1}
                    aria-label="Remove step"
                    className="p-2 text-stone-400 hover:text-red-600 disabled:opacity-30 transition-colors mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#193828] uppercase tracking-wider">
              Tags (Comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Vegetarian, High-Protein, Quick"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#214834]/20"
            />
          </div>

          {/* Modal Buttons */}
          <div className="pt-4 border-t border-[#E8DFC8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#525E56] hover:bg-stone-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#214834] hover:bg-[#193828] rounded-xl shadow-xs transition-colors"
            >
              {recipeToEdit ? 'Save Changes' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
