"use client";

import { AppSidebar } from "@/components/app-sidebar";
// app/inventory/page.tsx

import { Header } from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ChefManagementPage() {
    return (
        <div>
            <SidebarProvider
                style={{
                     // @ts-ignore
                    "--sidebar-width": "10rem",
                    "--sidebar-width-mobile": "20rem",
                }}
            >
                <AppSidebar />
                <div className="w-full">
                    <div className="h-screen bg-gray-100 flex flex-col">
                        <Header></Header>
                        {/* Main Content */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Menu Grid */}
                            <div className="flex-1 overflow-auto">
                                chef management
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        </div>
    );
}
