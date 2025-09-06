"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const brands = [
  {
    name: "Apple",
    logo: "/brands/apple-logo.png",
    description: "Innovation at its finest",
  },
  {
    name: "Samsung",
    logo: "/brands/samsung-logo.png",
    description: "Technology for everyone",
  },
  {
    name: "Sony",
    logo: "/brands/sony-logo.png",
    description: "Premium audio & electronics",
  },
  {
    name: "Dell",
    logo: "/brands/dell-logo.png",
    description: "Powerful computing solutions",
  },
  {
    name: "Microsoft",
    logo: "/brands/microsoft-logo.png",
    description: "Empowering productivity",
  },
  {
    name: "Google",
    logo: "/brands/google-logo.png",
    description: "Making technology accessible",
  },
];

export function FeaturedBrands() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted Brands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We partner with the world's leading technology brands to bring you the best products
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 font-bold text-sm">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {brand.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {brand.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Brand Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
            <div className="text-gray-600">Trusted Brands</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
            <div className="text-gray-600">Products Available</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">99%</div>
            <div className="text-gray-600">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
}
