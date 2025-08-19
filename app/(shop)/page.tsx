import { HeroSection } from "@/components/shop/HeroSection";
import { FeaturedCategories } from "@/components/shop/FeaturedCategories";
import { BestSellers } from "@/components/shop/BestSellers";
import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import PromoBanner from "@/components/shop/PromoBanner";

async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await Product.find({
      isActive: true,
      isFeatured: true,
    })
      .populate("category")
      .sort({ soldCount: -1 })
      .limit(8)
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .limit(4)
      .lean();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedCategories categories={categories} />
      <BestSellers products={featuredProducts} />
      <PromoBanner />
    </div>
  );
}
