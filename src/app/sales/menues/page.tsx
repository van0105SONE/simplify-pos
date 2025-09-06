"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { MenuGrid } from "@/components/MenuGrid";
import { OrderManagement } from "@/components/OrderManagement";
import { CurrencyEntity, MenuItem, OrderEntity, Settings } from "@/types/pos";
import { Cart } from "@/components/Cart";
import { Suspense, use, useCallback, useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Kitchen } from "@/components/Kitchen";
import { useRouter, useSearchParams } from "next/navigation";
import { SellHeader } from "@/components/SellHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import SalesMenues from "@/components/SaleMenues";

// Extend the Window interface to include electronAPI
declare global {
  interface Window {
    electronAPI: any;
  }
}

export type ViewMode = "pos" | "orders";

export default function ProductsPage() {

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

        <Suspense fallback={<div>Loading...</div>}>
          <SalesMenues />
        </Suspense>
      </SidebarProvider>
    </div>
  );
}