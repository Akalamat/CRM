import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Deal } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building2, PieChart, Plus, Users } from "lucide-react";

export default function HomePage() {
  const { data: deals } = useQuery<Deal[]>({ queryKey: ["/api/deals"] });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif">Dashboard</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-serif">Recent Deals</CardTitle>
            <Link href="/deals">
              <Button variant="outline" size="sm" className="font-serif">
                <Plus className="w-4 h-4 mr-2" />
                New Deal
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
          {deals?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
              .map((deal) => (
              <div
                key={deal.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium font-serif">{deal.dealName}</p>
                  <p className="text-sm text-muted-foreground font-serif">
                    {deal.accountName}
                  </p>
                </div>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded font-serif">
                  {deal.quarter}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/deals">
              <Button variant="outline" className="w-full justify-start font-serif">
                <Building2 className="w-4 h-4 mr-2" />
                Manage Deals
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full justify-start font-serif">
                <PieChart className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
            </Link>
            <Link href="/credits">
              <Button variant="outline" className="w-full justify-start font-serif">
                <Users className="w-4 h-4 mr-2" />
                View Credits
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}