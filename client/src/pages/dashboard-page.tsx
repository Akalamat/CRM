import { useQuery } from "@tanstack/react-query";
import { Deal } from "@shared/schema";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const STATUS_COLORS = {
  Done: "#10B981",
  Progress: "#3B82F6",
  Stuck: "#EF4444",
};

const AREA_COLORS = {
  "Kon Tum": "#FF6B6B",
  "Phú Yên": "#4ECDC4",
  "Hồ Chí Minh": "#45B7D1",
  "Hà Nội": "#96CEB4",
  "Bình Định": "#FFEEAD",
  "Kiên Giang": "#D4A5A5",
  "Đồng Nai": "#9FA8DA",
  "Vũng Tàu": "#CE93D8",
};

const QUARTERS = [
  "Q1/2023", "Q2/2023", "Q3/2023", "Q4/2023",
  "Q1/2024", "Q2/2024", "Q3/2024", "Q4/2024",
  "Q1/2025", "Q2/2025", "Q3/2025", "Q4/2025",
];

export default function DashboardPage() {
  const [selectedQuarter, setSelectedQuarter] = useState<string>("all");
  const { data: deals } = useQuery<Deal[]>({ queryKey: ["/api/deals"] });

  const filteredDeals = selectedQuarter === "all"
    ? deals
    : deals?.filter(deal => deal.quarter === selectedQuarter);

  const statusData = filteredDeals?.reduce((acc, deal) => {
    acc[deal.status] = (acc[deal.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const areaData = filteredDeals?.reduce((acc, deal) => {
    acc[deal.area] = (acc[deal.area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const areaChartData = Object.entries(areaData || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif">Dashboard</h1>
        <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
          <SelectTrigger className="w-[180px] font-serif">
            <SelectValue placeholder="Select quarter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Quarters</SelectItem>
            {QUARTERS.map((quarter) => (
              <SelectItem key={quarter} value={quarter}>
                {quarter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="font-serif">Total Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary font-serif">
            {filteredDeals?.length || 0}
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="font-serif">Deal Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PieChart width={400} height={400}>
              <Pie
                data={statusChartData}
                cx={200}
                cy={200}
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {statusChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="font-serif">Deal Area Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PieChart width={400} height={400}>
              <Pie
                data={areaChartData}
                cx={200}
                cy={200}
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {areaChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={AREA_COLORS[entry.name as keyof typeof AREA_COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}