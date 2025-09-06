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

async function getCategories() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/categories?includeProductCount=true`,
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function FeaturedCategories() {
  const categories = await getCategories();
  
  // If no categories from API, show empty state
  if (categories.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our product categories
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">No categories available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

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
          {categories.map((category: Category) => (
            <Link
              key={category._id}
              href={`/products?category=${category.slug}`}
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
                {category.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
