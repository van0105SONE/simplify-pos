// app/management/reports/page.tsx

"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import Report from "@/components/Reports";
import Reports from "@/components/Reports";
import { useAuthStore } from "@/lib/authStore";

export default function ReportsPage() {
  const { user, isLoading, fetchUser } = useAuthStore();
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
        <div className="w-full h-screen">
          <div className="h-screen bg-gray-100 flex flex-col">
            <Header user={user}/>
            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-auto">
                <Reports /> {/* Render the Reports component */}
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
