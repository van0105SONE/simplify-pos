import { Home } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { OrderManagement } from "./OrderManagement";
import { useState } from "react";
import { OrderEntity } from "@/types/pos";
type ViewMode = 'pos' | 'orders';

export interface HeaderProps {
    orders: OrderEntity[]
}

export function Kitchen({ orders }: HeaderProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('pos');
    return (
        <div className="h-16 bg-card border-b border-border shadow-soft flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="secondary"
                    onClick={() => setViewMode('pos')}
                    className="gap-2"
                >
                    <Home className="h-4 w-4" />
                    Back to POS
                </Button>
                <h1 className="text-xl font-bold text-foreground">Kitchen Dashboard</h1>
            </div>

            <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                    {orders.filter((o: any) => o.status === 'pending').length} New Orders
                </Badge>
                <Badge variant="destructive" className="px-3 py-1">
                    {orders.filter((o: any) => o.status === 'preparing').length} Preparing
                </Badge>
                <Badge variant="default" className="px-3 py-1">
                    {orders.filter((o: any) => o.status === 'ready').length} Ready
                </Badge>
            </div>
        </div>
    )
}