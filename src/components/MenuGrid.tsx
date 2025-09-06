import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CartItem,  CurrencyEntity, MenuItem } from "@/types/pos";
import { Currency, Plus } from "lucide-react";

interface MenuGridProps {
  items: MenuItem[];
  currency: CurrencyEntity,
  onAddToCart: (item: MenuItem) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({ items,currency,  onAddToCart }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {items.map((item) => (
        <Card
          key={item.id}
          className="relative overflow-hidden hover:shadow-elegant transition-all duration-200 border-border bg-gradient-to-b from-card to-card/95"
        >
          <div className="aspect-square bg-gradient-to-br from-muted to-muted/70 flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>

          <div className="p-3 space-y-2">
            <div>
              <h3 className="font-semibold text-sm line-clamp-2 text-foreground">
                {item.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-primary text-lg">
                {currency.symbol} {item.price.toFixed(2)}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToCart(item)}
                disabled={!item.available}
                className="h-8 w-8 p-0 rounded-full cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!item.available && (
            <div className="absolute inset-0 bg-muted/80 flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">
                Unavailable
              </span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
