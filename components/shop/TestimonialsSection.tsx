"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Tech Enthusiast",
    avatar: "/avatars/sarah.jpg",
    rating: 5,
    content: "GearNest has completely transformed my tech shopping experience. The quality of products and customer service is outstanding. I've been a loyal customer for over 2 years now.",
    product: "iPhone 15 Pro Max",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Developer",
    avatar: "/avatars/michael.jpg",
    rating: 5,
    content: "Fast shipping, great prices, and excellent customer support. I've purchased multiple laptops and accessories from GearNest. Highly recommended!",
    product: "MacBook Pro M3",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Content Creator",
    avatar: "/avatars/emily.jpg",
    rating: 5,
    content: "The product quality is amazing and the deals are unbeatable. GearNest has become my go-to place for all tech needs. Love the user-friendly website!",
    product: "Sony WH-1000XM5",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Business Owner",
    avatar: "/avatars/david.jpg",
    rating: 5,
    content: "Professional service and top-notch products. The warranty and return policy gives me confidence in every purchase. GearNest delivers on their promises.",
    product: "Dell XPS 13",
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Student",
    avatar: "/avatars/lisa.jpg",
    rating: 5,
    content: "As a student, I appreciate the affordable prices without compromising on quality. The customer service team is always helpful and responsive.",
    product: "iPad Air",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Gaming Enthusiast",
    avatar: "/avatars/james.jpg",
    rating: 5,
    content: "Best gaming accessories and peripherals! The delivery was super fast and everything was packaged perfectly. Will definitely shop here again.",
    product: "Gaming Headset",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our satisfied customers have to say about their GearNest experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <div className="relative mb-4">
                  <Quote className="h-8 w-8 text-indigo-200 absolute -top-2 -left-2" />
                  <p className="text-gray-700 italic pl-6">
                    &quot;{testimonial.content}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-indigo-600 mt-1">
                      Purchased: {testimonial.product}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Rating */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Overall Customer Rating</h3>
            <div className="flex items-center justify-center gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-8 w-8 text-yellow-400 fill-current"
                />
              ))}
              <span className="text-2xl font-bold ml-2">4.9/5</span>
            </div>
            <p className="text-lg opacity-90">
              Based on 10,000+ customer reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
