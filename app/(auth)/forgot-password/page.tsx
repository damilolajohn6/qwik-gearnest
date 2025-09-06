"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { GalleryVerticalEnd } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-10">
        {/* Logo / Branding */}
        <div className="flex justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-8 sm:size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4 sm:size-3" />
            </div>
            <span className="text-lg sm:text-base">Qwik GearNest</span>
          </Link>
        </div>

        {/* Form Centered */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm sm:max-w-md">
            <Card className="w-full">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  Forgot Password?
                </CardTitle>
                <p className="text-gray-600">
                  Enter your email address and we&apos;ll send you a reset link
                </p>
              </CardHeader>

              <CardContent>
                {message && (
                  <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative bg-muted">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h2 className="text-3xl font-bold mb-4">Reset Your Password</h2>
            <p className="text-lg opacity-90">
              Don&apos;t worry, it happens to the best of us. We&apos;ll help you get back on track.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
