"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getProducts, searchProducts, getProductsByCategory, deleteProduct, Product } from "@/lib/api/products";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

import { SearchBar } from "@/components/SearchBar";
import { Filters } from "@/components/Filters";
import { Pagination } from "@/components/Pagination";
import { ProductFormModal } from "@/components/ProductFormModal";
import { ConfirmModal } from "@/components/ConfirmModal";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const searchParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const sortByParam = searchParams.get("sortBy") || "";
  const orderParam = (searchParams.get("order") as "asc" | "desc") || "asc";

  let page = parseInt(pageParam || "1", 10);
  if (isNaN(page) || page < 1) page = 1;
  let limit = parseInt(limitParam || "10", 10);
  if (isNaN(limit) || limit < 1) limit = 10;
  const skip = (page - 1) * limit;

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const fetchProducts = async (controller?: AbortController) => {
    setIsLoading(true);
    setError("");
    try {
      let data;
      if (searchParam && !categoryParam) {
        data = await searchProducts(searchParam, skip, limit, sortByParam, orderParam, controller?.signal);
      } else if (categoryParam && !searchParam) {
        data = await getProductsByCategory(categoryParam, skip, limit, sortByParam, orderParam, controller?.signal);
      } else {
        data = await getProducts(skip, limit, sortByParam, orderParam, controller?.signal);
      }
      setProducts(data.products);
      setTotal(data.total);
    } catch (err: any) {
      if (err.name !== 'CanceledError') {
        setError("Failed to load products.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller);
    return () => controller.abort();
  }, [page, limit, searchParam, categoryParam, sortByParam, orderParam]);

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent Link navigation
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    setDeletingProduct(product);
    setIsConfirmOpen(true);
  };

  const handleFormSuccess = (savedProduct: Product) => {
    // Optimistic UI Update since DummyJSON doesn't save
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === savedProduct.id ? { ...p, ...savedProduct } : p)));
    } else {
      setProducts([savedProduct, ...products]);
      setTotal(total + 1);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct.id.toString());
      setProducts(products.filter((p) => p.id !== deletingProduct.id));
      setTotal(total - 1);
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <SearchBar />
        <Filters />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
          <button onClick={() => fetchProducts()} className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">Retry</button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products found.
        </div>
      ) : (
        <>
          {/* Mobile Cards View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group relative block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow h-full">
                <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={(e) => handleEditClick(e, product)}
                    className="p-1.5 bg-white/90 dark:bg-gray-700/90 text-blue-600 hover:text-blue-700 rounded-md shadow-sm backdrop-blur-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, product)}
                    className="p-1.5 bg-white/90 dark:bg-gray-700/90 text-red-600 hover:text-red-700 rounded-md shadow-sm backdrop-blur-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <img src={product.thumbnail || "https://dummyjson.com/image/400x200?text=No+Image"} alt={product.title} className="w-full h-48 object-cover bg-gray-100" />
                <div className="p-4">
                  <div className="text-sm text-blue-600 mb-1">{product.category}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{product.title}</h3>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold text-lg">${product.price}</span>
                    <div className="text-sm text-gray-500">⭐ {product.rating || 0} | 📦 {product.stock || 0}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">Product</th>
                  <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">Category</th>
                  <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">Price</th>
                  <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">Rating</th>
                  <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">Stock</th>
                  <th className="p-4 font-semibold text-gray-900 dark:text-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4">
                      <Link href={`/products/${product.id}`} className="flex items-center gap-3">
                        <img src={product.thumbnail || "https://dummyjson.com/image/40x40?text=No+Image"} alt={product.title} className="w-10 h-10 rounded object-cover bg-gray-100" />
                        <span className="font-medium text-blue-600 hover:underline">{product.title}</span>
                      </Link>
                    </td>
                    <td className="p-4 text-gray-700 dark:text-gray-300 capitalize">{product.category}</td>
                    <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">${product.price}</td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">⭐ {product.rating || 0}</td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">{product.stock || 0}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => handleEditClick(e, product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, product)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!isLoading && !error && products.length > 0 && (
        <Pagination total={total} />
      )}

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={editingProduct}
        onSuccess={handleFormSuccess}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
