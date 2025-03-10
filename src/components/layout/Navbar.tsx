import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Camera, Sliders } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Camera Management System</div>
        <div className="flex space-x-4">
          <NavLink
            to="/parameters"
            active={location.pathname === "/parameters"}
            icon={<Sliders className="mr-2 h-4 w-4" />}
          >
            Camera Parameters
          </NavLink>
          <NavLink
            to="/cameras"
            active={location.pathname === "/cameras"}
            icon={<Camera className="mr-2 h-4 w-4" />}
          >
            Camera Management
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function NavLink({ to, active, children, icon }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-4 py-2 rounded-md transition-colors",
        active
          ? "bg-primary-foreground text-primary font-medium"
          : "hover:bg-primary-foreground/10",
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
