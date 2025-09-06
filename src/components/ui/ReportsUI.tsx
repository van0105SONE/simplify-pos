// components/ui/ReportsUI.tsx

"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2"; // Chart.js Line chart
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js"; // Importing necessary Chart.js components
import { type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
// Register the necessary Chart.js components
ChartJS.register(
    CategoryScale,  // For X axis (categories)
    LinearScale,    // For Y axis (scale)
    LineElement,    // For drawing lines in the chart
    PointElement,   // For the points (individual data points) on the line
    Title,          // For the chart title
    Tooltip,        // For the tooltip when hovering over the chart
    Legend          // For the chart legend
);

// Overview Card Componentexport const OverviewCard = ({ title, value, percentage, isNegative }: any) => {
    // Define the props for the component
interface OverviewCardProps {
    title: string;
    value: string;
    percentage: string;
    isNegative?: boolean;
    className?: string;
    icon?: React.ElementType<LucideProps>; // Accept an icon component as a prop
  }
  

// Define the props for the component
interface OverviewCardProps {
    title: string;
    value: string;
    percentage: string;
    isNegative?: boolean;
    className?: string;
    icon?: React.ElementType<LucideProps>; // Accept an icon component as a prop
  }
  
  export function OverviewCard({
    title,
    value,
    percentage,
    isNegative = false,
    className,
    icon: Icon, // Rename the prop to Icon for use as a component
  }: OverviewCardProps) {
    return (
      // Add `relative` positioning to the card
      <div className={cn("relative overflow-hidden rounded-xl p-6 text-white shadow", className)}>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium opacity-80">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
          <p
            className={cn(
              "text-xs opacity-90",
              isNegative ? "text-red-200" : "text-green-200"
            )}
          >
            {percentage} from last month
          </p>
        </div>
  
        {/* Render the icon if it's provided */}
        {Icon && (
          // Position the icon at the bottom right with a smaller size and different opacity
          <Icon className="absolute -bottom-0 -right-0 h-14 w-14 text-white opacity-90" />
        )}
      </div>
    );
  }
  
  
      


// Statistics Chart Component (using Chart.js)
export const StatisticsChart = ({ earnings, spending }: any) => {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        setChartData({
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],  // Labels for the X axis
            datasets: [
                {
                    label: "Earnings",   // Dataset for earnings
                    data: [100, 200, 150, earnings, 200, 300], // Data points for the earnings
                    borderColor: "#36A2EB",  // Border color for the line
                    backgroundColor: "rgba(54, 162, 235, 0.2)", // Background color for the line (fill under the line)
                    fill: true, // Fill under the line
                },
                {
                    label: "Spending",  // Dataset for spending
                    data: [50, 80, 70, spending, 110, 120], // Data points for spending
                    borderColor: "#FF6347", // Border color for the line
                    backgroundColor: "rgba(255, 99, 71, 0.2)", // Background color for the line (fill under the line)
                    fill: true, // Fill under the line
                },
            ],
        });
    }, [earnings, spending]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            {chartData ? <Line data={chartData} /> : <p>Loading...</p>}
        </div>
    );
};

// Savings Progress Component
export const SavingsProgress = ({ value, goal }: any) => {
    const progress = (value / goal) * 100;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Total Savings</h2>
            <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">${value}</p>
                <p className="text-sm">{Math.round(progress)}% of goal</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

// Latest Transaction Component
export const LatestTransaction = ({ title, date, amount, description }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Latest Transaction</h2>
        <div className="flex justify-between items-center">
            <div>
                <p className="text-lg font-semibold">{title}</p>
                <p className="text-sm text-gray-500">{date}</p>
            </div>
            <div className="text-right">
                <p className="text-xl font-bold text-green-500">+ ${amount}</p>
                <p className="text-sm">{description}</p>
            </div>
        </div>
    </div>
);
