"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ChevronDown, Filter, MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { UserEntity } from "@/types/pos";




export default function UserTable() {
    const [openDialog, setOpenDialog] = useState(false);
    const [users, setUsers] = useState<UserEntity[]>([]);

    const [newUser, setNewUser] = useState<UserEntity>({
        id: "",
        name: "",
        username: "",
        role: "" as 'admin' | 'staff',
        phone: "",
        password: "",
        address: "",
        createdAt: new Date(),
        token: ''
    });

    const initData = async () => {
        const userData = await window.electronAPI.getAllUsers();
        setUsers(userData)
    }

    useEffect(() => {
        // Fetch initial users from the API
        initData()

    }, []);

    const handleCreateUser = async () => {
        const createdUser = {
            ...newUser
        };

        await window.electronAPI.createUser(createdUser)
        setNewUser({
            id: "",
            name: "",
            username: "",
            role: "staff",
            phone: "",
            password: "",
            address: "",
            createdAt: new Date(),
            token: ""
        });
        initData();
        setOpenDialog(false)
    };

    return (
        <div className="space-y-6">
            <div className="px-4 py-6 rounded-lg border bg-background shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">User Management</h2>
                        <p className="text-sm text-muted-foreground">
                            Manage all registered users and their permissions
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input
                            placeholder="Filter users..."
                            className="max-w-sm h-9"
                        // Add your filtering logic here
                        // onChange={(event) => table.getColumn("username")?.setFilterValue(event.target.value)}
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filter
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked>
                                    All users
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Administrators
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Regular users
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Create User Button with Dialog */}
                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-9">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create User
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create New User</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details to create a new user account.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={newUser.name}
                                            onChange={(e) =>
                                                setNewUser({ ...newUser, name: e.target.value })
                                            }
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="username" className="text-right">
                                            Username
                                        </Label>
                                        <Input
                                            id="username"
                                            value={newUser.username}
                                            onChange={(e) =>
                                                setNewUser({ ...newUser, username: e.target.value })
                                            }
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="password" className="text-right">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={newUser.password}
                                            onChange={(e) =>
                                                setNewUser({ ...newUser, password: e.target.value })
                                            }
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="role" className="text-right">
                                            Role
                                        </Label>
                                        <Select
                                            value={newUser.role}
                                            onValueChange={(value) =>
                                                setNewUser({ ...newUser, role: value as 'admin' | 'staff' })
                                            }
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Administrator</SelectItem>
                                                <SelectItem value="staff">staff</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="phone" className="text-right">
                                            Phone
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={newUser.phone}
                                            onChange={(e) =>
                                                setNewUser({ ...newUser, phone: e.target.value })
                                            }
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleCreateUser}>
                                        Create User
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>
                                    <div className="flex items-center">
                                        Role
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </div>
                                </TableHead>
                                <TableHead className="text-right w-[160px]">Phone</TableHead>
                                <TableHead className="text-right w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow key={user.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium py-3">{index + 1}</TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex items-center">
                                            {user.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">@{user.username}</TableCell>
                                    <TableCell className="py-3">
                                        <Badge
                                            variant={user.role === "admin" ? "default" : "outline"}
                                            className={
                                                user.role === "admin" ? "bg-primary/10 text-primary" : ""
                                            }
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right py-3">
                                        {user.phone || "N/A"}
                                    </TableCell>
                                    <TableCell className="text-right py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>View profile</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between px-2 mt-4">
                    <div className="text-sm text-muted-foreground">
                        Showing <strong>1-{users.length}</strong> of <strong>{users.length}</strong> users
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" disabled>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm">
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
