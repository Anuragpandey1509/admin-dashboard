"use client";

import { useState, useEffect } from "react";
import { Product, addProduct, updateProduct, getCategories } from "@/lib/api/products";
import { X, Loader2 } from "lucide-react";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null; // if null, it's Add, else Edit
  onSuccess: (product: Product) => void;
}

export function ProductFormModal({ isOpen, onClose, product, onSuccess }: ProductFormModalProps) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{slug: string, name: string}[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (product) {
      setTitle(product.title || "");
      setPrice(product.price?.toString() || "");
      setCategory(product.category || "");
      setDescription(product.description || "");
    } else {
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!title || !price || !category) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    const payload = {
      title,
      price: parseFloat(price),
      category,
      description,
    };

    try {
      let savedProduct;
      if (product) {
        savedProduct = await updateProduct(product.id.toString(), payload);
        // Note: DummyJSON returns the updated object.
      } else {
        savedProduct = await addProduct(payload);
        // DummyJSON returns the added object with a mock ID.
      }
      onSuccess(savedProduct);
      onClose();
    } catch (err) {
      setError("Failed to save product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              required
              step="0.01"
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              required
              disabled={isLoading || categories.length === 0}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
