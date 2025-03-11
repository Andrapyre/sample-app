import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Button,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  logout,
  updateUserProfile,
  updateNotificationSettings,
} from "@/store/slices/authSlice";
import { openUserMenu, closeUserMenu } from "@/store/slices/uiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";

export const selectDevicesMenuAnchor = (state: RootState) => state.ui.devicesMenuAnchor;
export const selectUserMenuAnchor = (state: RootState) => state.ui.userMenuAnchor;

export default function UserMenu() {
  
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const userMenuAnchor = useAppSelector(selectUserMenuAnchor);
  const navigate = useNavigate();
  const anchorId = useSelector(selectDevicesMenuAnchor)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(openUserMenu(event.currentTarget.id));
  };

  const anchor = document.getElementById(anchorId)
  console.log(anchor)

  const handleMenuClose = () => {
    dispatch(closeUserMenu());
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate("/");
  };

  const handleProfile = () => {
    handleMenuClose();
    setTimeout(() => {
      navigate("/profile");
    }, 0);
  };

  const handleLogin = () => {
    setTimeout(() => {
      navigate("/login");
    }, 0);
  };

  const isOpen = Boolean(userMenuAnchor);

  if (!isAuthenticated) {
    return (
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<LoginIcon />}
        onClick={handleLogin}
        sx={{
          borderColor: "rgba(255,255,255,0.5)",
          "&:hover": {
            borderColor: "white",
            backgroundColor: "rgba(255,255,255,0.1)",
          },
        }}
      >
        Login
      </Button>
    );
  }

  if (!user) return null;

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleMenuOpen}
          size="small"
          aria-controls={isOpen ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={isOpen ? "true" : undefined}
          sx={{ p: 0 }}
        >
          <Avatar
            src={user?.avatar}
            alt={user?.name || "User"}
            sx={{
              width: 40,
              height: 40,
              border: "2px solid rgba(255,255,255,0.8)",
            }}
          >
            {!user?.avatar && (user?.name?.charAt(0) || "U")}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        id="account-menu"
        open={isOpen}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{ paper: { sx: { mt: 1 } } }}
        disablePortal
        keepMounted
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
            mt: 1.5,
            width: 200,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center" }}>
          <Avatar src={user?.avatar} sx={{ mr: 1 }}>
            {!user?.avatar && (user?.name?.charAt(0) || "U")}
          </Avatar>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box
              component="span"
              sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
            >
              {user?.name}
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: "0.75rem",
                color: "text.secondary",
                maxWidth: 130,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email}
            </Box>
          </Box>
        </Box>

        <Divider />

        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile Settings</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
