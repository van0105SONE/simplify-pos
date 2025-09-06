import React, { useState, useMemo, useEffect } from 'react';
import { Search, FileDown, Package, AlertTriangle, PackageSearch, PlusCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatter } from '@/utils/helper';
import { CurrencyEntity, OrderEntity } from '@/types/pos';


// --- MOCK DATA ---
// In a real application, this data would come from an API.


const mockCategories = ['Stationery', 'Furniture', 'Electronics'];
const LOW_STOCK_THRESHOLD = 10;


// --- MAIN COMPONENT ---
export default function InventoryReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState<OrderEntity[]>([])
  const [total, setTotal] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0);
  const [saleReport, setSaleReport] = useState({
    total_revenue: 0,
    total_bill: 0
  })

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    keyword: ''
  })
  const [currency, setCurrency] = useState<CurrencyEntity>({
    id: 0,
    code: 'USD',
    symbol: '$',
    currency_name: 'Dollar',
    is_main: false,
  });
  const loadOrderTransactions = async () => {
    const { page, limit, data, total, totalPage } = await window.electronAPI.getOrderTransaction(filter);
    setTotal(total)
    setTotalPage(totalPage)
    setOrders(data)
  }

  const initData = async () => {
    const currencyData = await window.electronAPI.getDefaultCurrency()
    setCurrency(currencyData);

    const reportData = await window.electronAPI.getSaleReport()
    if (reportData) {
      setSaleReport(reportData)
    }

    loadOrderTransactions();

  }


  useEffect(() => {
    initData();
  }, [])


  const handleExport = () => {
    alert("Exporting data to console. Check the developer tools.");
  };

  return (
    <div className=" bg-gray-50 sm:p-8 md:p-6 font-sans">
      <div className="m-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Sales Report</h1>
          <p className="text-gray-600 mt-1">Check the status and value of items in stock</p>
        </header>

        {/* Stock Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currency.symbol} {formatter.format(saleReport.total_revenue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Bill</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{saleReport.total_bill} Bills</div>
            </CardContent>
          </Card>

        </div>

        {/* Product List Table with Integrated Filters and Pagination */}
        <div className='pt-6'>
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle>Product List</CardTitle>
                  <CardDescription>All products in the system</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <Button onClick={handleExport} variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className=" min-w-[800px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
                <div className="flex gap-4">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className=" min-w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {mockCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className=" min-w-[180px]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead className='text-center'>Product ID</TableHead>
                    <TableHead className='text-center'>Customer Name</TableHead>
                    <TableHead className="text-center">tax</TableHead>
                    <TableHead className="text-right">Subtotal Price</TableHead>
                    <TableHead className="text-right">Total Price</TableHead>
                    <TableHead className="text-right">Cash Recieve</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <TableRow key={order.id}>
                        <td className="font-medium">{index + 1}</td> {/* Product No */}
                        <TableCell className="text-center font-medium">{order.serial}</TableCell>
                        <TableCell className="text-center font-semibold">{order.customerName ? order.customerName : 'unkown'}</TableCell>
                        <TableCell className="text-right">{currency.symbol}{formatter.format(order.tax)}</TableCell>
                        <TableCell className="text-right">{currency.symbol} {formatter.format(order.subtotal)}</TableCell>
                        <TableCell className="text-right">{currency.symbol} {formatter.format(order.total)} </TableCell>
                        <TableCell className="text-right">{currency.symbol} {formatter.format(order.cash_recieve)}</TableCell>
                        <TableCell className="text-right">{currency.symbol} {formatter.format(order.change)}</TableCell>
                        <TableCell className="text-center">{order.status}</TableCell>
                        <TableCell className="text-center">{order.payment_method}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No data matching the search criteria was found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-4">
              <div className="text-xs text-muted-foreground">
                Showing <strong>{filter.limit}</strong> of <strong>{total}</strong> products
              </div>
              <div className="">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={() => {
                        loadOrderTransactions()
                        setFilter(p => ({
                          ...p,
                          page: p.page - 1
                        }))
                      }} />
                    </PaginationItem>
                    {[...Array(totalPage)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink href="#" isActive={i + 1 === filter.page} onClick={() => {
                          loadOrderTransactions();
                          setFilter(p => ({
                            ...p,
                            page: (i + 1)
                          }))
                        }}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext href="#" onClick={() => {
                        loadOrderTransactions();
                        setFilter(p => ({
                          ...p,
                          page: Math.min(p.page + 1, totalPage)
                        }))
                      }} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
