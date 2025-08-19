"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

interface FeaturedCategoriesProps {
  categories: Category[];
}

const defaultCategories = [
  {
    name: "Laptop",
    slug: "laptops",
    image: "/stationary.jpg",
  },
  {
    name: "Wireless Charger",
    slug: "wireless-chargers",
    image: "/wireless.jpg",
  },
  {
    name: "Charger",
    slug: "chargers",
    image: "/charger.jpg",
  },
  {
    name: "Phones",
    slug: "phones",
    image: "/phones.jpg",
  },
];

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  const displayCategories =
    categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            How can you develop your style without changing device?
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/products/${category.slug}`}
              className="group"
            >
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="relative h-24 w-24 mx-auto mb-4">
                  <Image
                    src={category.image || "/images/placeholder-category.jpg"}
                    alt={category.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
