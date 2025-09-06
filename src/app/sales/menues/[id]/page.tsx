"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { MenuGrid } from "@/components/MenuGrid";
import { OrderManagement } from "@/components/OrderManagement";
import { CurrencyEntity, MenuItem, OrderEntity, Settings } from "@/types/pos";
import { Cart } from "@/components/Cart";
import { use, useCallback, useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Kitchen } from "@/components/Kitchen";
import { useRouter } from "next/navigation";
import { SellHeader } from "@/components/SellHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Extend the Window interface to include electronAPI
declare global {
  interface Window {
    electronAPI: any;
  }
}

export type ViewMode = "pos" | "orders";

interface ProductProps {
  params: Promise<{ id: number }>; // ✅ Update: params is now a Promise
}

export default function ProductsPage({ params }: ProductProps) {
  const router = useRouter();

  // ✅ Unwrap params using React.use
  const { id } = use(params); // This resolves the Promise and gives you the params object
  const tableId = Number(id); // ✅ Cast to number after unwrapping

  const [viewMode, setViewMode] = useState<ViewMode>("pos");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const [currency, setCurrency] = useState<CurrencyEntity>({
    id: 1,
    code: "USD",
    symbol: "$",
    currency_name: "dollar",
    is_main: true,
  });

  const [settings, setSettings] = useState<Settings>({
    currency: "USD",
    currencySymbol: "$",
    currencyPosition: "before",
    decimalPlaces: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
    autoUpdateRates: true,
    exchangeRateApiKey: "",
    taxRate: 0,
    taxName: "Tax",
    taxInclusive: false,
    showTaxSeparately: true,
    taxNumber: "",
    showTaxNumberOnReceipts: false,
  });

  const {
    order,
    setOrder,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartItemCheckOut,
    clearCart,
    cartTotal,
    cartCount,
  } = useCart();

  // --- FETCH INITIAL DATA ---
  const fetchProducts = async () => {
    const settingData = await window.electronAPI.getSetting();
    setSettings(settingData);

    const productData = await window.electronAPI.getProducts();
    setMenuItems(productData);

    const currencyData = await window.electronAPI.getDefaultCurrency();
    setCurrency(currencyData);

    const orderData = await window.electronAPI.getBillByTable(tableId); // ✅ Use tableId
    if (orderData) {
      const mapData = {
        ...orderData,
        items: (orderData.orderItems as []).map((item: any) => ({
          id: item.id,
          menuItem: item.products,
          price: item.products.price,
          quantity: item.quantity,
          is_checkout: true,
          notes: item.notes ?? "",
        }))
      };

      delete mapData.orderItems;

      setOrder(mapData);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [tableId]); // ✅ Dependency: use tableId instead of id

  // --- CALCULATE SUBTOTAL, TAX, TOTAL WHEN ITEMS CHANGE ---
  useEffect(() => {
    if (order.items.length === 0) {
      setOrder((prev) => ({ ...prev, subtotal: 0, tax: 0, total: 0 }));
      return;
    }

    const subtotal = order.items.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );
    const tax = subtotal * (settings.taxRate / 100);
    const total = subtotal + tax;

    setOrder((prev) => ({
      ...prev,
      subtotal,
      tax,
      total,
    }));
  }, [order.items, settings.taxRate]);

  // --- RECEIPT GENERATOR ---
  const generateReceipt = (serial: string) => {
    const subtotal = order.items
      .filter((item) => item.is_checkout)
      .reduce((acc, item) => acc + item.price * item.quantity, 0);

    const tax = subtotal * (settings.taxRate / 100);
    const total = subtotal + tax;

    return `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Arial', sans-serif; background-color: #fff; }
  .receipt { width: 300px; margin: auto; padding: 20px; }
  .receipt-header { text-align: center; border-bottom: 1px dashed #ddd; }
  .item-row { display: flex; justify-content: space-between; }
  .totals { border-top: 1px dashed #ddd; margin-top: 15px; }
</style>
</head>
<body>
  <div class="receipt">
    <div class="receipt-header">
      <h2>RESTAURANT NAME</h2>
      <p>Order #: ${serial}</p>
      <p>Date: ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="items-list">
      ${order.items
        .filter((item) => item.is_checkout)
        .map(
          (item) => `
        <div class="item-row">
          <span>${item.menuItem.name} ${item.quantity > 1 ? `×${item.quantity}` : ""
            }</span>
          <span>${currency.symbol}${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `
        )
        .join("")}
    </div>

    <div class="totals">
      <div>Subtotal: ${currency.symbol}${subtotal.toFixed(2)}</div>
      <div>Tax: ${currency.symbol}${tax.toFixed(2)}</div>
      <div><b>Total: ${currency.symbol}${total.toFixed(2)}</b></div>
    </div>
  </div>
</body>
</html>`;
  };

  // --- CART HANDLERS ---
  const handleAddToCart = useCallback(
    (menuItem: MenuItem) => {
      addToCart(menuItem);
    },
    [addToCart]
  );

  const updateIsCartCheckOut = useCallback(
    (index: number, value: boolean) => {
      updateCartItemCheckOut(index, value);
    },
    [updateCartItemCheckOut]
  );

  const handleOrder = useCallback(async () => {
    if (order.items.length === 0) return;
    if (!order.id) {
      // New order
      const newOrder: OrderEntity = {
        ...order,
        items: order.items,
        serial: "BILL-" + Date.now(),
        table_id: tableId, // ✅ Use tableId
        createdAt: new Date(),
        status: "pending",
        orderType: "dine-in",
      };
      await window.electronAPI.checkout(newOrder);
    } else {
      // Update existing order
      order.is_checkout = false;
      await window.electronAPI.checkout(order);
    }

    toast.success("Save Order successful");
    router.push("/sales/tables/");
  }, [order, settings.taxRate, tableId, router]);

  const handleCheckout = useCallback(async () => {
    if (order.items.length === 0) return;

    const newOrder: OrderEntity = {
      ...order,
      is_checkout: true,
      createdAt: new Date(),
    };

    await window.electronAPI.checkout(newOrder);

    const result: any = await window.electronAPI.printToPDF(
      generateReceipt(newOrder.serial)
    );
    if (result.success) {
      alert(`PDF saved to: ${result.filePath}`);
    } else {
      alert(`PDF print failed: ${result.error}`);
    }

    router.push("/sales/tables");
  }, [order, router]);

  // --- PAYMENT HELPERS ---
  const handleAmountChange = (amount: string) => {
    const received = parseFloat(amount) || 0;
      const total = (order.items.filter(item => item.is_checkout).reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    ) + order.items.filter(item => item.is_checkout).reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    ) * (settings.taxRate / 100))
    const change = received - total;
    setOrder((prev) => ({
      ...prev,
      cash_recieve: received,
      change,
    }));
  };

  const handlePaymentMethodChange = (method: string) => {
    setOrder((prev) => ({ ...prev, payment_method: method }));
  };

  const addQuickAmount = (amount: number) => {
    const current = order.cash_recieve || 0;
    handleAmountChange((current + amount).toFixed(2));
  };

  const setExactAmount = () => {
  const total = (order.items.filter(item => item.is_checkout).reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    ) + order.items.filter(item => item.is_checkout).reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    ) * (settings.taxRate / 100))
    handleAmountChange(total.toFixed(2));
  };

  const checkoutSubtotal = order.items
    .filter((item) => item.is_checkout)
    .reduce((acc, item) => acc + item.price * item.quantity, 0);
  const checkoutTotal =
    checkoutSubtotal + checkoutSubtotal * (settings.taxRate / 100);

  // --- CONDITIONAL VIEW ---
  if (viewMode === "orders") {
    return (
      <div className="h-full bg-gradient-to-br from-background to-muted/20">
        <Kitchen orders={[]} />
        <OrderManagement
          key="order-management"
          orders={[]}
          onUpdateOrderStatus={() => toast.success("Order updated")}
        />
      </div>
    );
  }

  return (
    <div>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "10rem",
            "--sidebar-width-mobile": "20rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <div className="w-full">
          <div className="h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <SellHeader cartItems={order.items} setViewMode={setViewMode} />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden h-full">
              {/* Menu Grid */}
              <div className="flex-1 overflow-auto ">
                {menuItems.length > 0 ? (
                  <MenuGrid
                    items={menuItems}
                    currency={currency}
                    onAddToCart={handleAddToCart}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <Card className="p-8 text-center border-dashed border-border">
                      <p className="text-muted-foreground">
                        No items available in this category
                      </p>
                    </Card>
                  </div>
                )}
              </div>

              {/* Cart (Desktop Sidebar) */}
              <div className="w-80 border-l border-border bg-card/30 backdrop-blur-sm flex-shrink-0 hidden lg:block">
                {order.items.length > 0 && (
                  <Cart
                    updateIsCheckout={updateIsCartCheckOut}
                    order={order}
                    currency={currency}
                    settings={settings}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromCart}
                    openConfirmPaymentDialog={() => setIsPaymentDialogOpen(true)}
                    onOrder={handleOrder}
                    className="h-full"
                  />
                )}
              </div>
            </div>

            {/* Mobile Cart Footer */}
            {cartCount > 0 && (
              <div className="lg:hidden border-t border-border bg-card p-4 flex gap-2">
                <Button
                  variant="secondary"
                  className="w-2/4 h-12 bg-black text-white hover:text-black text-lg gap-2"
                  onClick={handleOrder}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Order
                </Button>

                <Button
                  variant="secondary"
                  className="w-2/4 h-12 bg-red-500 text-white text-lg gap-2"
                  onClick={() => setIsPaymentDialogOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Checkout
                </Button>
              </div>
            )}
          </div>

          {/* Payment Dialog */}
          <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Payment Processing</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Total Amount */}
                <div className="bg-muted p-4 rounded-lg text-center">
                  <Label className="text-sm text-muted-foreground">Total Amount</Label>
                  <div className="text-2xl font-bold text-green-600">
                    {currency.symbol}
                    {order.items.filter(item => item.is_checkout).reduce(
                      (total, item) => total + item.menuItem.price * item.quantity,
                      0
                    ) + order.items.filter(item => item.is_checkout).reduce(
                      (total, item) => total + item.menuItem.price * item.quantity,
                      0
                    ) * (settings.taxRate / 100)}
                  </div>
                </div>

                {/* Amount Received */}
                <div className="space-y-2 my-2">
                  <Label htmlFor="receivedAmount">Amount Received</Label>
                  <Input
                    id="receivedAmount"
                    type="number"
                    value={order.cash_recieve}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="text-right text-lg font-semibold my-2"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-2 my-2">
                  <Button type="button" variant="outline" onClick={() => addQuickAmount(10)}>
                    +{currency.symbol}10
                  </Button>
                  <Button type="button" variant="outline" onClick={() => addQuickAmount(20)}>
                    +{currency.symbol}20
                  </Button>
                  <Button type="button" variant="outline" onClick={() => addQuickAmount(50)}>
                    +{currency.symbol}50
                  </Button>
                  <Button type="button" variant="outline" onClick={() => addQuickAmount(100)}>
                    +{currency.symbol}100
                  </Button>
                  <Button type="button" variant="outline" onClick={setExactAmount}>
                    Exact
                  </Button>
                  <Button type="button" variant="outline" onClick={() => handleAmountChange("")}>
                    Clear
                  </Button>
                </div>

                {/* Change Display */}
                {order.cash_recieve > 0 && (
                  <div
                    className={`p-3 rounded-lg text-center ${order.change >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    <Label className="text-sm">
                      {order.change >= 0 ? "Change Due" : "Amount Due"}
                    </Label>
                    <div className="text-xl font-bold">
                      {currency.symbol}
                      {Math.abs(order.change).toFixed(2)}
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                <div className="space-y-2 my-2">
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-2 gap-2 my-2">
                    <Button
                      type="button"
                      variant={order.payment_method === "cash" ? "default" : "outline"}
                      onClick={() => handlePaymentMethodChange("cash")}
                    >
                      💵 Cash
                    </Button>
                    <Button
                      type="button"
                      variant={order.payment_method === "card" ? "default" : "outline"}
                      onClick={() => handlePaymentMethodChange("card")}
                    >
                      💳 Card
                    </Button>
                    <Button
                      type="button"
                      variant={order.payment_method === "transfer" ? "default" : "outline"}
                      onClick={() => handlePaymentMethodChange("transfer")}
                    >
                      📱 Transfer
                    </Button>
                    <Button
                      type="button"
                      variant={order.payment_method === "other" ? "default" : "outline"}
                      onClick={() => handlePaymentMethodChange("other")}
                    >
                      Other
                    </Button>
                  </div>
                </div>
              </div>

              {/* Dialog Actions */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsPaymentDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleCheckout}
                  disabled={!(order.cash_recieve && order.cash_recieve >= checkoutTotal)}
                >
                  Confirm Payment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarProvider>
    </div>
  );
}