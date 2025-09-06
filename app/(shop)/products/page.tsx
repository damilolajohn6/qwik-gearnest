/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from "react";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

interface SearchParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
}

interface ProductsPageProps {
  searchParams: SearchParams;
}

async function getProducts(searchParams: SearchParams) {
  try {
    await connectDB();

    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort = "newest",
      page = "1",
    } = searchParams;

    const pageNumber = parseInt(page);
    const limit = 12;
    const skip = (pageNumber - 1) * limit;

    // Build query
    const query: any = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Build sort
    const sortQuery: any = {};
    switch (sort) {
      case "price-low":
        sortQuery.price = 1;
        break;
      case "price-high":
        sortQuery.price = -1;
        break;
      case "rating":
        sortQuery.rating = -1;
        break;
      case "popular":
        sortQuery.soldCount = -1;
        break;
      default:
        sortQuery.createdAt = -1;
    }

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return {
      products: JSON.parse(JSON.stringify(products)),
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limit),
        totalProducts: totalCount,
        hasNext: pageNumber < Math.ceil(totalCount / limit),
        hasPrev: pageNumber > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalProducts: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}

async function getCategories() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [productsData, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  const { products, pagination } = productsData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb searchParams={searchParams} />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchParams.search ? `Search Results for "${searchParams.search}"` : "All Products"}
          </h1>
          <p className="text-gray-600">
            {pagination.totalProducts} products found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <ProductFilters
              categories={categories}
              searchParams={searchParams}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <Suspense fallback={<ProductsSkeleton />}>
              <ProductGrid
                products={products}
                pagination={pagination}
                searchParams={searchParams}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
