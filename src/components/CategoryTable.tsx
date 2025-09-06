// components/ProductTable.tsx

import { use, useEffect, useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, Filter, MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import prisma from "@/lib/prisma";
import { Category } from "@/types/pos";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";


export function CategoryTable() {
  const [openDialog, setOpenDialog] = useState(false);
  const { user, isLoading, fetchUser } = useAuthStore();
  const [newCategory, setNewCategory] = useState<Category>({
    id: "",
    name: "",
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
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter()
  const fetchCategories = async () => {
    try {
      const categories = await window.electronAPI.getCategories();
      setCategories(categories)
    } catch (err) {
      console.log(err);
    }
  };


  const handleCreateCategory = async () => {
    try {
      await window.electronAPI.createCategory(newCategory)

    } catch (error) {
      console.error("Error creating category:", error);
    }
    await fetchCategories()
    setNewCategory({
      id: "", name: "", users: {
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
  };

  const deleteCategory = async (id: string) => {
    await window.electronAPI.deleteCategory(id);
    await fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
    fetchUser().then(() => {

      if (!useAuthStore.getState().user) {
        router.push('/');
      }
      
      if(!user){
          return;
      }
      setNewCategory(prev => ({
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
            <h2 className="text-xl font-semibold tracking-tight">
              Category Management
            </h2>
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
                  Create Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                  <DialogDescription>
                    Fill in the category's name.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className=" items-center gap-4">
                    <Label
                      htmlFor="name"
                      className="text-right flex whitespace-nowrap"
                    >
                      Category Name{" "}
                      <span className="text-xl text-red-800">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      className="col-span-3 my-4"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateCategory}>
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
                <TableHead className="w-[80px] mx-auto">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((categoery, index) => (
                <TableRow key={categoery.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium py-3 mx-auto">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center">{categoery.name}</div>
                  </TableCell>
                  <TableCell className="mx-auto py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => deleteCategory(categoery.id)}
                        >
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
            Showing <strong>1-{categories.length}</strong> of{" "}
            <strong>{categories.length}</strong> users
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

//commit test
