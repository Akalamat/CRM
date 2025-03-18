import { useQuery } from "@tanstack/react-query";
import { Deal } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const QUARTERS = [
  "Q1/2023", "Q2/2023", "Q3/2023", "Q4/2023",
  "Q1/2024", "Q2/2024", "Q3/2024", "Q4/2024",
  "Q1/2025", "Q2/2025", "Q3/2025", "Q4/2025"
];

const STATUS_COLORS = {
  Done: "#22c55e",
  Progress: "#3b82f6",
  Stuck: "#ef4444"
};

export default function DashboardPage() {
  const [selectedQuarter, setSelectedQuarter] = useState<string>("Q1/2024");
  const { data: deals } = useQuery<Deal[]>({ queryKey: ["/api/deals"] });

  const filteredDeals = deals?.filter(deal => deal.quarter === selectedQuarter) || [];

  const statusData = Object.entries(
    filteredDeals.reduce((acc, deal) => {
      acc[deal.status] = (acc[deal.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Select onValueChange={setSelectedQuarter} value={selectedQuarter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {QUARTERS.map(quarter => (
              <SelectItem key={quarter} value={quarter}>
                {quarter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Deal Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Deals</p>
                <p className="text-2xl font-bold">{filteredDeals.length}</p>
              </div>
              <div className="pt-4 space-y-2">
                {Object.entries(
                  filteredDeals.reduce((acc, deal) => {
                    acc[deal.status] = (acc[deal.status] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className={
                      status === "Done" ? "text-green-600" :
                      status === "Progress" ? "text-blue-600" :
                      "text-red-600"
                    }>{status}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}