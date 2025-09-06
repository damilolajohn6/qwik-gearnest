"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  ShoppingCart,
  Plus,
  Minus,
  Check
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  inventory: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  tags?: string[];
  specifications?: Record<string, string>;
}

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    addItem({
      id: product._id,
      name: product.name,
      price: currentPrice,
      image: product.images[0],
      quantity: quantity,
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const currentPrice = product.salePrice || product.price;
  const discount = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.images[selectedImage] || "/images/placeholder-product.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {discount > 0 && (
            <Badge className="absolute top-4 left-4 bg-red-500">
              -{discount}%
            </Badge>
          )}
        </div>
        
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 w-full overflow-hidden rounded-lg border-2 transition-colors ${
                  selectedImage === index ? "border-indigo-500" : "border-gray-200"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href={`/products?category=${product.category._id}`}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              {product.category.name}
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
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
              <span className="text-sm text-gray-600 ml-1">
                ({product.reviewCount} reviews)
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {product.soldCount} sold
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-gray-900">
            ${currentPrice.toFixed(2)}
          </div>
          {product.salePrice && (
            <div className="text-xl text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          {product.description}
        </p>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Quantity and Add to Cart */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                disabled={quantity >= product.inventory}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-gray-600">
              {product.inventory} in stock
            </span>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleAddToCart}
              className="flex-1"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleWishlist}
              className={isWishlisted ? "text-red-500" : ""}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-indigo-600" />
                <div>
                  <div className="font-medium">Free Shipping</div>
                  <div className="text-sm text-gray-600">On orders over $50</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-indigo-600" />
                <div>
                  <div className="font-medium">2 Year Warranty</div>
                  <div className="text-sm text-gray-600">Full coverage</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-6 w-6 text-indigo-600" />
                <div>
                  <div className="font-medium">30 Day Returns</div>
                  <div className="text-sm text-gray-600">No questions asked</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b last:border-b-0">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
