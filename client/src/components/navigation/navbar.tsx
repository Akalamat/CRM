import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Building2, Home, LogOut, PieChart, Users } from "lucide-react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold">CRM System</h1>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/deals">
              <Button variant="ghost" className="flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Deals
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="flex items-center">
                <PieChart className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/credits">
              <Button variant="ghost" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Credits
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {user.username}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}