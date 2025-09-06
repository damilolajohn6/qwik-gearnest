"use client";

import Link from "next/link";
import { ProductGrid } from "./ProductGrid";
import { Button } from "@/components/ui/button";

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
  isActive: boolean;
  isFeatured: boolean;
}

interface BestSellersProps {
  products: Product[];
}

export function BestSellers({ products }: BestSellersProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Best Sellers
            </h2>
            <p className="text-gray-600">Today Deals</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="aspect-square bg-gray-100 rounded-lg mb-4"></div>
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.salePrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.salePrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  ({product.reviewCount})
                </span>
              </div>
              <Button className="w-full" asChild>
                <Link href={`/products/${product._id}`}>View Details</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
