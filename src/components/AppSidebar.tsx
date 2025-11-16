import { Home, FileText, Wrench, CreditCard, Users, Building2, DollarSign, Settings, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  role: "student" | "warden" | "admin";
}

const studentItems = [
  { title: "Dashboard", url: "/student", icon: Home },
  { title: "My Dues", url: "/student/dues", icon: CreditCard },
  { title: "Complaints", url: "/student/complaints", icon: Wrench },
  { title: "Payment History", url: "/student/payments", icon: FileText },
];

const wardenItems = [
  { title: "Dashboard", url: "/warden", icon: Home },
  { title: "Complaints", url: "/warden/complaints", icon: Wrench },
  { title: "Occupancy", url: "/warden/occupancy", icon: Building2 },
];

const adminItems = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Students", url: "/admin/students", icon: Users },
  { title: "Staff", url: "/admin/staff", icon: Users },
  { title: "Room Allotment", url: "/admin/rooms", icon: Building2 },
  { title: "Financial Reports", url: "/admin/reports", icon: FileText },
];

export function AppSidebar({ role }: AppSidebarProps) {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const items = role === "student" ? studentItems : role === "warden" ? wardenItems : adminItems;

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-sidebar-primary" />
          {state === "expanded" && (
            <div>
              <div className="font-semibold text-sidebar-foreground">RGUKT HMC</div>
              <div className="text-xs text-sidebar-foreground/70 capitalize">{role} Portal</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="flex items-center gap-3 text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
