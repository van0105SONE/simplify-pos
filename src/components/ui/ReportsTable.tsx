import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// --- Mock Data ---
// In a real app, this data would come from an API
const latestInvoices = [
  { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
  { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
  { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
  { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
  { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
  { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
  { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
  { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
  { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
];

const bestSellers = [
    { invoice: "PROD01", paymentStatus: "Paid", totalAmount: "$1,250.00", paymentMethod: "Electronics" },
    { invoice: "PROD02", paymentStatus: "Paid", totalAmount: "$950.00", paymentMethod: "Books" },
    { invoice: "PROD03", paymentStatus: "Paid", totalAmount: "$870.00", paymentMethod: "Home Goods" },
    { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
  { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
  { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
  { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
  { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
  { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
];

// --- Reusable UI Components ---

// A small component to render a colored badge based on status
function StatusBadge({ status }: { status: string }) {
    return (
        <Badge
            className={cn(
                "capitalize",
                status === "Paid" && "bg-green-100 text-green-800",
                status === "Pending" && "bg-yellow-100 text-yellow-800",
                status === "Unpaid" && "bg-red-100 text-red-800"
            )}
        >
            {status}
        </Badge>
    );
}

// A reusable table component that accepts data and titles as props
type ReportsTableProps = {
  title: string;
  description: string;
  headers: { key: string; label: string; className?: string }[];
  data: { invoice: string; paymentStatus: string; totalAmount: string; paymentMethod: string }[];
  footerText: string;
  footerValue: string;
};

function ReportsTable({ title, description, headers, data, footerText, footerValue }: ReportsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header.key} className={header.className}>{header.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.invoice}>
                <TableCell className="font-medium">{row.invoice}</TableCell>
                <TableCell>
                  <StatusBadge status={row.paymentStatus} />
                </TableCell>
                <TableCell>{row.paymentMethod}</TableCell>
                <TableCell className="text-right">{row.totalAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>{footerText}</TableCell>
              <TableCell className="text-right">{footerValue}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}

// --- Main Page Component ---
// This is the main component you would export and use on your page
export default function ReportsPage() {
  const latestTransactionHeaders = [
    { key: 'invoice', label: 'Invoice', className: 'w-[100px]' },
    { key: 'status', label: 'Status' },
    { key: 'method', label: 'Method' },
    { key: 'amount', label: 'Amount', className: 'text-right' },
  ];

  const bestSellerHeaders = [
    { key: 'product', label: 'Product ID', className: 'w-[100px]' },
    { key: 'status', label: 'Sales Status' },
    { key: 'category', label: 'Category' },
    { key: 'revenue', label: 'Total Revenue', className: 'text-right' },
  ];

  return (
    <div className="grid container pt-4 pb-2">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">View your latest transactions and best selling products.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ReportsTable 
          title="Latest Transactions"
          description="A list of your most recent invoices."
          headers={latestTransactionHeaders}
          data={latestInvoices}
          footerText="Total"
          footerValue="$750.00"
        />
        <ReportsTable 
          title="Best Selling Products"
          description="A list of your top performing products."
          headers={bestSellerHeaders}
          data={bestSellers}
          footerText="Total Revenue"
          footerValue="$3,070.00"
        />
      </div>
    </div>
  )
}
