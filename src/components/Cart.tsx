import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CartItem, CurrencyEntity, OrderEntity, Settings as SettingEntity } from '@/types/pos';
import { Minus, Plus, Trash2, ShoppingCart, Settings, } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"

interface CartProps {
  order: OrderEntity;
  currency: CurrencyEntity,
  settings: SettingEntity,
  updateIsCheckout: (index: number, value: boolean) => void,
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  openConfirmPaymentDialog: () => void;
  onOrder: () => void;
  className?: string;
}

export const Cart: React.FC<CartProps> = ({
  order,
  currency,
  settings,
  updateIsCheckout,
  onUpdateQuantity,
  onRemoveItem,
  openConfirmPaymentDialog,
  onOrder,
  className,
}) => {



  return (
    <div className={className}>
      <Card className="h-full flex flex-col shadow-elegant border-border w-full max-w-full">
        <div className="p-4">
          <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-lg">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Current Order ({order.items.length} items)
              </h2>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {order.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No items in cart</p>
              <p className="text-sm text-muted-foreground">
                Add items from the menu
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <Card
                  key={index}
                  className="p-3 border-border bg-card/50 w-full max-w-full overflow-hidden"
                >
                  <div className="flex items-start gap-3 min-w-0 w-full">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {item.menuItem.image ? (
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-14 h-14 object-cover rounded-lg bg-muted"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                      ) : null}
                      {/* Fallback placeholder */}
                      <div
                        className={`w-14 h-14 bg-gradient-to-br from-muted to-muted/70 rounded-lg flex items-center justify-center ${item.menuItem.image ? "hidden" : ""
                          }`}
                      >
                        <span className="text-xl">🍽️</span>
                      </div>

                      <Checkbox checked={item.is_checkout} onCheckedChange={(value) =>
                        updateIsCheckout(index, !!value)} />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground line-clamp-1">
                            {item.menuItem.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {currency.symbol} {item && item.menuItem.price
                              ? item.menuItem.price.toFixed(2)
                              : "0"} each
                          </p>
                          {item.notes && (
                            <p className="text-xs text-accent mt-1">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(index)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-3 gap-2">
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              onUpdateQuantity(index, item.quantity - 1)
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              onUpdateQuantity(
                                index,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-14 h-8 text-center text-sm"
                            min="1"
                          />

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              onUpdateQuantity(index, item.quantity + 1)
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <span className="font-semibold text-primary text-sm shrink-0 max-w-20 truncate">
                          {(item.menuItem.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {order.items.length > 0 && (
          <div className="p-4 border-t border-border bg-gradient-to-r from-muted/30 to-muted/20">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="text-foreground">{currency.symbol}{order.items.filter(item => item.is_checkout).reduce(
                      (total, item) => total + item.menuItem.price * item.quantity,
                      0
                    ).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({settings.taxRate}%):</span>
                <span className="text-foreground">{currency.symbol}{order.items.filter(item => item.is_checkout).reduce(
                      (total, item) => total + item.menuItem.price * item.quantity,
                      0
                    ) * (settings.taxRate / 100)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                <span className="text-foreground">Total:</span>
                <span className="text-primary">{currency.symbol}{order.items.filter(item => item.is_checkout).reduce(
                      (total, item) => total + item.menuItem.price * item.quantity,
                      0
                    ) + order.items.filter(item => item.is_checkout).reduce(
                      (total, item) => total + item.menuItem.price * item.quantity,
                      0
                    ) * (settings.taxRate / 100)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant={"secondary"}
                className="w-full h-12 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onOrder}
              >
                Order
              </Button>
              <Button
                variant={"secondary"}
                className="w-full h-12 text-lg font-semibold bg-red-500 text-white hover:bg-red-600"
                onClick={openConfirmPaymentDialog}
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
