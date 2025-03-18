import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Deal, Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building2, FolderKanban, Plus } from "lucide-react";

export default function HomePage() {
  const { data: deals } = useQuery<Deal[]>({ queryKey: ["/api/deals"] });
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Recent Deals</CardTitle>
            <Link href="/deals">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Deal
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {deals?.slice(0, 5).map((deal) => (
              <div
                key={deal.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{deal.dealName}</p>
                  <p className="text-sm text-muted-foreground">
                    {deal.accountName}
                  </p>
                </div>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                  {deal.quarter}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/deals">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="w-4 h-4 mr-2" />
                Manage Deals
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" className="w-full justify-start">
                <FolderKanban className="w-4 h-4 mr-2" />
                View Projects
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
