// components/dashboard/Reports.tsx
"use client";
import { ChartBarMultiple } from "@/components/ui/ChartBarMultiple"; // Chart 1 (Bar Chart)
import { ChartPieLabelCustom } from "@/components/ui/ChartPieLabelCustom"; // Chart 1 (Bar Chart)
import { ChartAreaInteractive }  from "@/components/ui/ChartAreaInteractive"; // Chart 1 (Bar Chart)
import { useEffect, useState } from "react";
import { OverviewCard } from "@/components/ui/ReportsUI"; // UI component for overview cards
import { CalendarStartDateReports, CalendarEndDateReports } from "@/components/ui/CalendarReport"; // Calendar component
import { DollarSign, ShoppingCart, PiggyBank, TrendingUp } from 'lucide-react';
import  ReportsPage  from "@/components/ui/ReportsTable"; // UI component for reports table
import { FileDown} from 'lucide-react';
import { Button } from "@/components/ui/button";



  
const handleExport = () => {
    alert("Exporting data to console. Check the developer tools.");
  };

export default function Reports() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // Simulate fetching data for the reports
        setData({
            earnings: 928.41,
            spending: 169.43,
            savings: 406.27,
            investment: 1854.08,
            totalSavings: 406.27,
            latestTransaction: {
                title: "Elevate Agency",
                date: "2 Oct 2023",
                amount: 15000,
                description: "Monthly Salary",
            },
        });
    }, []);

    return (
        <div className="pt-4 pr-6 pb-8 pl-10 ">
            <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col items-start">
                    <h1 className="text-3xl font-semibold text-gray-900 font-semibold pt-4">Dashboard</h1>
                    <p className="text-gray-500 mt-2">View your financial reports and statistics.</p>
                  </div>
                  <div className="flex items-center space-x-4">
                     <div className="pt-6">
                     <Button onClick={handleExport} variant="outline">
                        <FileDown />
                        Export
                    </Button>
                    </div>
                    <div className="">
                        <CalendarStartDateReports />
                    </div>
                    <div className="">
                        <CalendarEndDateReports />
                    </div>
                </div>
                </div>
              </div>
            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-4">
                <OverviewCard title="Total Revenue" value={`$${data?.earnings}`} percentage="+1.2% " className="bg-orange-500" icon={DollarSign}  />
                <OverviewCard title="Total Expenses" value={`$${data?.spending}`} percentage="-3.7%" isNegative className="bg-teal-500" icon={ShoppingCart} />
                <OverviewCard title="Net Profit" value={`$${data?.savings}`} percentage="+2.2%" className="bg-blue-800"  icon={PiggyBank}  />
                <OverviewCard title="Occupied Tables" value={`$${data?.investment}`} percentage="-4.2%" isNegative className="bg-amber-400"  icon={TrendingUp} />
                <OverviewCard title="Available Tables" value={`$${data?.investment}`} percentage="-4.2%" className="bg-red-500" isNegative icon={TrendingUp}/>
            </div>
            {/* Statistics Chart Section */}
            
            {/* Statistics Chart */}
            <div className="w-full gap-5 pt-6">
            <div >
                {/* piepie */}
                <ChartAreaInteractive />
            </div>
            </div>
            {/* dashboard */}
            <div className="flex w-full gap-5 pt-6">
            <div className="w-1/2">
                {/* piepie */}
                <ChartBarMultiple />
            </div>
            <div className="w-1/2">
                {/* grap*/}
                <ChartPieLabelCustom />
            </div>
            </div>
            <div className="flex w-full gap-2 pt-6">
            <div className="w-full">
                {/* piepie */}
                <ReportsPage />
            </div>
            </div>
        </div>
    );
}
