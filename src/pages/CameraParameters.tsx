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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  minSpeed: z.coerce.number().min(0, {
    message: "Minimum speed must be a positive number",
  }),
  objectColor: z.string().min(2, {
    message: "Object color must be at least 2 characters",
  }),
});

export default function CameraParameters() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minSpeed: 5,
      objectColor: "red",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Parameters saved",
      description: `Min Speed: ${values.minSpeed}, Object Color: ${values.objectColor}`,
    });
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Camera Parameters</h1>

      <Card>
        <CardHeader>
          <CardTitle>Detection Parameters</CardTitle>
          <CardDescription>
            Configure the parameters for object detection by your cameras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="minSpeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Speed (km/h)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5" {...field} />
                    </FormControl>
                    <FormDescription>
                      The minimum speed an object must be moving to be detected.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="objectColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Object Color</FormLabel>
                    <FormControl>
                      <Input placeholder="red" {...field} />
                    </FormControl>
                    <FormDescription>
                      The color of objects that the camera should detect.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Save Parameters
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
