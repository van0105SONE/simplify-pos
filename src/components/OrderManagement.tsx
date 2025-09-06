import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrderEntity } from '@/types/pos';
import { Clock, Check, ChefHat, Utensils } from 'lucide-react';

interface OrderManagementProps {
  orders: OrderEntity[];
  onUpdateOrderStatus: (orderId?: string, status?: OrderEntity['status']) => void;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const getStatusIcon = (status: OrderEntity['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'preparing':
        return <ChefHat className="h-4 w-4" />;
      case 'ready':
        return <Utensils className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: OrderEntity['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'preparing':
        return 'default';
      case 'ready':
        return 'success';
      case 'completed':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getNextStatus = (currentStatus: OrderEntity['status']): OrderEntity['status']  => {
    switch (currentStatus) {
      case 'pending':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'completed';
      default:
        return "cancelled";
    }
  };

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.status]) acc[order.status] = [];
    acc[order.status].push(order);
    return acc;
  }, {} as Record<OrderEntity['status'], OrderEntity[]>);

  const statusColumns: { status: OrderEntity['status']; title: string }[] = [
    { status: 'pending', title: 'New Orders' },
    { status: 'preparing', title: 'Preparing' },
    { status: 'ready', title: 'Ready' },
    { status: 'completed', title: 'Completed' },
  ];

  return (
    <div className="p-6 h-full overflow-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Order Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusColumns.map(({ status, title }) => (
          <div key={status} className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {getStatusIcon(status)}
              {title} ({groupedOrders[status]?.length || 0})
            </h2>
            
            <div className="space-y-3">
              {groupedOrders[status]?.map((order) => (
                <Card key={order.id} className="p-4 border-border shadow-soft hover:shadow-elegant transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">#{order.id}</span>
                        <Badge variant={getStatusVariant(status) as any} className="text-xs">
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.createdAt.toLocaleTimeString()}
                      </p>
                      {order.tableNumber && (
                        <p className="text-sm text-accent">Table: {order.tableNumber}</p>
                      )}
                    </div>
                    <span className="font-bold text-primary">${order.total.toFixed(2)}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-foreground">
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        <span className="text-muted-foreground">
                          ${(item.menuItem.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {getNextStatus(status) && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => onUpdateOrderStatus(order.id, getNextStatus(status))}
                    >
                      Mark as {getNextStatus(status)?.charAt(0).toUpperCase() + getNextStatus(status)?.slice(1) || ""}
                    </Button>
                  )}
                </Card>
              )) || (
                <Card className="p-8 text-center border-dashed border-border">
                  <p className="text-muted-foreground">No {title.toLowerCase()}</p>
                </Card>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};