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

  const renderCustomLabel = ({ percent }: { percent: number }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
          <SelectTrigger className="w-[180px]">
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
          <CardTitle>Total Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">
            {filteredDeals?.length || 0}
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Deal Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <PieChart width={300} height={300}>
                <Pie
                  data={statusChartData}
                  cx={150}
                  cy={150}
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomLabel}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div className="grid grid-cols-3 gap-4 mt-8">
                {Object.entries(STATUS_COLORS).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                    <span>{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Deal Area Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <PieChart width={300} height={300}>
                <Pie
                  data={areaChartData}
                  cx={150}
                  cy={150}
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomLabel}
                >
                  {areaChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={AREA_COLORS[entry.name as keyof typeof AREA_COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {Object.entries(AREA_COLORS).map(([area, color]) => (
                  <div key={area} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                    <span>{area}</span>
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