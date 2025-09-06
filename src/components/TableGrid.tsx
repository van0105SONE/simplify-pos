import React from "react";
import { Card } from "@/components/ui/card";
import { TableEntity } from "@/types/pos";
import { CheckCircle, Plus, Users, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface TableGridProps {
  tables: TableEntity[];
}

export const TableGrid: React.FC<TableGridProps> = ({ tables }) => {
  const router = useRouter();

  const goToProduct = (id: number) => {
    router.push(`/sales/menues?id=${id}`); // Keep original URL structure
  };

  const goToTableManagement = () => {
    router.push(`/management/tables`); // Navigate to table management page
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {tables.map((item) => {
        // Fix: Use correct variable names and close all tags properly
        const isAvailable = item.status;
        const table = item;
        return (
          <Card
            key={item.id}
            onClick={() => {
              goToProduct(item.id);
            }}
            className={`relative cursor-pointer overflow-hidden transition-all duration-300 border-2 rounded-xl 
              ${item.status
                ? "border-green-500/20 hover:border-green-500/40 hover:shadow-lg"
                : "border-red-500/20 hover:border-red-500/40"
              }
              bg-gradient-to-br from-card to-card/90`}
          >

            {/* Table content */}
            <div className="aspect-square bg-gradient-to-br from-muted/90 to-muted/70 flex flex-col items-center justify-center p-4">
              {/* Table icon with status indicator */}
              <div
                className={`relative mb-3 p-5 rounded-full 
                  ${item.status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
              >
                {/* Status Badge - Top Right */}
                <div className="absolute top-3 right-3 z-10">
                  <Badge
                    variant={isAvailable ? "default" : "destructive"}
                    className={`
                      text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm
                      ${
                        isAvailable
                          ? "bg-green-500 text-white hover:bg-green-500"
                          : "bg-red-500 text-white hover:bg-red-500"
                      }
                    `}
                  >
                    {isAvailable ? "AVAILABLE" : "OCCUPIED"}
                  </Badge>
                </div>

                {/* Card Content */}
                <div className="p-6 text-center">
                  {/* Table Icon with Status Ring - Use Old Emoji Icon */}
                  <div className="relative mb-4 flex justify-center">
                    <div
                      className={`
                        relative p-6 rounded-full transition-all duration-300
                        ${
                          isAvailable
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }
                      `}
                    >
                      <span className="text-5xl">🍽️</span>

                      {/* Status Indicator Dot */}
                      <div
                        className={`
                          absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white shadow-lg flex items-center justify-center
                          ${isAvailable ? "bg-green-500" : "bg-red-500"}
                        `}
                      >
                        {isAvailable ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <XCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Table Name */}
                  <h3
                    className={`
                    font-bold text-2xl mb-2 transition-colors
                    ${isAvailable ? "text-gray-800" : "text-gray-700"}
                  `}
                  >
                    {table.name}
                  </h3>

                  {/* Capacity Info */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 font-medium">
                      Seats: {table.seat}
                    </span>
                  </div>

                  {/* Status Description */}
                  {/* <div
                    className={`
                    text-sm font-medium px-4 py-2 rounded-lg
                    ${
                      isAvailable
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }
                  `}
                  >
                    {isAvailable ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Ready for guests
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" />
                        Currently in use
                      </div>
                    )}
                  </div> */}

                  {/* Action Button */}
                  <div className="mt-4">
                    <Button
                      variant={isAvailable ? "default" : "outline"}
                      size="sm"
                      className={`
                        w-full font-semibold transition-all duration-200
                        ${
                          isAvailable
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "border-red-300 text-red-600 hover:bg-red-50"
                        }
                      `}
                    >
                      {isAvailable ? "Select Table" : "View Orders"}
                    </Button>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div
                  className={`
                  absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-2xl
                  ${isAvailable ? "bg-green-500" : "bg-red-500"}
                `}
                />
              </div>
            </div>
          </Card>
        );
      })}

      {/* Add New Table Card */}
      <Card
        onClick={goToTableManagement}
        className="border-2 border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-all duration-300 cursor-pointer rounded-2xl"
      >
        <div className="p-6 text-center flex flex-col items-center justify-center h-full min-h-[280px]">
          <div className="p-6 rounded-full bg-gray-200 text-gray-500 mb-4">
            <Plus className="w-12 h-12" />
          </div>
          <h3 className="font-bold text-xl text-gray-600 mb-2">
            Add New Table
          </h3>
          <p className="text-gray-500 text-sm mb-4">Create a new table</p>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </Button>
        </div>
      </Card>
    </div>
  );
};
