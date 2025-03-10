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
import { Trash2, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/models";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export default function UserManagement() {
  const { toast } = useToast();
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

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newUser = {
      ...values,
      id: Date.now().toString(),
      tenantIds: [],
    };

    setUsers([...users, newUser]);

    toast({
      title: "User created",
      description: `${values.name} has been added to the system.`,
    });

    form.reset();
  }

  function onEditSubmit(values: z.infer<typeof formSchema>) {
    if (!editingUser) return;

    const updatedUsers = users.map((user) =>
      user.id === editingUser.id
        ? { ...user, name: values.name, email: values.email }
        : user,
    );

    setUsers(updatedUsers);

    toast({
      title: "User updated",
      description: `${values.name}'s information has been updated.`,
    });

    setEditingUser(null);
  }

  function deleteUser(id: string) {
    setUsers(users.filter((user) => user.id !== id));

    toast({
      title: "User deleted",
      description: "The user has been removed from the system.",
    });
  }

  function startEditing(user: User) {
    setEditingUser(user);
    editForm.reset({
      name: user.name,
      email: user.email,
    });
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="list">User List</TabsTrigger>
          <TabsTrigger value="create">Create User</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
              <CardDescription>
                View and manage all users in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users registered yet. Add a user to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tenant Count</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.tenantIds.length}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => startEditing(user)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit User</DialogTitle>
                                  <DialogDescription>
                                    Update user information below.
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
                                    <FormField
                                      control={editForm.control}
                                      name="email"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Email</FormLabel>
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

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete User
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {user.name}?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteUser(user.id)}
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
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
              <CardDescription>Add a new user to the system.</CardDescription>
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
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormDescription>The user's full name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john.doe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The user's email address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Create User
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
