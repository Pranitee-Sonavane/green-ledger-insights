import { Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";

const TopNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<{
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
  }[]>([]);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const simulateNotification = useCallback(() => {
    const sampleNotifications = [
      {
        title: "New Vendor Score",
        message: "Eco-score updated for Vendor A (82% → 86%).",
      },
      {
        title: "Carbon Alert",
        message: "Emissions threshold exceeded for Q2 shipments.",
      },
      {
        title: "Report Ready",
        message: "Your monthly sustainability report is available.",
      },
      {
        title: "Policy Update",
        message: "Updated sourcing policy requires vendor review.",
      },
    ];

    const random = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
    const newNotification = {
      id: Date.now(),
      title: random.title,
      message: random.message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 5));
    toast({
      title: "New notification",
      description: random.message,
    });
  }, [toast]);

  useEffect(() => {
    const timer = window.setInterval(simulateNotification, 25000);
    return () => window.clearInterval(timer);
  }, [simulateNotification]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userEmail = user?.email || "Admin";
  const userInitials = userEmail
    .split("@")[0]
    .split(".")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

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
        <ThemeToggle />
        <DropdownMenu open={notificationMenuOpen} onOpenChange={(open) => {
          setNotificationMenuOpen(open);
          if (open) {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          }
        }}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 ? (
                <Badge className="absolute -top-1 -right-1 rounded-full bg-destructive text-destructive-foreground px-1.5 py-0 text-[10px]">
                  {unreadCount}
                </Badge>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-80">
            <div className="px-3 py-2 text-sm font-medium">Notifications</div>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-3 text-xs text-muted-foreground">No notifications yet.</div>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className="px-3 py-2 rounded-lg hover:bg-muted/60">
                  <p className="text-xs font-semibold text-foreground">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground">{item.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{item.time}</p>
                </div>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setNotifications([])}>
              Clear all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-lg px-2 py-1.5 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
 
  <span className="text-2xl font-extrabold tracking-wide font-serif text-primary">
    Green Ledger
  </span>
</div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">{userEmail}</p>
              <p className="text-xs text-muted-foreground">Admin Account</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNavbar;
