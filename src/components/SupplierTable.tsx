// components/ProductTable.tsx

import { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Filter, MoreHorizontal, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CurrencyEntity, SupplierEntity } from "@/types/pos";
import { formatter } from "@/utils/helper";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";


export function SuppliersTable() {
    const [actionType, setActionType] = useState<'create' | 'edit'>()
    const [openDialog, setOpenDialog] = useState(false);

    const { user, isLoading, fetchUser } = useAuthStore();
    const router = useRouter();


    const [newSupplier, setNewSupplier] = useState<SupplierEntity>({
        id: '',
        name: '',
        import_price: 0,
        stock: 0,
        status: 'out',
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
    const [currency, setCurrency] = useState<CurrencyEntity>({
        id: 1,
        code: 'USD',
        symbol: 'THB',
        currency_name: 'dollar',
        is_main: true
    })

    const [suppliers, setSuppliers] = useState<SupplierEntity[]>([]);
    const fetchSupplier = async () => {
        try {

            const supplyData = await window.electronAPI.getSupplys();
            setSuppliers(supplyData);

            const currencyData = await window.electronAPI.getDefaultCurrency()
            setCurrency(currencyData)
        } catch (err) {
            console.log(err)
        }
    }
    const handleCreateSupplier = async () => {
        try {
            if (actionType == 'create') {
                await window.electronAPI.createSupply(newSupplier)
            } else {
                await window.electronAPI.editSupply(newSupplier)
            }

            await fetchSupplier()
            setNewSupplier({
                id: '', name: '', import_price: 0, stock: 0, status: "out", users: {
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
            setOpenDialog(false); // Close dialog after creation
        } catch (error) {
            console.error('Error creating category:', error);
        }
    }

    const deleteSupply = async (id: string) => {
        await window.electronAPI.deleteSupply(id)
        await fetchSupplier();

    }

    const getSupplyForEdit = async (id: string, action: 'create' | 'edit') => {
        setActionType(action)
        setOpenDialog(true);
        if (id) {
            const supplyData = await window.electronAPI.getSupplyById(id);
            setNewSupplier(supplyData)
        }


        await fetchSupplier();

    }

    useEffect(() => {
        fetchSupplier();
        fetchUser().then(() => {
            if (!useAuthStore.getState().user) {
                router.push('/');
            }

            if (!user) {
                return;
            }

            setNewSupplier(prev => ({
                ...prev,
                users: user
            }))
        });
    }, [])
    return (
        <div className="space-y-6">
            <div className="px-4 py-6 rounded-lg border bg-background shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">Supplier Management</h2>
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
                        <Dialog open={openDialog} onOpenChange={(e) => {
                            setActionType('create')
                            setOpenDialog(e)
                        }}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-9">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Supply
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Supply</DialogTitle>
                                    <DialogDescription>
                                        Fill in the Supply's name.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className=" items-center gap-4">
                                        <Label
                                            htmlFor="name"
                                            className="text-right flex whitespace-nowrap"
                                        >
                                            Supply Name <span className="text-xl text-red-800">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            value={newSupplier.name}
                                            onChange={(e) =>
                                                setNewSupplier({ ...newSupplier, name: e.target.value })
                                            }
                                            className="col-span-3 my-4"
                                        />
                                    </div>

                                    <div className=" items-center gap-4">
                                        <Label
                                            htmlFor="price"
                                            className="text-right flex whitespace-nowrap"
                                        >
                                            Price <span className="text-xl text-red-800">*</span>
                                        </Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={newSupplier.import_price}
                                            onChange={(e) =>
                                                setNewSupplier({ ...newSupplier, import_price: Number(e.target.value) })
                                            }
                                            className="col-span-3 my-4"
                                        />
                                    </div>

                                    <div className=" items-center gap-4">
                                        <Label
                                            htmlFor="stock"
                                            className="text-right flex whitespace-nowrap"
                                        >
                                            Stock <span className="text-xl text-red-800">*</span>
                                        </Label>
                                        <Input
                                            id="stock"
                                            value={newSupplier.stock}
                                            type="number"
                                            onChange={(e) =>
                                                setNewSupplier({ ...newSupplier, stock: Number(e.target.value) })
                                            }
                                            className="col-span-3 my-4"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="role" className="text-right">
                                            status <span className="text-xl text-red-800">*</span>
                                        </Label>
                                        <Select
                                            value={newSupplier.status}
                                            onValueChange={(value) =>
                                                setNewSupplier({ ...newSupplier, status: value })
                                            }

                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent className="w-48">
                                                <SelectItem value="out">out</SelectItem>
                                                <SelectItem value="less">Less</SelectItem>
                                                <SelectItem value="balance">Balance</SelectItem>
                                                <SelectItem value="Full">Full</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleCreateSupplier}>
                                        Create Category
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
                                <TableHead className="w-[80px] mx-auto">Stock</TableHead>
                                <TableHead className="w-[80px] mx-auto">cost</TableHead>
                                <TableHead className="w-[80px] mx-auto">status</TableHead>
                                <TableHead className="w-[80px] mx-auto">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suppliers.map((supply, index) => (
                                <TableRow key={supply.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium py-3 mx-auto">{index + 1}</TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex items-center">
                                            {supply.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex items-center">
                                            {formatter.format(supply.stock)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex items-center">
                                            {currency.symbol}{formatter.format(supply.import_price)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex items-center">
                                            {supply.status === 'out' && <span className="bg-red-800 rounded-xl text-center text-white p-2 w-24">Out</span>}
                                            {supply.status === 'less' && <span className="bg-yellow-500 rounded-xl text-center text-white p-2 w-24">less</span>}
                                            {supply.status === 'balance' && <span className="bg-blue-500 rounded-xl text-center text-white p-2 w-24">balance</span>}
                                            {supply.status.toLocaleLowerCase() === 'full' && <span className="bg-green-500 rounded-xl text-center text-white p-2 w-24">full</span>}

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
                                                <DropdownMenuItem onClick={() => {
                                                    getSupplyForEdit(supply.id, 'edit')
                                                }}>Edit</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600" onClick={() => deleteSupply(supply.id)}>
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
                        Showing <strong>1-{suppliers.length}</strong> of <strong>{suppliers.length}</strong> users
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