import Link from "next/link";

export function Footer() {
  const footerLinks = {
    "Search & Explore": [
      { name: "Laptops", href: "/products/laptops" },
      { name: "Phones", href: "/products/phones" },
      { name: "Charger", href: "/products/chargers" },
      { name: "Accessories", href: "/products/accessories" },
    ],
    "Contact us": [
      { name: "gearnsetteam@gmail.com", href: "mailto:gearnsetteam@gmail.com" },
      { name: "07036138603", href: "tel:+2347036138603" },
    ],
    About: [
      { name: "Shop", href: "/products" },
      { name: "Categories", href: "/categories" },
      { name: "Support", href: "/support" },
      { name: "Pricing Deals", href: "/deals" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              Gear<span className="text-brand-blue">N</span>set
            </h3>
            <p className="text-gray-400">
              Premium tech accessories for your modern lifestyle. Quality
              products, fast delivery across Nigeria.
            </p>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-lg font-semibold">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 QwikGearNest. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
