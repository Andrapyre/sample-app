import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  CameraAlt as CameraIcon,
  People as UsersIcon,
  Business as BuildingIcon,
  Dashboard as DashboardIcon,
  Science as MicroscopeIcon,
  Sensors as SensorIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import UserMenu from "./UserMenu";
import { useAppSelector } from "@/hooks/redux";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [devicesMenuAnchor, setDevicesMenuAnchor] =
    useState<null | HTMLElement>(null);

  const handleDevicesMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDevicesMenuAnchor(event.currentTarget);
  };

  const handleDevicesMenuClose = () => {
    setDevicesMenuAnchor(null);
  };

  const isDevicesActive = location.pathname.startsWith("/devices");

  return (
    <AppBar position="static" color="primary">
      <Container>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <RouterLink
            to="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              Dataflow
            </Typography>
          </RouterLink>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isAuthenticated && (
              <Box sx={{ display: "flex", gap: 2, mr: 3 }}>
                <Box>
                  <Button
                    color={isDevicesActive ? "secondary" : "inherit"}
                    onClick={handleDevicesMenuOpen}
                    endIcon={<ArrowDownIcon />}
                    sx={{
                      borderRadius: 1,
                      textTransform: "none",
                      px: 2,
                      py: 1,
                      fontWeight: isDevicesActive ? "medium" : "normal",
                    }}
                  >
                    Devices
                  </Button>
                  <Menu
                    anchorEl={devicesMenuAnchor}
                    open={Boolean(devicesMenuAnchor)}
                    onClose={handleDevicesMenuClose}
                    MenuListProps={{ sx: { py: 0 } }}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    slotProps={{ paper: { sx: { mt: 1 } } }}
                    disablePortal
                    keepMounted
                  >
                    <MenuItem
                      onClick={handleDevicesMenuClose}
                      component={RouterLink}
                      to="/devices"
                    >
                      <DashboardIcon fontSize="small" sx={{ mr: 1 }} />
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      onClick={handleDevicesMenuClose}
                      component={RouterLink}
                      to="/devices/cameras"
                    >
                      <CameraIcon fontSize="small" sx={{ mr: 1 }} />
                      Cameras
                    </MenuItem>
                    <MenuItem
                      onClick={handleDevicesMenuClose}
                      component={RouterLink}
                      to="/devices/microscopes"
                    >
                      <MicroscopeIcon fontSize="small" sx={{ mr: 1 }} />
                      Microscopes
                    </MenuItem>
                    <MenuItem
                      onClick={handleDevicesMenuClose}
                      component={RouterLink}
                      to="/devices/sensors"
                    >
                      <SensorIcon fontSize="small" sx={{ mr: 1 }} />
                      Sensors
                    </MenuItem>
                  </Menu>
                </Box>
                <NavLink
                  to="/users"
                  active={location.pathname === "/users"}
                  icon={<UsersIcon sx={{ mr: 1, fontSize: 20 }} />}
                >
                  Users
                </NavLink>
                <NavLink
                  to="/tenants"
                  active={location.pathname === "/tenants"}
                  icon={<BuildingIcon sx={{ mr: 1, fontSize: 20 }} />}
                >
                  Tenants
                </NavLink>
              </Box>
            )}
            <UserMenu />
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
