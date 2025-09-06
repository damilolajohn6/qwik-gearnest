"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Store, 
  Shield, 
  CreditCard, 
  Bell,
  Save,
  Trash2
} from "lucide-react";
import { useState } from "react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    store: {
      name: "GearNest",
      description: "Your one-stop shop for tech gadgets",
      email: "admin@gearnest.com",
      phone: "+1 (555) 123-4567",
      address: "123 Tech Street, Silicon Valley, CA 94000",
      currency: "USD",
      timezone: "America/Los_Angeles",
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      lowStockAlerts: true,
      customerSupport: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordPolicy: "strong",
    },
    payment: {
      stripeEnabled: true,
      paypalEnabled: false,
      paystackEnabled: true,
    },
    maintenance: {
      maintenanceMode: false,
      allowRegistrations: true,
    }
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving settings:", settings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your store configuration and preferences
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Store Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Store Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input
                id="store-name"
                value={settings.store.name}
                onChange={(e) => setSettings({
                  ...settings,
                  store: { ...settings.store, name: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-email">Store Email</Label>
              <Input
                id="store-email"
                type="email"
                value={settings.store.email}
                onChange={(e) => setSettings({
                  ...settings,
                  store: { ...settings.store, email: e.target.value }
                })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="store-description">Store Description</Label>
            <Textarea
              id="store-description"
              value={settings.store.description}
              onChange={(e) => setSettings({
                ...settings,
                store: { ...settings.store, description: e.target.value }
              })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="store-phone">Phone Number</Label>
              <Input
                id="store-phone"
                value={settings.store.phone}
                onChange={(e) => setSettings({
                  ...settings,
                  store: { ...settings.store, phone: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-currency">Currency</Label>
              <Input
                id="store-currency"
                value={settings.store.currency}
                onChange={(e) => setSettings({
                  ...settings,
                  store: { ...settings.store, currency: e.target.value }
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-address">Address</Label>
            <Textarea
              id="store-address"
              value={settings.store.address}
              onChange={(e) => setSettings({
                ...settings,
                store: { ...settings.store, address: e.target.value }
              })}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.notifications.emailNotifications}
              onCheckedChange={(checked: boolean) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, emailNotifications: checked }
              })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="order-notifications">Order Notifications</Label>
              <p className="text-sm text-gray-500">Get notified of new orders</p>
            </div>
            <Switch
              id="order-notifications"
              checked={settings.notifications.orderNotifications}
              onCheckedChange={(checked: boolean) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, orderNotifications: checked }
              })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="low-stock-alerts">Low Stock Alerts</Label>
              <p className="text-sm text-gray-500">Alert when inventory is low</p>
            </div>
            <Switch
              id="low-stock-alerts"
              checked={settings.notifications.lowStockAlerts}
              onCheckedChange={(checked: boolean) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, lowStockAlerts: checked }
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <Switch
              id="two-factor-auth"
              checked={settings.security.twoFactorAuth}
              onCheckedChange={(checked: boolean) => setSettings({
                ...settings,
                security: { ...settings.security, twoFactorAuth: checked }
              })}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
            <Input
              id="session-timeout"
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Stripe</span>
              <Badge variant={settings.payment.stripeEnabled ? "default" : "secondary"}>
                {settings.payment.stripeEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <Switch
              checked={settings.payment.stripeEnabled}
              onCheckedChange={(checked: boolean) => setSettings({
                ...settings,
                payment: { ...settings.payment, stripeEnabled: checked }
              })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>PayPal</span>
              <Badge variant={settings.payment.paypalEnabled ? "default" : "secondary"}>
                {settings.payment.paypalEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <Switch
              checked={settings.payment.paypalEnabled}
              onCheckedChange={(checked: boolean) => setSettings({
                ...settings,
                payment: { ...settings.payment, paypalEnabled: checked }
              })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Paystack</span>
              <Badge variant={settings.payment.paystackEnabled ? "default" : "secondary"}>
                {settings.payment.paystackEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <Switch
              checked={settings.payment.paystackEnabled}
              onCheckedChange={(checked: boolean) => setSettings({
                ...settings,
                payment: { ...settings.payment, paystackEnabled: checked }
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              <p className="text-sm text-gray-500">Temporarily disable the store</p>
            </div>
            <Switch
              id="maintenance-mode"
              checked={settings.maintenance.maintenanceMode}
              onCheckedChange={(checked: boolean) => setSettings({
                ...settings,
                maintenance: { ...settings.maintenance, maintenanceMode: checked }
              })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allow-registrations">Allow New Registrations</Label>
              <p className="text-sm text-gray-500">Allow new customers to register</p>
            </div>
            <Switch
              id="allow-registrations"
              checked={settings.maintenance.allowRegistrations}
              onCheckedChange={(checked: boolean) => setSettings({
                ...settings,
                maintenance: { ...settings.maintenance, allowRegistrations: checked }
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Reset All Settings</h4>
            <p className="text-sm text-red-600 mb-4">
              This will reset all settings to their default values. This action cannot be undone.
            </p>
            <Button variant="destructive" size="sm">
              Reset Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
