import { AlertTriangle } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface DeleteConfirmModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recipe: Recipe) => void;
}

export function DeleteConfirmModal({
  recipe,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen || !recipe) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#FAF7F2] rounded-3xl border border-[#E8DFC8] p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display text-lg font-semibold text-[#193828]">
            Remove Recipe?
          </h3>
          <p className="text-xs text-[#5E6862] leading-relaxed">
            Are you sure you want to delete <strong className="text-[#193828] font-semibold">{recipe.title}</strong> from your collection? This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#5E6862] hover:bg-stone-200/60 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(recipe);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors"
          >
            Delete Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
