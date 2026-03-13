import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const TopNavbar = () => {
  return (
    <header className="h-14 border-b border-border/50 bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions, vendors..."
            className="pl-9 w-64 h-9 bg-muted/50 border-border/50 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </Button>

        <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-lg px-2 py-1.5 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground leading-none">Acme Corp</p>
            <p className="text-xs text-muted-foreground">John Doe</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
