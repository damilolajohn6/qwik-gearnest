import { OrderTracking } from "@/components/shop/OrderTracking";

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600">
            Enter your tracking number or order number to see the latest status
          </p>
        </div>
        
        <OrderTracking />
      </div>
    </div>
  );
}
