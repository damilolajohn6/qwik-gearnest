"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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

interface LatestDealsProps {
  products: Product[];
}

export function LatestDeals({ products }: LatestDealsProps) {
  if (products.length === 0) {
    return null;
  }

  const calculateDiscount = (originalPrice: number, salePrice: number) => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Latest Deals
            </h2>
            <p className="text-gray-600">Don&apos;t miss out on these amazing offers</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products?sort=price-low">View All Deals</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const discount = product.salePrice 
              ? calculateDiscount(product.price, product.salePrice)
              : 0;
            const currentPrice = product.salePrice || product.price;

            return (
              <Card key={product._id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                      <Image
                        src={product.images[0] || "/images/placeholder-product.jpg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                        -{discount}%
                      </Badge>
                    )}

                    {/* Flash Sale Badge */}
                    <Badge className="absolute top-3 right-3 bg-orange-500 text-white flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Flash Sale
                    </Badge>

                    {/* Quick Add to Cart */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        className="w-full bg-white text-gray-900 hover:bg-gray-100"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Quick Add
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-sm text-indigo-600 font-medium">
                        {product.category.name}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-1">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-gray-900">
                        {formatCurrency(currentPrice)}
                      </span>
                      {product.salePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>

                    {/* Sold Count */}
                    <div className="text-sm text-gray-500 mb-4">
                      {product.soldCount} sold
                    </div>

                    <Button className="w-full" asChild>
                      <Link href={`/products/${product._id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Countdown Timer */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Flash Sale Ending Soon!</h3>
            <p className="text-lg mb-4">Hurry up! These deals won&apos;t last long</p>
            <div className="flex justify-center gap-4 text-2xl font-mono">
              <div className="bg-white/20 px-4 py-2 rounded">
                <div>02</div>
                <div className="text-sm">Hours</div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded">
                <div>45</div>
                <div className="text-sm">Minutes</div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded">
                <div>30</div>
                <div className="text-sm">Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
