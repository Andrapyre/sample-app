import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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

export default function TenantManagement() {
  const { toast } = useToast();
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

  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const userAssignmentForm = useForm<z.infer<typeof userAssignmentSchema>>({
    resolver: zodResolver(userAssignmentSchema),
    defaultValues: {
      userId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newTenant = {
      ...values,
      id: Date.now().toString(),
      userIds: [],
    };

    setTenants([...tenants, newTenant]);

    toast({
      title: "Tenant created",
      description: `${values.name} has been added to the system.`,
    });

    form.reset();
  }

  function onEditSubmit(values: z.infer<typeof formSchema>) {
    if (!editingTenant) return;

    const updatedTenants = tenants.map((tenant) =>
      tenant.id === editingTenant.id
        ? { ...tenant, name: values.name }
        : tenant,
    );

    setTenants(updatedTenants);

    toast({
      title: "Tenant updated",
      description: `${values.name}'s information has been updated.`,
    });

    setEditingTenant(null);
  }

  function deleteTenant(id: string) {
    // Remove tenant from users' tenantIds
    const updatedUsers = users.map((user) => ({
      ...user,
      tenantIds: user.tenantIds.filter((tenantId) => tenantId !== id),
    }));
    setUsers(updatedUsers);

    // Remove tenant
    setTenants(tenants.filter((tenant) => tenant.id !== id));

    toast({
      title: "Tenant deleted",
      description: "The tenant has been removed from the system.",
    });
  }

  function startEditing(tenant: Tenant) {
    setEditingTenant(tenant);
    editForm.reset({
      name: tenant.name,
    });
  }

  function onUserAssignmentSubmit(
    values: z.infer<typeof userAssignmentSchema>,
  ) {
    if (!selectedTenant) return;

    // Check if user is already assigned to this tenant
    if (selectedTenant.userIds.includes(values.userId)) {
      toast({
        title: "User already assigned",
        description: "This user is already assigned to this tenant.",
        variant: "destructive",
      });
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

    toast({
      title: "User assigned",
      description: `${userName} has been assigned to ${selectedTenant.name}.`,
    });

    userAssignmentForm.reset();
  }

  function removeUserFromTenant(tenantId: string, userId: string) {
    // Update tenant
    const updatedTenants = tenants.map((tenant) =>
      tenant.id === tenantId
        ? { ...tenant, userIds: tenant.userIds.filter((id) => id !== userId) }
        : tenant,
    );
    setTenants(updatedTenants);

    // Update user
    const updatedUsers = users.map((user) =>
      user.id === userId
        ? { ...user, tenantIds: user.tenantIds.filter((id) => id !== tenantId) }
        : user,
    );
    setUsers(updatedUsers);

    // Get names for toast
    const userName = users.find((user) => user.id === userId)?.name || "User";
    const tenantName =
      tenants.find((tenant) => tenant.id === tenantId)?.name || "Tenant";

    toast({
      title: "User removed",
      description: `${userName} has been removed from ${tenantName}.`,
    });
  }

  // Get available users for a tenant (users not already assigned)
  function getAvailableUsers(tenant: Tenant) {
    return users.filter((user) => !tenant.userIds.includes(user.id));
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Tenant Management</h1>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="list">Tenant List</TabsTrigger>
          <TabsTrigger value="create">Create Tenant</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Registered Tenants</CardTitle>
              <CardDescription>
                View and manage all tenants in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tenants.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tenants registered yet. Add a tenant to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>User Count</TableHead>
                      <TableHead className="w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell className="font-medium">
                          {tenant.name}
                        </TableCell>
                        <TableCell>{tenant.userIds.length}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => startEditing(tenant)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Tenant</DialogTitle>
                                  <DialogDescription>
                                    Update tenant information below.
                                  </DialogDescription>
                                </DialogHeader>
                                <Form {...editForm}>
                                  <form
                                    onSubmit={editForm.handleSubmit(
                                      onEditSubmit,
                                    )}
                                    className="space-y-6"
                                  >
                                    <FormField
                                      control={editForm.control}
                                      name="name"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Name</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <DialogFooter>
                                      <Button type="submit">
                                        Save Changes
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedTenant(tenant)}
                                >
                                  <UserPlus className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Assign User to {tenant.name}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Select a user to assign to this tenant.
                                  </DialogDescription>
                                </DialogHeader>
                                <Form {...userAssignmentForm}>
                                  <form
                                    onSubmit={userAssignmentForm.handleSubmit(
                                      onUserAssignmentSubmit,
                                    )}
                                    className="space-y-6"
                                  >
                                    <FormField
                                      control={userAssignmentForm.control}
                                      name="userId"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>User</FormLabel>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                          >
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select a user" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {getAvailableUsers(tenant)
                                                .length === 0 ? (
                                                <SelectItem
                                                  value="none"
                                                  disabled
                                                >
                                                  No available users
                                                </SelectItem>
                                              ) : (
                                                getAvailableUsers(tenant).map(
                                                  (user) => (
                                                    <SelectItem
                                                      key={user.id}
                                                      value={user.id}
                                                    >
                                                      {user.name} ({user.email})
                                                    </SelectItem>
                                                  ),
                                                )
                                              )}
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <DialogFooter>
                                      <Button
                                        type="submit"
                                        disabled={
                                          getAvailableUsers(tenant).length === 0
                                        }
                                      >
                                        Assign User
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Tenant
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete{" "}
                                    {tenant.name}? This action cannot be undone
                                    and will remove all user associations.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteTenant(tenant.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {tenants.map((tenant) => (
            <Card key={tenant.id} className="mt-8">
              <CardHeader>
                <CardTitle>{tenant.name} - Assigned Users</CardTitle>
                <CardDescription>
                  Users currently assigned to this tenant.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tenant.userIds.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No users assigned to this tenant yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tenant.userIds.map((userId) => {
                        const user = users.find((u) => u.id === userId);
                        if (!user) return null;
                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Remove User
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove{" "}
                                      {user.name} from {tenant.name}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        removeUserFromTenant(tenant.id, user.id)
                                      }
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Tenant</CardTitle>
              <CardDescription>Add a new tenant to the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenant Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corporation" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of the tenant organization.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Create Tenant
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
