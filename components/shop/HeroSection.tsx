"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const heroSlides = [
  {
    id: 1,
    title: "Tech That Powers Your Dreams",
    subtitle: "Premium Quality. Unbeatable Prices.",
    description:
      "Discover the latest technology with exclusive deals and free shipping on orders over $75.",
    fallbackImage: "/images/satisfiedhandsome.jpg",
    ctaText: "Shop Now",
    ctaLink: "/products",
    badge: "Free Shipping",
    badgeColor: "bg-green-500",
    gradient: "from-blue-600/90 to-purple-600/90",
  },
  {
    id: 2,
    title: "iPhone 15 Pro Max",
    subtitle: "Innovation Redefined",
    description:
      "Experience the future of smartphones with cutting-edge features and premium design.",
    fallbackImage: "/phones.jpg",
    ctaText: "Explore iPhone",
    ctaLink: "/products?category=phones",
    badge: "New Arrival",
    badgeColor: "bg-blue-500",
    gradient: "from-slate-600/90 to-blue-600/90",
  },
  {
    id: 3,
    title: "MacBook Pro M3",
    subtitle: "Power Meets Elegance",
    description:
      "Unleash your creativity with the most powerful MacBook ever created for professionals.",
    fallbackImage: "/modern-technology.jpg",
    ctaText: "Shop MacBook",
    ctaLink: "/products?category=laptops",
    badge: "Best Seller",
    badgeColor: "bg-purple-500",
    gradient: "from-gray-600/90 to-purple-600/90",
  },
  {
    id: 4,
    title: "Gaming Accessories",
    subtitle: "Level Up Your Game",
    description:
      "Dominate the competition with premium gaming gear and accessories.",
    fallbackImage: "/stationary.jpg",
    ctaText: "Shop Gaming",
    ctaLink: "/products?category=gaming",
    badge: "Flash Sale",
    badgeColor: "bg-red-500",
    gradient: "from-red-600/90 to-orange-600/90",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6000); // smoother timing
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="relative h-[500px] sm:h-[600px] lg:min-h-screen overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={slide.fallbackImage}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
              quality={85}
            />
            {/* Gradient Overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-r",
                slide.gradient
              )}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl lg:max-w-4xl">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={cn(
                  "transition-all duration-1000 ease-out",
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10 pointer-events-none"
                )}
              >
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6 border border-white/30">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full mr-2 animate-pulse",
                      slide.badgeColor
                    )}
                  ></span>
                  <span className="text-white font-medium text-sm">
                    {slide.badge}
                  </span>
                </div>

                <h1 className="text-white font-bold leading-tight drop-shadow-lg mb-4 text-[clamp(1.8rem,5vw,4rem)]">
                  {slide.title}
                </h1>
                <p className="text-blue-100 mb-3 font-medium drop-shadow-md text-[clamp(1rem,2.5vw,1.5rem)]">
                  {slide.subtitle}
                </p>
                <p className="text-gray-200 mb-8 max-w-2xl leading-relaxed drop-shadow-sm text-[clamp(0.9rem,2vw,1.1rem)]">
                  {slide.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105"
                  >
                    <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-lg transition-transform duration-300 hover:scale-105"
                  >
                    <Link href="/products">Browse All</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentSlide
                ? "bg-white shadow-lg scale-125"
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
        <div
          key={currentSlide} // re-trigger animation
          className="h-full bg-white/80 animate-[grow_6s_linear_forwards]"
        />
      </div>
    </section>
  );
}
