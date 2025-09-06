import { ClipboardList, LogOut, MenuIcon, Settings, ShoppingCart, User } from "lucide-react"
import { SidebarTrigger } from "./ui/sidebar"
import { PersonStanding } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { UserEntity } from "@/types/pos"
import { useRouter } from "next/navigation"



export interface HeaderProps {
    user: UserEntity | null
}
export const Header: React.FC<HeaderProps> = ({ user }: HeaderProps) => {
    const router = useRouter()

    const handleLogout = async () => {
        await window.electronAPI.logout();
        router.push('/')
    }

    return (
        <div className="h-16 bg-card border-b border-border shadow-soft flex items-center justify-between px-6 flex-shrink-0">

            <div className="flex items-center gap-4">
                <SidebarTrigger />
            </div>

            <div className="flex items-center gap-3">
                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={"https://github.com/shadcn.png"} alt={'vanlakhan'} />
                                <AvatarFallback>{user ? user.username.charAt(0) : "..."}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user ? user.username : "..."}</p>
                
                                <p className="text-xs leading-none text-muted-foreground my-2">
                                    {user? user.role : "..."}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}