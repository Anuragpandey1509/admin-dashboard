"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, Product } from "@/lib/api/products";
import { Loader2, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id as string);
        setProduct(data);
      } catch (err: any) {
        setError(err.response?.status === 404 ? "Product not found" : "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error || "Product not found"}
        </h2>
        <Link href="/products" className="text-blue-600 hover:underline">
          &larr; Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/products" className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img src={product.images[0] || product.thumbnail} alt={product.title} className="w-full h-96 object-cover bg-gray-100" />
          </div>
          <div className="p-8 md:w-1/2 space-y-6">
            <div>
              <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                {product.category}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                <span className="flex items-center text-yellow-500 font-medium">
                  <Star className="w-5 h-5 fill-current mr-1" />
                  {product.rating}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100 dark:border-gray-700">
              <div>
                <span className="block text-sm text-gray-500 dark:text-gray-400">Brand</span>
                <span className="font-medium text-gray-900 dark:text-white">{product.brand || "N/A"}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500 dark:text-gray-400">Stock</span>
                <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} units` : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Reviews Section */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reviews</h3>
                <div className="space-y-4">
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white block">{review.reviewerName}</span>
                          <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <span className="flex items-center text-yellow-500 text-sm font-medium">
                          <Star className="w-4 h-4 fill-current mr-1" />
                          {review.rating}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
