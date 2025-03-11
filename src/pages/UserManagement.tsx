import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useToast } from "@/components/layout/Layout";
import { User } from "@/types/models";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserManagement() {
  const { showToast } = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      tenantIds: ["1", "2"],
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      tenantIds: ["1"],
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      tenantIds: ["3"],
    },
  ]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    control: createControl,
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    formState: { errors: createErrors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    formState: { errors: editErrors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  function onCreateSubmit(values: z.infer<typeof formSchema>) {
    const newUser = {
      ...values,
      id: Date.now().toString(),
      tenantIds: [],
    };

    setUsers([...users, newUser]);

    showToast(`${values.name} has been added to the system.`, "success");

    resetCreateForm();
    setTabValue(0); // Switch to list tab after adding
  }

  function openEditDialog(user: User) {
    setSelectedUser(user);
    resetEditForm({
      name: user.name,
      email: user.email,
    });
    setEditDialogOpen(true);
  }

  function onEditSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedUser) return;

    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id
        ? { ...user, name: values.name, email: values.email }
        : user,
    );

    setUsers(updatedUsers);

    showToast(`${values.name}'s information has been updated.`, "success");

    setEditDialogOpen(false);
    setSelectedUser(null);
  }

  function openDeleteDialog(user: User) {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  }

  function deleteUser() {
    if (!selectedUser) return;

    setUsers(users.filter((user) => user.id !== selectedUser.id));

    showToast("The user has been removed from the system.", "success");

    setDeleteDialogOpen(false);
    setSelectedUser(null);
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
        User Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="user management tabs"
          sx={{ mb: 2 }}
        >
          <Tab label="User List" />
          <Tab label="Create User" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardHeader
            title="Registered Users"
            subheader="View and manage all users in the system."
          />
          <CardContent>
            {users.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                No users registered yet. Add a user to get started.
              </Typography>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Tenant Count</TableCell>
                      <TableCell align="right" width={120}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell component="th" scope="row">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.tenantIds.length}</TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <IconButton
                              aria-label="edit"
                              color="primary"
                              onClick={() => openEditDialog(user)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              color="error"
                              onClick={() => openDeleteDialog(user)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardHeader
            title="Create New User"
            subheader="Add a new user to the system."
          />
          <CardContent>
            <form onSubmit={handleCreateSubmit(onCreateSubmit)}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Controller
                  name="name"
                  control={createControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      placeholder="John Doe"
                      error={!!createErrors.name}
                      helperText={
                        createErrors.name
                          ? createErrors.name.message
                          : "The user's full name."
                      }
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={createControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      placeholder="john.doe@example.com"
                      error={!!createErrors.email}
                      helperText={
                        createErrors.email
                          ? createErrors.email.message
                          : "The user's email address."
                      }
                      fullWidth
                    />
                  )}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, alignSelf: "flex-start" }}
                >
                  Create User
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <form onSubmit={handleEditSubmit(onEditSubmit)}>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}
            >
              <Controller
                name="name"
                control={editControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    error={!!editErrors.name}
                    helperText={editErrors.name?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="email"
                control={editControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    error={!!editErrors.email}
                    helperText={editErrors.email?.message}
                    fullWidth
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedUser?.name}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteUser} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
