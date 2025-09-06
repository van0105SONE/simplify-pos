// components/ProductTable.tsx

import { use, useEffect, useState } from "react";
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
import { Filter, MoreHorizontal, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { TableEntity } from "@/types/pos";
import { Switch } from "./ui/switch";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";


export function TableManagementPage() {
    const [actionType, setActionType] = useState<'create' | 'edit'>()
    const [openTableDialog, setOpenTableDialog] = useState(false);
    const { user, isLoading, fetchUser } = useAuthStore();
    const router = useRouter();
    const [newTable, setNewTable] = useState<TableEntity>({
        id: 0,
        name: '',
        seat: 0,
        status: false,
        users: {
            id: '',
            username: "",
            name: "",
            password: "",
            phone: '',
            role: 'staff',
            address: "",
            createdAt: new Date(),
            token: ''
        }
    });
    const [tables, setTables] = useState<TableEntity[]>([]);

    const fetchTables = async () => {
        try {
            const tablesData = await window.electronAPI.getTables()
            setTables(tablesData);


        } catch (err) {
            console.log(err)
        }
    }


    const handleCreateTable = async () => {
        try {
            if (actionType == 'create') {
                window.electronAPI.createTable(newTable)
            } else {
                window.electronAPI.editTable(newTable);
            }

            setNewTable({
                id: 0, name: '', seat: 0, status: false, users: {
                    id: '',
                    username: "",
                    name: "",
                    password: "",
                    phone: '',
                    role: 'staff',
                    address: "",
                    createdAt: new Date(),
                    token: ''
                }
            }); // Reset form
            setOpenTableDialog(false); // Close dialog after creation
            fetchTables()
        } catch (error) {
            console.error('Error creating category:', error);
        }
    }


    const deleteTable = async (id: number) => {
        window.electronAPI.deleteTable(id)
        fetchTables();
    }

    const getEditTable = async (id: number, action: 'create' | 'edit') => {

        setActionType(action)
        setOpenTableDialog(true)
        if ('edit' == action) {
            const tableData = await window.electronAPI.getTableById(id);
            setNewTable(tableData)
        }

    }

    useEffect(() => {
        fetchTables();
        fetchUser().then(() => {
            if (!useAuthStore.getState().user) {
                router.push('/');
            }

            if (!user) {
                return;
            }

            setNewTable(prev => ({
                ...prev,
                users: user
            }))
        });
    }, []);

    return (
        <div className="space-y-6">
            <div className="px-4 py-6 rounded-lg border bg-background shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">Table Management</h2>
                        <p className="text-sm text-muted-foreground">
                            -
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input
                            placeholder="Filter users..."
                            className="max-w-sm h-9"

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
                                    All Table
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Zone A
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Zone B
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Create User Button with Dialog */}
                        <Dialog open={openTableDialog} onOpenChange={(e) => {
                            setActionType('create')
                            setOpenTableDialog(e)
                        }}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-9">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Table
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Table</DialogTitle>
                                    <DialogDescription>
                                        Fill in the Table's details
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className=" items-center gap-4">
                                        <Label
                                            htmlFor="name"
                                            className="text-right flex whitespace-nowrap"
                                        >
                                            Table Name <span className="text-xl text-red-800">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            value={newTable.name}
                                            onChange={(e) =>
                                                setNewTable({ ...newTable, name: e.target.value })
                                            }
                                            className="col-span-3 my-4"
                                        />
                                    </div>

                                    <div className=" items-center gap-4">
                                        <Label
                                            htmlFor="seat"
                                            className="text-right flex whitespace-nowrap"
                                        >
                                            Seat <span className="text-xl text-red-800">*</span>
                                        </Label>
                                        <Input
                                            id="seat"
                                            type="number"
                                            value={newTable.seat}
                                            onChange={(e) =>
                                                setNewTable({ ...newTable, seat: Number(e.target.value) })
                                            }
                                            className="col-span-3 my-4"
                                        />
                                    </div>
                                    {
                                        actionType == 'edit' && <div className="flex items-center gap-4">
                                            <Label
                                                htmlFor="seat"
                                                className="text-right flex whitespace-nowrap"
                                            >
                                                Is Available? <span className="text-xl text-red-800">*</span>
                                            </Label>
                                            <Switch checked={newTable.status} onCheckedChange={(e) => {
                                                setNewTable({ ...newTable, status: e })
                                            }}></Switch>
                                        </div>
                                    }


                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleCreateTable}>
                                        {actionType == "create" ? "Create Table" : "Edit Table"}
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
                                <TableHead className="w-[80px] mx-auto">Name</TableHead>
                                <TableHead className="w-[80px] mx-auto">Seat</TableHead>
                                <TableHead className="w-[80px] mx-auto">status</TableHead>
                                <TableHead className="w-[80px] mx-auto">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {tables.map((table, index) => (
                                <TableRow key={table.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium py-3 mx-auto">{index + 1}</TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex items-center">
                                            {table.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex items-center">
                                            {table.seat}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex items-center">
                                            {!table.status && <span className="bg-red-800 rounded-xl text-white font-bold p-2">Occupied</span>}
                                            {table.status && <span className="bg-green-800 rounded-xl text-white font-bold p-2">Available</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="mx-auto py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={(e) => {
                                                    console.log(e)
                                                    getEditTable(table.id, 'edit')
                                                }}>Edit</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600" onClick={() => deleteTable(table.id)}>
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
                        Showing <strong>1-{tables.length}</strong> of <strong>{tables.length}</strong> users
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