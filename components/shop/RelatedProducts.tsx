"use client";

import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          You Might Also Like
        </h2>
        <p className="text-gray-600">
          Discover more products in the same category
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="text-center">
        <Link
          href={`/products?category=${products[0]?.category._id}`}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          View All {products[0]?.category.name}
        </Link>
      </div>
    </div>
  );
}
