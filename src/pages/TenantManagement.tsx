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
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useToast } from "@/components/layout/Layout";
import { Tenant, User } from "@/types/models";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tenant name must be at least 2 characters",
  }),
});

const userAssignmentSchema = z.object({
  userId: z.string({
    required_error: "Please select a user to add",
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
      id={`tenant-tabpanel-${index}`}
      aria-labelledby={`tenant-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TenantManagement() {
  const { showToast } = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: "1",
      name: "Acme Corporation",
      userIds: ["1", "2"],
    },
    {
      id: "2",
      name: "Globex Industries",
      userIds: ["1"],
    },
    {
      id: "3",
      name: "Initech",
      userIds: ["3"],
    },
  ]);

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
  const [assignUserDialogOpen, setAssignUserDialogOpen] = useState(false);
  const [removeUserDialogOpen, setRemoveUserDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
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
    },
  });

  const {
    control: assignUserControl,
    handleSubmit: handleAssignUserSubmit,
    reset: resetAssignUserForm,
    formState: { errors: assignUserErrors },
  } = useForm<z.infer<typeof userAssignmentSchema>>({
    resolver: zodResolver(userAssignmentSchema),
    defaultValues: {
      userId: "",
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  function onCreateSubmit(values: z.infer<typeof formSchema>) {
    const newTenant = {
      ...values,
      id: Date.now().toString(),
      userIds: [],
    };

    setTenants([...tenants, newTenant]);

    showToast(`${values.name} has been added to the system.`, "success");

    resetCreateForm();
    setTabValue(0); // Switch to list tab after adding
  }

  function openEditDialog(tenant: Tenant) {
    setSelectedTenant(tenant);
    resetEditForm({
      name: tenant.name,
    });
    setEditDialogOpen(true);
  }

  function onEditSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedTenant) return;

    const updatedTenants = tenants.map((tenant) =>
      tenant.id === selectedTenant.id
        ? { ...tenant, name: values.name }
        : tenant,
    );

    setTenants(updatedTenants);

    showToast(`${values.name}'s information has been updated.`, "success");

    setEditDialogOpen(false);
    setSelectedTenant(null);
  }

  function openDeleteDialog(tenant: Tenant) {
    setSelectedTenant(tenant);
    setDeleteDialogOpen(true);
  }

  function deleteTenant() {
    if (!selectedTenant) return;

    // Remove tenant from users' tenantIds
    const updatedUsers = users.map((user) => ({
      ...user,
      tenantIds: user.tenantIds.filter(
        (tenantId) => tenantId !== selectedTenant.id,
      ),
    }));
    setUsers(updatedUsers);

    // Remove tenant
    setTenants(tenants.filter((tenant) => tenant.id !== selectedTenant.id));

    showToast("The tenant has been removed from the system.", "success");

    setDeleteDialogOpen(false);
    setSelectedTenant(null);
  }

  function openAssignUserDialog(tenant: Tenant) {
    setSelectedTenant(tenant);
    resetAssignUserForm();
    setAssignUserDialogOpen(true);
  }

  function onAssignUserSubmit(values: z.infer<typeof userAssignmentSchema>) {
    if (!selectedTenant) return;

    // Check if user is already assigned to this tenant
    if (selectedTenant.userIds.includes(values.userId)) {
      showToast("This user is already assigned to this tenant.", "error");
      return;
    }

    // Update tenant with new user
    const updatedTenants = tenants.map((tenant) =>
      tenant.id === selectedTenant.id
        ? { ...tenant, userIds: [...tenant.userIds, values.userId] }
        : tenant,
    );
    setTenants(updatedTenants);

    // Update user with new tenant
    const updatedUsers = users.map((user) =>
      user.id === values.userId
        ? { ...user, tenantIds: [...user.tenantIds, selectedTenant.id] }
        : user,
    );
    setUsers(updatedUsers);

    // Get user name for toast
    const userName =
      users.find((user) => user.id === values.userId)?.name || "User";

    showToast(
      `${userName} has been assigned to ${selectedTenant.name}.`,
      "success",
    );

    setAssignUserDialogOpen(false);
    resetAssignUserForm();
  }

  function openRemoveUserDialog(tenant: Tenant, user: User) {
    setSelectedTenant(tenant);
    setSelectedUser(user);
    setRemoveUserDialogOpen(true);
  }

  function removeUserFromTenant() {
    if (!selectedTenant || !selectedUser) return;

    // Update tenant
    const updatedTenants = tenants.map((tenant) =>
      tenant.id === selectedTenant.id
        ? {
            ...tenant,
            userIds: tenant.userIds.filter((id) => id !== selectedUser.id),
          }
        : tenant,
    );
    setTenants(updatedTenants);

    // Update user
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id
        ? {
            ...user,
            tenantIds: user.tenantIds.filter((id) => id !== selectedTenant.id),
          }
        : user,
    );
    setUsers(updatedUsers);

    showToast(
      `${selectedUser.name} has been removed from ${selectedTenant.name}.`,
      "success",
    );

    setRemoveUserDialogOpen(false);
    setSelectedUser(null);
  }

  // Get available users for a tenant (users not already assigned)
  function getAvailableUsers(tenant: Tenant) {
    return users.filter((user) => !tenant.userIds.includes(user.id));
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
        Tenant Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="tenant management tabs"
          sx={{ mb: 2 }}
        >
          <Tab label="Tenant List" />
          <Tab label="Create Tenant" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardHeader
            title="Registered Tenants"
            subheader="View and manage all tenants in the system."
          />
          <CardContent>
            {tenants.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                No tenants registered yet. Add a tenant to get started.
              </Typography>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>User Count</TableCell>
                      <TableCell align="right" width={150}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tenants.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell component="th" scope="row">
                          {tenant.name}
                        </TableCell>
                        <TableCell>{tenant.userIds.length}</TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <IconButton
                              aria-label="edit"
                              color="primary"
                              onClick={() => openEditDialog(tenant)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="assign user"
                              color="primary"
                              onClick={() => openAssignUserDialog(tenant)}
                            >
                              <PersonAddIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              color="error"
                              onClick={() => openDeleteDialog(tenant)}
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

        {tenants.map((tenant) => (
          <Card key={tenant.id} sx={{ mt: 4 }}>
            <CardHeader
              title={`${tenant.name} - Assigned Users`}
              subheader="Users currently assigned to this tenant."
            />
            <CardContent>
              {tenant.userIds.length === 0 ? (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ py: 2 }}
                >
                  No users assigned to this tenant yet.
                </Typography>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="right" width={100}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tenant.userIds.map((userId) => {
                        const user = users.find((u) => u.id === userId);
                        if (!user) return null;
                        return (
                          <TableRow key={user.id}>
                            <TableCell component="th" scope="row">
                              {user.name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell align="right">
                              <IconButton
                                aria-label="remove user"
                                color="error"
                                onClick={() =>
                                  openRemoveUserDialog(tenant, user)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        ))}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardHeader
            title="Create New Tenant"
            subheader="Add a new tenant to the system."
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
                      label="Tenant Name"
                      placeholder="Acme Corporation"
                      error={!!createErrors.name}
                      helperText={
                        createErrors.name
                          ? createErrors.name.message
                          : "The name of the tenant organization."
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
                  Create Tenant
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Tenant</DialogTitle>
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
        <DialogTitle>Delete Tenant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedTenant?.name}? This action
            cannot be undone and will remove all user associations.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteTenant} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign User Dialog */}
      <Dialog
        open={assignUserDialogOpen}
        onClose={() => setAssignUserDialogOpen(false)}
      >
        <DialogTitle>Assign User to {selectedTenant?.name}</DialogTitle>
        <form onSubmit={handleAssignUserSubmit(onAssignUserSubmit)}>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                pt: 1,
                minWidth: 300,
              }}
            >
              <Controller
                name="userId"
                control={assignUserControl}
                render={({ field }) => (
                  <FormControl error={!!assignUserErrors.userId} fullWidth>
                    <InputLabel id="user-select-label">User</InputLabel>
                    <MuiSelect
                      {...field}
                      labelId="user-select-label"
                      label="User"
                      displayEmpty
                      value={field.value}
                      onChange={field.onChange}
                    >
                      {selectedTenant &&
                      getAvailableUsers(selectedTenant).length === 0 ? (
                        <MenuItem value="" disabled>
                          No available users
                        </MenuItem>
                      ) : (
                        <>
                          <MenuItem value="" disabled>
                            <em>Select a user</em>
                          </MenuItem>
                          {selectedTenant &&
                            getAvailableUsers(selectedTenant).map((user) => (
                              <MenuItem key={user.id} value={user.id}>
                                {user.name} ({user.email})
                              </MenuItem>
                            ))}
                        </>
                      )}
                    </MuiSelect>
                    {assignUserErrors.userId && (
                      <FormHelperText>
                        {assignUserErrors.userId.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={
                selectedTenant && getAvailableUsers(selectedTenant).length === 0
              }
            >
              Assign User
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Remove User Dialog */}
      <Dialog
        open={removeUserDialogOpen}
        onClose={() => setRemoveUserDialogOpen(false)}
      >
        <DialogTitle>Remove User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove {selectedUser?.name} from{" "}
            {selectedTenant?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveUserDialogOpen(false)}>Cancel</Button>
          <Button onClick={removeUserFromTenant} color="error" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
