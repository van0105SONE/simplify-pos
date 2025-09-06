import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  ChevronDown,
  ChevronLeft,
  CookingPot,
  DollarSign,
  Inbox,
  Paperclip,
  Settings,
  Users,
} from "lucide-react";

const items = [
  {
    title: "Tables",
    url: "/sales/tables",
    icon: DollarSign,
  },
  {
    title: "Chef",
    url: "/management/chef",
    icon: CookingPot,
  },
  {
    title: "Management",
    url: "/management",
    icon: Inbox,
    children: [
      { title: "Tables", url: "/management/tables" },
      { title: "Products", url: "/management/inventory/products" },
      { title: "Suppliers", url: "/management/inventory/suppliers" },
      { title: "Categories", url: "/management/inventory/category" },
      { title: "Unit Type", url: "/management/inventory/unit-type" },
    ],
  },
  {
    title: "Reports",
    url: null,
    icon: Paperclip,
    children: [
      { title: "Sale", url: "/management/reports/sale" },
    ]
  },
  {
    title: "Users",
    url: "/management/users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [openManagementItems, setOpenManagementItems] = useState<
    Record<string, boolean>
  >({});
  const pathname = usePathname();

  // Open submenu if current path matches
  useEffect(() => {
    items.forEach((item) => {
      if (item.children?.some((sub) => pathname.startsWith(sub.url))) {
        setOpenManagementItems((prev) => ({
          ...prev,
          [item.title]: true,
        }));
      }
    });
  }, [pathname]);

  const isActive = (item: any) => {
    if (pathname === item.url) return true;
    if (item.children?.some((sub: any) => pathname === sub.url)) return true;
    return false;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={40}
          priority
          className="mx-auto"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="w-full">
            <SidebarMenu className="w-full border-left">
              {items.map((item) => (
                <Collapsible
                  key={item.title}
                  open={!!openManagementItems[item.title]}
                  onOpenChange={() =>
                    setOpenManagementItems((prev) => ({
                      ...prev,
                      [item.title]: !prev[item.title],
                    }))
                  }
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <Link href={item.url && !item.children ? item.url : "#"} className="w-full">
                        <SidebarMenuButton
                          className={`w-full py-2 cursor-pointer 
                          ${isActive(item)
                              ? "bg-red-500 text-white"
                              : "hover:bg-red-500 hover:text-white"}`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex">
                              <item.icon className="h-4 my-auto" />
                              <span className="my-auto">{item.title}</span>
                            </div>
                            {item.children && (
                              <div>
                                {openManagementItems[item.title] ? (
                                  <ChevronDown className="ml-2 h-4 w-4" />
                                ) : (
                                  <ChevronLeft className="ml-2 h-4 w-4" />
                                )}
                              </div>
                            )}
                          </div>
                        </SidebarMenuButton>
                      </Link>
                    </CollapsibleTrigger>
                    {item.children && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((sub: any) => (
                            <SidebarMenuSubItem key={sub.title}>
                              <Link
                                href={sub.url}
                                className={`block px-4 py-2 text-sm rounded ${pathname === sub.url
                                  ? "bg-red-100 text-red-600"
                                  : "hover:bg-muted"
                                  }`}
                              >
                                {sub.title}
                              </Link>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
