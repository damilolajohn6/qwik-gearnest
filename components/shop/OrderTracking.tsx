"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  MapPin,
  Calendar,
  RefreshCw
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

interface OrderTracking {
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: string;
  events: TrackingEvent[];
  currentLocation?: string;
}

const statusConfig = {
  pending: {
    label: "Order Placed",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    description: "Your order has been received and is being processed"
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
    icon: Package,
    description: "Your order is being prepared for shipment"
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
    icon: Truck,
    description: "Your order is on the way"
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Your order has been delivered"
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: Clock,
    description: "Your order has been cancelled"
  },
};

export function OrderTracking() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderTracking, setOrderTracking] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = async () => {
    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Mock tracking data - in real app, this would call a tracking API
      const mockTrackingData: OrderTracking = {
        orderNumber: trackingNumber,
        status: "shipped",
        trackingNumber: trackingNumber,
        estimatedDelivery: "2024-01-15T00:00:00Z",
        currentLocation: "Distribution Center, Los Angeles, CA",
        events: [
          {
            status: "pending",
            location: "Order Processing Center",
            timestamp: "2024-01-10T10:00:00Z",
            description: "Order received and payment confirmed"
          },
          {
            status: "processing",
            location: "Warehouse",
            timestamp: "2024-01-11T14:30:00Z",
            description: "Order is being prepared for shipment"
          },
          {
            status: "shipped",
            location: "Distribution Center, Los Angeles, CA",
            timestamp: "2024-01-12T09:15:00Z",
            description: "Order has been shipped"
          }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrderTracking(mockTrackingData);
      toast.success("Tracking information found");
    } catch (error) {
      setError("Failed to track order. Please check your tracking number.");
      toast.error("Failed to track order");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Track Your Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter tracking number or order number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
            />
            <Button 
              onClick={handleTrackOrder} 
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      {orderTracking && (
        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Status</CardTitle>
                <Badge className={statusConfig[orderTracking.status].color}>
                  {statusConfig[orderTracking.status].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Number</p>
                    <p className="text-sm text-gray-500">{orderTracking.orderNumber}</p>
                  </div>
                </div>
                
                {orderTracking.trackingNumber && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Tracking Number</p>
                      <p className="text-sm text-gray-500 font-mono">{orderTracking.trackingNumber}</p>
                    </div>
                  </div>
                )}

                {orderTracking.estimatedDelivery && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Estimated Delivery</p>
                      <p className="text-sm text-gray-500">{formatDate(orderTracking.estimatedDelivery)}</p>
                    </div>
                  </div>
                )}
              </div>

              {orderTracking.currentLocation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Current Location</span>
                  </div>
                  <p className="text-blue-700 mt-1">{orderTracking.currentLocation}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderTracking.events.map((event, index) => {
                  const isLast = index === orderTracking.events.length - 1;
                  const eventConfig = statusConfig[event.status as keyof typeof statusConfig];
                  const EventIcon = eventConfig?.icon || Clock;

                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isLast ? 'bg-indigo-100' : 'bg-gray-100'
                        }`}>
                          <EventIcon className={`h-5 w-5 ${
                            isLast ? 'text-indigo-600' : 'text-gray-400'
                          }`} />
                        </div>
                        {!isLast && (
                          <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {eventConfig?.label || event.status}
                          </h4>
                          <Badge className={eventConfig?.color || "bg-gray-100 text-gray-800"}>
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(event.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
