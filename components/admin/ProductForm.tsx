/* eslint-disable @typescript-eslint/no-explicit-any */
// components/admin/ProductForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/common/ImageUpload";
import { Plus, Minus } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z
    .string()
    .max(200, "Short description cannot exceed 200 characters")
    .optional(),
  price: z.number().min(0, "Price must be a positive number"),
  salePrice: z.number().min(0).optional(),
  category: z.string().min(1, "Please select a category"),
  inventory: z.number().min(0, "Inventory must be a non-negative number"),
  sku: z.string().optional(),
  weight: z.number().min(0).optional(),
  dimensions: z
    .object({
      length: z.number().min(0).optional(),
      width: z.number().min(0).optional(),
      height: z.number().min(0).optional(),
    })
    .optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  tags: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: any;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [features, setFeatures] = useState<string[]>(product?.features || []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      shortDescription: product?.shortDescription || "",
      price: product?.price || 0,
      salePrice: product?.salePrice || 0,
      category: product?.category?._id || "",
      inventory: product?.inventory || 0,
      sku: product?.sku || "",
      weight: product?.weight || 0,
      dimensions: {
        length: product?.dimensions?.length || 0,
        width: product?.dimensions?.width || 0,
        height: product?.dimensions?.height || 0,
      },
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured || false,
    },
  });

  const watchedPrice = watch("price");
  const watchedSalePrice = watch("salePrice");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addTag = () => {
    setTags([...tags, ""]);
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    if (data.salePrice && data.salePrice >= data.price) {
      alert("Sale price must be less than regular price");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...data,
        images,
        tags: tags.filter((tag) => tag.trim()),
        features: features.filter((feature) => feature.trim()),
      };

      const url = product ? `/api/products/${product._id}` : "/api/products";
      const method = product ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/admin/products");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              {...register("shortDescription")}
              placeholder="Brief product summary (optional)"
            />
            {errors.shortDescription && (
              <p className="text-sm text-red-600 mt-1">
                {errors.shortDescription.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Detailed product description"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category: any) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Regular Price (₦)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="salePrice">Sale Price (₦) - Optional</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                {...register("salePrice", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.salePrice && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.salePrice.message}
                </p>
              )}
              {watchedSalePrice && watchedSalePrice >= watchedPrice && (
                <p className="text-sm text-red-600 mt-1">
                  Sale price must be less than regular price
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory & Details */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory & Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inventory">Inventory</Label>
              <Input
                id="inventory"
                type="number"
                {...register("inventory", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.inventory && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.inventory.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="sku">SKU (Optional)</Label>
              <Input id="sku" {...register("sku")} placeholder="Product SKU" />
            </div>
          </div>

          <div>
            <Label htmlFor="weight">Weight (kg) - Optional</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              {...register("weight", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label>Dimensions (cm) - Optional</Label>
            <div className="grid grid-cols-3 gap-4">
              <Input
                type="number"
                step="0.01"
                {...register("dimensions.length", { valueAsNumber: true })}
                placeholder="Length"
              />
              <Input
                type="number"
                step="0.01"
                {...register("dimensions.width", { valueAsNumber: true })}
                placeholder="Width"
              />
              <Input
                type="number"
                step="0.01"
                {...register("dimensions.height", { valueAsNumber: true })}
                placeholder="Height"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={5}
          />
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={tag}
                  onChange={(e) => updateTag(index, e.target.value)}
                  placeholder="Enter tag"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeTag(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addTag}>
              <Plus className="mr-2 h-4 w-4" />
              Add Tag
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Enter feature"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFeature(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addFeature}>
              <Plus className="mr-2 h-4 w-4" />
              Add Feature
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="isActive" {...register("isActive")} />
            <Label htmlFor="isActive">
              Active (product is visible to customers)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isFeatured" {...register("isFeatured")} />
            <Label htmlFor="isFeatured">
              Featured (highlight this product)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : product
            ? "Update Product"
            : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
