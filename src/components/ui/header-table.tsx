import React, { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Calendar,
  Clock,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableEntity } from "@/types/pos";

interface HeaderProps {
  tables: TableEntity[];
}

export function RestaurantHeader({ tables }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  const tablesCount = tables.length;
  const occupiedTables = tables.filter((table) => !table.status).length;
  const availableTables = tables.filter((table) => table.status).length;

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then((response) => {
      if (response.ok) {
        // Handle successful logout
      }
    });
  };

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateString = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="h-16 md:h-20 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-3 md:px-6 flex-shrink-0">
      {/* Left Section - Title & Navigation */}
      <div className="flex items-center gap-3 md:gap-6">
        <SidebarTrigger />

        <div className="flex flex-col">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">
            Restaurant POS
          </h1>
        </div>
      </div>

      {/* Center Section - Date & Time (Hidden on small screens) */}

      {/* Right Section - Tables Info & Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Tables Status - Responsive Layout */}
        <div className="flex items-center gap-1 md:gap-3 px-2 md:px-4 py-1 md:py-2 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-1 md:gap-2">
            <span className="hidden sm:block text-xs md:text-sm font-semibold text-gray-700">
              All Tables
            </span>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Badge
              variant="default"
              className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs px-1 md:px-2"
            >
              <span className="hidden sm:inline">{tablesCount} Tables</span>
              <span className="sm:hidden">{tablesCount}</span>
            </Badge>

            <div className="hidden sm:block w-px h-4 md:h-6 bg-gray-300"></div>

            <Badge
              variant="destructive"
              className="bg-red-100 text-red-800 hover:bg-red-100 text-xs px-1 md:px-2"
            >
              <span className="hidden md:inline">Occupied </span>
              <span className="md:hidden">Occ </span>
              {occupiedTables}
            </Badge>

            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-100 text-xs px-1 md:px-2"
            >
              <span className="hidden md:inline">Available </span>
              <span className="md:hidden">Avl </span>
              {availableTables}
            </Badge>
          </div>
        </div>

        {/* Notification & Profile Section */}
        <div className="flex items-center gap-1 md:gap-3">
          {/* Notification Button */}
          <Button
            variant="outline"
            size="icon"
            className="relative h-8 w-8 md:h-10 md:w-10"
          >
            <Bell className="h-3 w-3 md:h-4 md:w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 md:h-3 md:w-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold hidden md:block">
                3
              </span>
            </span>
          </Button>

          {/* Mobile Menu for Tables Info (Visible only on small screens) */}
          <div className="block lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Clock className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>Current Time & Date</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{dateString}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{timeString}</span>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-6 w-6 md:h-8 md:w-8 rounded-full p-0"
              >
                <Avatar className="h-6 w-6 md:h-8 md:w-8">
                  <AvatarImage
                    src={"https://github.com/shadcn.png"}
                    alt={"vanlakhan"}
                  />
                  <AvatarFallback className="text-xs md:text-sm">
                    {"vanlakhan".charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {"vanlakhan"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {"vanlakhan12@gmail.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
