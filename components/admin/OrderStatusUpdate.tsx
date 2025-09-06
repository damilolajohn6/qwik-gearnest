"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdate?: () => void;
}

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Package },
  { value: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { value: 'processing', label: 'Processing', icon: Package },
  { value: 'shipped', label: 'Shipped', icon: Truck },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle },
];

export default function OrderStatusUpdate({ 
  orderId, 
  currentStatus, 
  onStatusUpdate 
}: OrderStatusUpdateProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) {
      toast.error('Status is already set to this value');
      return;
    }

    setIsUpdating(true);

    try {
      // Get token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          status: selectedStatus,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update order status');
      }

      toast.success('Order status updated successfully!');
      
      // Call the callback to refresh data
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatusOption = statusOptions.find(option => option.value === currentStatus);
  const selectedStatusOption = statusOptions.find(option => option.value === selectedStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Order Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Current Status</label>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            {currentStatusOption && (
              <>
                <currentStatusOption.icon className="h-4 w-4" />
                <span className="text-sm">{currentStatusOption.label}</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">New Status</label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedStatus !== currentStatus && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <span>Changing from</span>
              <div className="flex items-center gap-1">
                {currentStatusOption && (
                  <>
                    <currentStatusOption.icon className="h-3 w-3" />
                    {currentStatusOption.label}
                  </>
                )}
              </div>
              <span>to</span>
              <div className="flex items-center gap-1">
                {selectedStatusOption && (
                  <>
                    <selectedStatusOption.icon className="h-3 w-3" />
                    {selectedStatusOption.label}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={handleStatusUpdate}
          disabled={isUpdating || selectedStatus === currentStatus}
          className="w-full"
        >
          {isUpdating ? 'Updating...' : 'Update Status'}
        </Button>
      </CardContent>
    </Card>
  );
}
