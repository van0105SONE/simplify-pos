import { ClipboardList, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CartItem } from "@/types/pos";
import { ViewMode } from "@/app/sales/menues/[id]/page";
import { SidebarTrigger } from "./ui/sidebar";

export interface SellHeaderProps {
  cartItems: CartItem[];
  setViewMode: (mode: ViewMode) => void;
}
export const SellHeader: React.FC<SellHeaderProps> = ({
  cartItems,
  setViewMode,
}) => {
  return (
    <div className="h-16 bg-card border-b border-border shadow-soft flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setViewMode("orders")}
          className="gap-2"
        >
          <ClipboardList className="h-4 w-4" />
          <span className="hidden sm:inline">Kitchen Orders</span>
          <Badge variant="default" className="ml-1 px-2 py-0 text-xs">
            {cartItems.length}
          </Badge>
        </Button>

        <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-3 py-2">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <span className="font-semibold text-primary">{cartItems.length}</span>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            items
          </span>
        </div>
      </div>
    </div>
  );
};
