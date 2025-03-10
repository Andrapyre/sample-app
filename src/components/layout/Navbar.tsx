import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import {
  CameraAlt as CameraIcon,
  People as UsersIcon,
  Business as BuildingIcon,
} from "@mui/icons-material";

export default function Navbar() {
  const location = useLocation();

  return (
    <AppBar position="static" color="primary">
      <Container>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            Management System
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <NavLink
              to="/cameras"
              active={location.pathname === "/cameras"}
              icon={<CameraIcon sx={{ mr: 1, fontSize: 20 }} />}
            >
              Camera Management
            </NavLink>
            <NavLink
              to="/users"
              active={location.pathname === "/users"}
              icon={<UsersIcon sx={{ mr: 1, fontSize: 20 }} />}
            >
              User Management
            </NavLink>
            <NavLink
              to="/tenants"
              active={location.pathname === "/tenants"}
              icon={<BuildingIcon sx={{ mr: 1, fontSize: 20 }} />}
            >
              Tenant Management
            </NavLink>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
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
    <Button
      component={RouterLink}
      to={to}
      variant={active ? "contained" : "text"}
      color={active ? "secondary" : "inherit"}
      startIcon={icon}
      sx={{
        borderRadius: 1,
        textTransform: "none",
        px: 2,
        py: 1,
        fontWeight: active ? "medium" : "normal",
      }}
    >
      {children}
    </Button>
  );
}
