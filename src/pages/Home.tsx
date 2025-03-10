import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
} from "@mui/material";
import {
  Speed as SpeedIcon,
  CameraAlt as CameraIcon,
  Science as MicroscopeIcon,
  Sensors as SensorIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/devices" replace />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          borderRadius: { xs: 0, sm: "0 0 2rem 2rem" },
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                Dataflow IoT Management Platform
              </Typography>
              <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                Seamlessly manage all your IoT devices in one centralized
                platform
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate("/login")}
                  startIcon={<LoginIcon />}
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Login
                </Button>
                {!isAuthenticated && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    sx={{
                      borderColor: "white",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Learn More
                  </Button>
                )}
              </Stack>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80"
                alt="IoT Devices"
                sx={{
                  width: "100%",
                  borderRadius: "1rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Manage All Your IoT Devices
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          paragraph
          sx={{ mb: 6, maxWidth: 800, mx: "auto" }}
        >
          Dataflow provides a comprehensive solution for managing various types
          of IoT devices, from cameras to sensors, all in one place.
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 3 },
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image="https://images.unsplash.com/photo-1576344444573-8cfa2e8886b4?w=600&q=80"
                alt="Camera"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CameraIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h5" component="h3">
                    Cameras
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage security cameras, webcams, and other video devices.
                  Monitor feeds, adjust settings, and control access all from
                  one interface.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 3 },
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80"
                alt="Microscope"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <MicroscopeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h5" component="h3">
                    Microscopes
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Connect and control digital microscopes for research, quality
                  control, and educational purposes. Capture, analyze, and share
                  microscopic imagery.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 3 },
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80"
                alt="Sensors"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <SensorIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h5" component="h3">
                    Sensors
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Deploy and monitor environmental sensors for temperature,
                  humidity, air quality, and more. Collect real-time data and
                  set up automated alerts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: "grey.100", py: 8, mt: 4 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Ready to streamline your IoT management?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ mb: 4 }}
          >
            Join thousands of organizations that trust Dataflow for their IoT
            device management needs.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/login")}
            sx={{ px: 4, py: 1.5 }}
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
