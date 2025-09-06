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
import { Category } from "@prisma/client";
import { UnitType } from "@/types/pos";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";


export function UnitTable() {
  const [openDialog, setOpenDialog] = useState(false);
  const { user, isLoading, fetchUser } = useAuthStore();
  const router = useRouter();
  const [newUnitType, setNewUnitType] = useState<UnitType>({
    id: '',
    name: '',
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
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);

  const fetchUnitTypes = async () => {
    try {
      const unitTypes = await window.electronAPI.getUnitTypes();
      setUnitTypes(unitTypes)
    } catch (err) {
      console.log(err)
    }
  }
  const deleteUnitType = async (id: string) => {
    await window.electronAPI.deleteUnitType(id)
    fetchUnitTypes();
  }

  const handleCreateCategory = async () => {
    try {
      await window.electronAPI.createUnitType(newUnitType)
      setUnitTypes([...unitTypes, newUnitType]);
      setNewUnitType({
        id: '', name: '', users: {
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
      fetchUnitTypes();
      setOpenDialog(false); // Close dialog after creation
    } catch (error) {
      console.error('Error creating category:', error);
    }
  }


  useEffect(() => {
    fetchUnitTypes();
    fetchUser().then(() => {
      if (!useAuthStore.getState().user) {
        router.push('/');
      }
      
      if(!user){
          return;
      }

      setNewUnitType(prev => ({
        ...prev,
        users: user
      }))
    });
  }, []); // Fetch unit types on component mount
  return (
    <div className="space-y-6">
      <div className="px-4 py-6 rounded-lg border bg-background shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Unit Type Management</h2>
            <p className="text-sm text-muted-foreground">
              Manage all Unit Types here. You can create, edit, and delete Unit Types as needed.
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
                  All Unit
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
                  Create Unit Type
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
                      Unit Name <span className="text-xl text-red-800">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={newUnitType.name}
                      onChange={(e) =>
                        setNewUnitType({ ...newUnitType, name: e.target.value })
                      }
                      className="col-span-3 my-4"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateCategory}>
                    Create Unit
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
              {unitTypes.map((unitType, index) => (
                <TableRow key={unitType.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium py-3 mx-auto">{index + 1}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center">
                      {unitType.name}
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteUnitType(unitType.id)}>
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
            Showing <strong>1-{unitTypes.length}</strong> of <strong>{unitTypes.length}</strong> users
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