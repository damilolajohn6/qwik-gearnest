"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  Truck, 
  Shield, 
  RotateCcw, 
  Headphones, 
  Award, 
  Zap 
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on orders over $75",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Shield,
    title: "2 Year Warranty",
    description: "Full coverage on all products",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: RotateCcw,
    title: "30 Day Returns",
    description: "No questions asked returns",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer service",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description: "Premium quality products only",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Same-day delivery available",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose GearNest?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;re committed to providing the best shopping experience with premium products and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
