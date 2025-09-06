"use client";

// Extend the Window interface to include 'api'
declare global {
    interface Window {
        electronAPI: any;
    }
}

import { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableCaption,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ChevronDown, Filter, MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Category, CurrencyEntity, ProductEntity, UnitType } from "@/types/pos";
import { formatter } from "@/utils/helper";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";


export function MenuTables() {
    const [actionType, setActionType] = useState<'create' | 'edit'>()
    const [openDialog, setOpenDialog] = useState(false);
    const [products, setProducts] = useState<ProductEntity[]>([
    ]);


    const [categories, setCategories] = useState<Category[]>([{
        id: "1",
        name: "select all",
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
    }])
    const [unitTypes, setUnitTypes] = useState<UnitType[]>([])
    const [currency, setCurrency] = useState<CurrencyEntity>({
        id: 1,
        code: 'USD',
        symbol: 'THB',
        currency_name: 'dollar',
        is_main: true
    })
    const { user, isLoading, fetchUser } = useAuthStore();
    const router = useRouter();

    const [newProducts, setNewProduct] = useState<ProductEntity>({
        name: '',
        price: 0,
        category_id: '',
        image: '',
        stock: 0,
        description: '',
        unitType: '',
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


    const fetchProducts = async () => {
        const currencyData = await window.electronAPI.getDefaultCurrency()
        setCurrency(currencyData)
        const categories = await window.electronAPI.getCategories();
        setCategories(categories)
        const unitTypes = await window.electronAPI.getUnitTypes();
        setUnitTypes(unitTypes)
        const productData = await window.electronAPI.getProducts();
        setProducts(productData)
    }

    const deleteProduct = async (id?: string) => {
        if (id) {
            await window.electronAPI.deleteProduct(id)
            fetchProducts()
        }
    }

    const getEditProduct = async (id: string, action: 'create' | 'edit') => {
        setActionType(action);
        setOpenDialog(true);
        if (id) {
            const productData = await window.electronAPI.getProductByid(id)
            setNewProduct(productData)
        }

    }

    const handleCreateProduct = async () => {
        try {
            if (actionType == 'create') {
                await window.electronAPI.createProduct(newProducts)
                fetchProducts();
            } else {
                await window.electronAPI.editProduct(newProducts)
                fetchProducts();
            }
            setOpenDialog(false);
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    useEffect(() => {
        fetchProducts()
        fetchUser().then(() => {
            if (!useAuthStore.getState().user) {
                router.push('/');
            }

            if (!user) {
                return;
            }

            setNewProduct(prev => ({
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
                                    All Category
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Food
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Salads
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
                                    Create Products
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
                                            Product Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={newProducts.name}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProducts, name: e.target.value })
                                            }
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="role" className="text-right">
                                            Category
                                        </Label>
                                        <Select
                                            key="category"
                                            value={newProducts.category_id?.toString() || ""}
                                            onValueChange={(value) =>
                                                setNewProduct({ ...newProducts, category_id: value })
                                            }
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    categories.map((item) => (
                                                        <SelectItem
                                                            key={item.id}
                                                            value={item.id ? item.id : 'none'} // ✅ ensure it's a string
                                                        >
                                                            {item.name}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>

                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="role" className="text-right">
                                            Unit Type
                                        </Label>
                                        <Select
                                            value={newProducts.unitType}
                                            onValueChange={(value) =>
                                                setNewProduct({ ...newProducts, unitType: value })
                                            }
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>

                                                {
                                                    unitTypes.length > 0 ?
                                                        unitTypes.map((item) => (<SelectItem key={item.id} value={item.name ? item.name : 'none'}>{item.name}</SelectItem>)) : null
                                                }

                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="price" className="text-right">
                                            Price
                                        </Label>
                                        <Input
                                            id="price"
                                            value={newProducts.price}
                                            type="number"
                                            onChange={(e) =>
                                                setNewProduct({ ...newProducts, price: Number(e.target.value) })
                                            }
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="stock" className="text-right">
                                            Stock
                                        </Label>
                                        <Input
                                            id="stock"
                                            value={newProducts.stock}
                                            type="number"
                                            onChange={(e) =>
                                                setNewProduct({ ...newProducts, stock: Number(e.target.value) })
                                            }
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleCreateProduct} className="w-full">
                                        {
                                            actionType == 'create' ? "Create Product" : 'Edit Product'
                                        }

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
                                <TableHead>
                                    Category
                                </TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product, index) => (
                                <TableRow key={product.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium py-3">{index + 1}</TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex items-center">
                                            {product.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex items-center">
                                            {product.category?.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex items-center">
                                            {currency.symbol}{formatter.format(product.price)}
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-3">
                                        <div className="flex items-center">
                                            {formatter.format(product.stock)} / {product.unitType}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-center py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => {
                                                    if (product && product.id) {
                                                        getEditProduct(product.id, 'edit')
                                                    }

                                                }}>Edit</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600" onClick={() => deleteProduct(product.id)}>
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
                        Showing <strong>1-{products.length}</strong> of <strong>{products.length}</strong> users
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
    )
}