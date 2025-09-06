"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Filter } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  searchParams: any;
}

export function ProductFilters({ categories, searchParams }: ProductFiltersProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.minPrice) || 0,
    parseInt(searchParams.maxPrice) || 1000,
  ]);

  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(urlSearchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to first page when filtering
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(urlSearchParams);
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const hasActiveFilters = 
    searchParams.category || 
    searchParams.minPrice || 
    searchParams.maxPrice || 
    searchParams.sort !== "newest";

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Sort */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={searchParams.sort || "newest"}
            onValueChange={(value) => updateSearchParams("sort", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-categories"
              checked={!searchParams.category}
              onCheckedChange={() => updateSearchParams("category", null)}
            />
            <Label htmlFor="all-categories" className="text-sm">
              All Categories
            </Label>
          </div>
          {categories.map((category) => (
            <div key={category._id} className="flex items-center space-x-2">
              <Checkbox
                id={category.slug}
                checked={searchParams.category === category._id}
                onCheckedChange={() => 
                  updateSearchParams("category", category._id)
                }
              />
              <Label htmlFor={category.slug} className="text-sm">
                {category.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
          <Button onClick={applyPriceFilter} className="w-full" size="sm">
            Apply Price Filter
          </Button>
        </CardContent>
      </Card>

      {/* Quick Price Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              updateSearchParams("minPrice", "0");
              updateSearchParams("maxPrice", "100");
            }}
          >
            Under $100
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              updateSearchParams("minPrice", "100");
              updateSearchParams("maxPrice", "500");
            }}
          >
            $100 - $500
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              updateSearchParams("minPrice", "500");
              updateSearchParams("maxPrice", "1000");
            }}
          >
            $500 - $1000
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              updateSearchParams("minPrice", "1000");
              updateSearchParams("maxPrice", null);
            }}
          >
            Over $1000
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
