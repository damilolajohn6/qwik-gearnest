/* eslint-disable @typescript-eslint/no-unused-vars */
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus
} from "lucide-react";
import { ProductDetails } from "@/components/shop/ProductDetails";
import { ProductReviews } from "@/components/shop/ProductReviews";
import { RelatedProducts } from "@/components/shop/RelatedProducts";
import connectDB from "@/lib/db";
import { Product } from "@/models/Product";

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string) {
  try {
    await connectDB();
    
    const product = await Product.findOne({ 
      _id: id, 
      isActive: true 
    })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return null;
    }

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getRelatedProducts(categoryId: string, excludeId: string) {
  try {
    await connectDB();
    
    const products = await Product.find({
      category: categoryId,
      isActive: true,
      _id: { $ne: excludeId }
    })
      .populate("category", "name slug")
      .sort({ soldCount: -1 })
      .limit(4)
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="h-96 w-full" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category._id, product._id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/products" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>

        {/* Product Details */}
        <Suspense fallback={<ProductSkeleton />}>
          <ProductDetails product={product} />
        </Suspense>

        {/* Product Reviews */}
        <div className="mt-16">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <ProductReviews productId={product._id} />
          </Suspense>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
