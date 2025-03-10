import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormGroup,
  FormControlLabel,
  Divider,
  Button,
  Alert,
  Avatar,
  Container,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";

export default function ProfileSettings() {
  const { user, updateNotificationSettings } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  if (!user) {
    return <Typography>Please log in to view profile settings</Typography>;
  }

  const handleNotificationChange =
    (setting: keyof typeof user.notifications) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateNotificationSettings({ [setting]: event.target.checked });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    };

  return (
    <Container maxWidth="md">
      <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
          Profile Settings
        </Typography>

        {showSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings updated successfully
          </Alert>
        )}

        <Card sx={{ mb: 4 }}>
          <CardHeader title="User Information" />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{ width: 80, height: 80, mr: 3 }}
              />
              <Box>
                <Typography variant="h5">{user.name}</Typography>
                <Typography variant="body1" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Notification Settings"
            avatar={<NotificationsIcon color="primary" />}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              Control which notifications you receive from the system.
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={user.notifications.userRegistered}
                    onChange={handleNotificationChange("userRegistered")}
                    color="primary"
                  />
                }
                label="User Registration Notifications"
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 4, mt: -1, mb: 2 }}
              >
                Receive notifications when new users are registered in the
                system
              </Typography>

              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={user.notifications.tenantRegistered}
                    onChange={handleNotificationChange("tenantRegistered")}
                    color="primary"
                  />
                }
                label="Tenant Registration Notifications"
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 4, mt: -1, mb: 2 }}
              >
                Receive notifications when new tenants are registered
              </Typography>

              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={user.notifications.cameraEvents}
                    onChange={handleNotificationChange("cameraEvents")}
                    color="primary"
                  />
                }
                label="Camera Event Notifications"
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 4, mt: -1 }}
              >
                Receive notifications when cameras are registered or deleted
              </Typography>
            </FormGroup>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
