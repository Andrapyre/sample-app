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
import { useAuth } from "@/context/AuthContext";

export default function UserMenu() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login");
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const handleLogin = () => {
    navigate("/login");
  };

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

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
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
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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
