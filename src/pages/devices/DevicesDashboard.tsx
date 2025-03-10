import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import {
  CameraAlt as CameraIcon,
  Science as MicroscopeIcon,
  Sensors as SensorIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { IoTDevice } from "@/types/devices";

export default function DevicesDashboard() {
  const navigate = useNavigate();
  const [deviceStats, setDeviceStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    maintenance: 0,
    cameras: 0,
    microscopes: 0,
    sensors: 0,
  });

  const [recentDevices, setRecentDevices] = useState<IoTDevice[]>([]);

  // Simulate fetching device data
  useEffect(() => {
    // This would be an API call in a real application
    const fetchDeviceData = () => {
      // Simulated data
      const allDevices: IoTDevice[] = [
        {
          id: "1",
          name: "Front Door Camera",
          location: "Main Entrance",
          ipAddress: "192.168.1.100",
          type: "camera",
          status: "online",
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Lab Microscope A",
          location: "Research Lab 1",
          model: "Olympus BX53",
          magnification: 1000,
          digitalOutput: true,
          type: "microscope",
          status: "online",
          lastUpdated: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: "3",
          name: "Office Temperature Sensor",
          location: "Main Office",
          sensorType: "temperature",
          measurementUnit: "°C",
          type: "sensor",
          status: "online",
          lastUpdated: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        },
        {
          id: "4",
          name: "Warehouse Camera",
          location: "Storage Area",
          ipAddress: "192.168.1.102",
          type: "camera",
          status: "offline",
          lastUpdated: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: "5",
          name: "Quality Control Microscope",
          location: "Manufacturing Floor",
          model: "Zeiss Axio",
          magnification: 200,
          digitalOutput: false,
          type: "microscope",
          status: "maintenance",
          lastUpdated: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        },
      ];

      // Calculate stats
      const stats = {
        total: allDevices.length,
        online: allDevices.filter((d) => d.status === "online").length,
        offline: allDevices.filter((d) => d.status === "offline").length,
        maintenance: allDevices.filter((d) => d.status === "maintenance")
          .length,
        cameras: allDevices.filter((d) => d.type === "camera").length,
        microscopes: allDevices.filter((d) => d.type === "microscope").length,
        sensors: allDevices.filter((d) => d.type === "sensor").length,
      };

      setDeviceStats(stats);

      // Sort by last updated and get the 3 most recent
      const recent = [...allDevices]
        .sort(
          (a, b) =>
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime(),
        )
        .slice(0, 3);

      setRecentDevices(recent);
    };

    fetchDeviceData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "success";
      case "offline":
        return "error";
      case "maintenance":
        return "warning";
      default:
        return "default";
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "camera":
        return <CameraIcon sx={{ fontSize: 40 }} color="primary" />;
      case "microscope":
        return <MicroscopeIcon sx={{ fontSize: 40 }} color="primary" />;
      case "sensor":
        return <SensorIcon sx={{ fontSize: 40 }} color="primary" />;
      default:
        return <DashboardIcon sx={{ fontSize: 40 }} color="primary" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const navigateToDeviceType = (type: string) => {
    switch (type) {
      case "camera":
        navigate("/devices/cameras");
        break;
      case "microscope":
        navigate("/devices/microscopes");
        break;
      case "sensor":
        navigate("/devices/sensors");
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h3" component="h1">
          Devices Dashboard
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate("/devices/cameras")}
          >
            Add Camera
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate("/devices/microscopes")}
          >
            Add Microscope
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate("/devices/sensors")}
          >
            Add Sensor
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Devices
            </Typography>
            <Typography variant="h3" color="primary">
              {deviceStats.total}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Online
            </Typography>
            <Typography variant="h3" color="success.main">
              {deviceStats.online}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Offline
            </Typography>
            <Typography variant="h3" color="error.main">
              {deviceStats.offline}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Maintenance
            </Typography>
            <Typography variant="h3" color="warning.main">
              {deviceStats.maintenance}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Device Type Cards */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Device Categories
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardActionArea onClick={() => navigateToDeviceType("camera")}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                }}
              >
                <CameraIcon sx={{ fontSize: 60, mb: 2 }} color="primary" />
                <Typography variant="h5" gutterBottom>
                  Cameras
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {deviceStats.cameras}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Manage security cameras and video devices
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardActionArea onClick={() => navigateToDeviceType("microscope")}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                }}
              >
                <MicroscopeIcon sx={{ fontSize: 60, mb: 2 }} color="primary" />
                <Typography variant="h5" gutterBottom>
                  Microscopes
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {deviceStats.microscopes}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Manage digital microscopes for research and quality control
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardActionArea onClick={() => navigateToDeviceType("sensor")}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                }}
              >
                <SensorIcon sx={{ fontSize: 60, mb: 2 }} color="primary" />
                <Typography variant="h5" gutterBottom>
                  Sensors
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {deviceStats.sensors}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Manage environmental and monitoring sensors
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Devices */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Recently Updated Devices
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        {recentDevices.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No devices found. Add a device to get started.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {recentDevices.map((device) => (
              <Grid item xs={12} md={4} key={device.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      {getDeviceIcon(device.type)}
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="h6">{device.name}</Typography>
                        <Chip
                          label={device.status}
                          color={
                            getStatusColor(device.status) as
                              | "success"
                              | "error"
                              | "warning"
                              | "default"
                          }
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Location: {device.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated: {formatDate(device.lastUpdated)}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        onClick={() => navigateToDeviceType(device.type)}
                      >
                        Manage {device.type}s
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
