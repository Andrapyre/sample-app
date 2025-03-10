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
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Camera name must be at least 2 characters",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters",
  }),
  ipAddress: z.string().ip({
    message: "Please enter a valid IP address",
  }),
});

type Camera = z.infer<typeof formSchema> & { id: string };

export default function CameraManagement() {
  const { toast } = useToast();
  const [cameras, setCameras] = useState<Camera[]>([
    {
      id: "1",
      name: "Front Door Camera",
      location: "Main Entrance",
      ipAddress: "192.168.1.100",
    },
    {
      id: "2",
      name: "Parking Lot Camera",
      location: "North Parking",
      ipAddress: "192.168.1.101",
    },
    {
      id: "3",
      name: "Warehouse Camera",
      location: "Storage Area",
      ipAddress: "192.168.1.102",
    },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      ipAddress: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newCamera = {
      ...values,
      id: Date.now().toString(),
    };

    setCameras([...cameras, newCamera]);

    toast({
      title: "Camera registered",
      description: `${values.name} has been added to the system.`,
    });

    form.reset();
  }

  function deleteCamera(id: string) {
    setCameras(cameras.filter((camera) => camera.id !== id));

    toast({
      title: "Camera deleted",
      description: "The camera has been removed from the system.",
    });
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Camera Management</h1>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="list">Camera List</TabsTrigger>
          <TabsTrigger value="register">Register Camera</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Registered Cameras</CardTitle>
              <CardDescription>
                View and manage all cameras in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cameras.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No cameras registered yet. Add a camera to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cameras.map((camera) => (
                      <TableRow key={camera.id}>
                        <TableCell className="font-medium">
                          {camera.name}
                        </TableCell>
                        <TableCell>{camera.location}</TableCell>
                        <TableCell>{camera.ipAddress}</TableCell>
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
                                  Delete Camera
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {camera.name}?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteCamera(camera.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Register New Camera</CardTitle>
              <CardDescription>
                Add a new camera to the monitoring system.
              </CardDescription>
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
                        <FormLabel>Camera Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Front Door Camera" {...field} />
                        </FormControl>
                        <FormDescription>
                          A descriptive name for the camera.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Main Entrance" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where the camera is installed.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ipAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IP Address</FormLabel>
                        <FormControl>
                          <Input placeholder="192.168.1.100" {...field} />
                        </FormControl>
                        <FormDescription>
                          The IP address of the camera on the network.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Register Camera
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
