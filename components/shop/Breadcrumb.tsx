/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
}

interface BreadcrumbProps {
  searchParams: any;
}

export function Breadcrumb({ searchParams }: BreadcrumbProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
  ];

  if (searchParams.search) {
    breadcrumbs.push({
      name: "Search",
      href: "/products",
    });
    breadcrumbs.push({
      name: `"${searchParams.search}"`,
      href: "#",
    });
  } else if (searchParams.category) {
    breadcrumbs.push({
      name: "Products",
      href: "/products",
    });
    breadcrumbs.push({
      name: "Category",
      href: "#",
    });
  } else {
    breadcrumbs.push({
      name: "Products",
      href: "/products",
    });
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const Icon = breadcrumb.icon;

        return (
          <div key={index} className="flex items-center space-x-2">
            {Icon && <Icon className="h-4 w-4" />}
            {isLast ? (
              <span className="text-gray-900 font-medium">{breadcrumb.name}</span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="hover:text-gray-900 transition-colors"
              >
                {breadcrumb.name}
              </Link>
            )}
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </div>
        );
      })}
    </nav>
  );
}
