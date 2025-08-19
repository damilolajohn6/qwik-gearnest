"use client";

import Link from "next/link";
import { ProductGrid } from "./ProductGrid";
import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  category: {
    name: string;
    slug: string;
  };
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

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
