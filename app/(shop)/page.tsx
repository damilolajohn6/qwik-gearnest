import { HeroSection } from "@/components/shop/HeroSection";
import { FeaturedCategories } from "@/components/shop/FeaturedCategories";
import { BestSellers } from "@/components/shop/BestSellers";
import { FeaturedBrands } from "@/components/shop/FeaturedBrands";
import { WhyChooseUs } from "@/components/shop/WhyChooseUs";
import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import PromoBanner from "@/components/shop/PromoBanner";
import { LatestDeals } from "@/components/shop/LatestDeals";

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
      .limit(6)
      .lean();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getLatestDeals() {
  try {
    await connectDB();
    const deals = await Product.find({
      isActive: true,
      salePrice: { $exists: true, $ne: null },
    })
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    return JSON.parse(JSON.stringify(deals));
  } catch (error) {
    console.error("Error fetching deals:", error);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, categories, latestDeals] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getLatestDeals(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Categories */}
      <FeaturedCategories categories={categories} />
      
      {/* Why Choose Us */}
      <WhyChooseUs />
      
      {/* Best Sellers */}
      <BestSellers products={featuredProducts} />
      
      {/* Latest Deals */}
      <LatestDeals products={latestDeals} />
      
      {/* Featured Brands */}
      <FeaturedBrands />

      {/* Promo Banner */}
      <PromoBanner />
      
    </div>
  );
}
