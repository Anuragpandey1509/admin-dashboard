import api from './axios';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  reviews?: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const getProducts = async (
  skip: number = 0,
  limit: number = 10,
  sortBy: string = '',
  order: 'asc' | 'desc' = 'asc',
  signal?: AbortSignal
): Promise<ProductsResponse> => {
  let url = `/products?limit=${limit}&skip=${skip}`;
  if (sortBy) {
    url += `&sortBy=${sortBy}&order=${order}`;
  }
  const response = await api.get<ProductsResponse>(url, { signal });
  return response.data;
};

export const searchProducts = async (
  query: string,
  skip: number = 0,
  limit: number = 10,
  sortBy: string = '',
  order: 'asc' | 'desc' = 'asc',
  signal?: AbortSignal
): Promise<ProductsResponse> => {
  let url = `/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`;
  if (sortBy) {
    url += `&sortBy=${sortBy}&order=${order}`;
  }
  const response = await api.get<ProductsResponse>(url, { signal });
  return response.data;
};

export const getProductsByCategory = async (
  category: string,
  skip: number = 0,
  limit: number = 10,
  sortBy: string = '',
  order: 'asc' | 'desc' = 'asc',
  signal?: AbortSignal
): Promise<ProductsResponse> => {
  let url = `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
  if (sortBy) {
    url += `&sortBy=${sortBy}&order=${order}`;
  }
  const response = await api.get<ProductsResponse>(url, { signal });
  return response.data;
};

export const getCategories = async (): Promise<{slug: string, name: string, url: string}[]> => {
  const response = await api.get('/products/categories');
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const addProduct = async (productData: Partial<Product>): Promise<Product> => {
  const response = await api.post<Product>('/products/add', productData);
  return response.data;
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  const response = await api.put<Product>(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<{isDeleted: boolean, deletedOn: string}> => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
