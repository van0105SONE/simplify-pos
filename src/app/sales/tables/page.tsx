"use client";

import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableEntity } from "@/types/pos";
import { useEffect, useState } from "react";
import { TableGrid } from "@/components/TableGrid";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { RestaurantHeader } from "@/components/ui/header-table";

type ViewMode = "pos" | "orders";

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("pos");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tables, setProducts] = useState<TableEntity[]>([]);

  const fetchProducts = async () => {
    const tablesData = await window.electronAPI.getTables();
    setProducts(tablesData);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <SidebarProvider
        style={
          {
            // @ts-ignore
            "--sidebar-width": "10rem",
            "--sidebar-width-mobile": "20rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />

        <div className="w-full h-screen">
          <div className="h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <RestaurantHeader tables={tables} />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Menu Grid */}
              <div className="flex-1 overflow-auto">
                <TableGrid tables={tables} />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
