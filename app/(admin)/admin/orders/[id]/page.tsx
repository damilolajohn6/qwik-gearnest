/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, User, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import OrderStatusUpdate from "@/components/admin/OrderStatusUpdate";

async function getOrder(orderId: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/orders/${orderId}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Package className="h-4 w-4" />;
    case 'confirmed':
      return <CheckCircle className="h-4 w-4" />;
    case 'processing':
      return <Package className="h-4 w-4" />;
    case 'shipped':
      return <Truck className="h-4 w-4" />;
    case 'delivered':
      return <CheckCircle className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-purple-100 text-purple-800';
    case 'shipped':
      return 'bg-indigo-100 text-indigo-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrder(params.id);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-4">The order you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/admin/orders">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Order #{order._id.slice(-8)}</h1>
            <p className="mt-2 text-sm text-gray-700">
              Order placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
            {getStatusIcon(order.status)}
            {order.status}
          </Badge>
          <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}>
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 h-16 w-16">
                      {item.product?.images?.[0] ? (
                        <Image
                          className="h-16 w-16 rounded-lg object-cover"
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={64}
                          height={64}
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product?.name || 'Product not found'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        SKU: {item.product?.sku || 'N/A'}
                      </p>
                    </div>
                    <div className="text-sm text-gray-900">
                      <div>Qty: {item.quantity}</div>
                      <div className="font-medium">{formatCurrency(item.total)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm">{formatCurrency(order.subtotal || order.total)}</span>
                </div>
                {order.tax && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tax</span>
                    <span className="text-sm">{formatCurrency(order.tax)}</span>
                  </div>
                )}
                {order.shipping && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Shipping</span>
                    <span className="text-sm">{formatCurrency(order.shipping)}</span>
                  </div>
                )}
                {order.discount && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Discount</span>
                    <span className="text-sm text-red-600">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{order.customer?.name || order.name || 'Guest'}</div>
                    <div className="text-sm text-gray-500">{order.customer?.email || order.email}</div>
                  </div>
                </div>
                {order.customer?.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{order.customer.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div className="text-sm">
                    <div className="font-medium">{order.shippingAddress.name}</div>
                    <div>{order.shippingAddress.street}</div>
                    <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</div>
                    <div>{order.shippingAddress.country}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{order.paymentMethod || 'Credit Card'}</div>
                    <div className="text-sm text-gray-500">
                      Status: {order.paymentStatus}
                    </div>
                  </div>
                </div>
                {order.paymentId && (
                  <div className="text-sm text-gray-500">
                    Payment ID: {order.paymentId}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Status Update */}
          <OrderStatusUpdate 
            orderId={order._id} 
            currentStatus={order.status}
          />

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="text-sm">
                    <div className="font-medium">Order Placed</div>
                    <div className="text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                {order.status !== 'pending' && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">
                      <div className="font-medium">Order Confirmed</div>
                      <div className="text-gray-500">
                        {order.confirmedAt ? new Date(order.confirmedAt).toLocaleString() : 'Auto-confirmed'}
                      </div>
                    </div>
                  </div>
                )}
                {order.status === 'shipped' && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <div className="text-sm">
                      <div className="font-medium">Shipped</div>
                      <div className="text-gray-500">
                        {order.shippedAt ? new Date(order.shippedAt).toLocaleString() : 'Recently shipped'}
                      </div>
                    </div>
                  </div>
                )}
                {order.status === 'delivered' && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <div className="font-medium">Delivered</div>
                      <div className="text-gray-500">
                        {order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : 'Recently delivered'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
