import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { CartProvider } from "@/components/providers/CartProvider";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
