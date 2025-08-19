import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { Providers } from "@/components/providers/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GearNset - Premium Tech Accessories",
  description:
    "Discover premium smartphones, laptops, and accessories that power your tech life. Fast shipping across Nigeria.",
  keywords: "smartphones, laptops, accessories, Nigeria, tech, electronics",
  openGraph: {
    title: "GearNset - Premium Tech Accessories",
    description: "Discover premium smartphones, laptops, and accessories",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Providers> */}
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#333",
                color: "#fff",
              },
              success: {
                style: {
                  background: "#22c55e",
                },
              },
              error: {
                style: {
                  background: "#ef4444",
                },
              },
            }}
          />
        {/* </Providers> */}
      </body>
    </html>
  );
}
