"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { visualizeInGallery } from "@/ai/flows/visualize-user-uploads-in-gallery";
import { Loader2, UploadCloud, Wand2 } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  photo: z.any().refine((files) => files?.length == 1, "Photo is required."),
  style: z.enum(["album", "acrylic", "wallframe"], {
    required_error: "Please select a style.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function VisualizeInGallery() {
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResultImage(null);

    const file = data.photo[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const result = await visualizeInGallery({
            photoDataUri: base64,
            galleryStyle: data.style,
          });

          if (result.error) {
             toast({
              title: "Visualization Failed",
              description: result.error,
              variant: "destructive",
            });
          } else if (result.visualizedImage) {
            setResultImage(result.visualizedImage);
          } else {
             toast({
              title: "Error",
              description: "Failed to visualize image. No image was returned.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("AI visualization failed:", error);
          toast({
            title: "Error",
            description: "Failed to visualize image. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
    } catch (error) {
      console.error("File processing failed:", error);
      toast({
        title: "Error",
        description: "Failed to process file. Please try a different image.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedImagePreview(null);
    }
  };

  return (
    <Card className="mb-12 border-2 border-primary/20 bg-card">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Wand2 className="h-8 w-8 text-primary"/>
            <CardTitle className="font-headline text-2xl">Visualize Your Photo</CardTitle>
        </div>
        <CardDescription>
          Want to see how your photo would look? Upload an image, choose a style, and let our AI create a preview for you!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1. Upload Your Photo</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                type="file"
                                accept="image/*"
                                className="w-full h-full opacity-0 absolute inset-0 cursor-pointer"
                                onChange={(e) => {
                                    field.onChange(e.target.files);
                                    handleFileChange(e);
                                }}
                            />
                            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted transition-colors">
                                {uploadedImagePreview ? (
                                    <Image src={uploadedImagePreview} alt="Preview" width={200} height={200} className="mx-auto rounded-md object-contain h-32"/>
                                ) : (
                                    <>
                                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">Click or drag to upload</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2. Choose a Style</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a gallery style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="album">Photo Album</SelectItem>
                        <SelectItem value="acrylic">Acrylic Print</SelectItem>
                        <SelectItem value="wallframe">Wall Frame</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Visualize
              </Button>
            </form>
          </Form>

          <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4 bg-muted/50">
            {isLoading && (
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">
                  Our AI is working its magic...
                </p>
              </div>
            )}
            {!isLoading && resultImage && (
              <div className="w-full">
                <p className="text-center text-lg font-headline mb-4">Here is your preview!</p>
                <Image
                  src={resultImage}
                  alt="AI visualization"
                  width={500}
                  height={500}
                  className="rounded-lg object-contain w-full h-auto"
                />
              </div>
            )}
             {!isLoading && !resultImage && (
                <div className="text-center text-muted-foreground">
                    <p className="text-lg font-medium">Your preview will appear here.</p>
                    <p className="text-sm">Complete the form to get started.</p>
                </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
