
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { BUSINESS_INFO, type ACRYLIC_PRINTING_DETAILS, type PHOTO_PRINTING_DETAILS } from '@/lib/config';

type ServiceDetails = typeof ACRYLIC_PRINTING_DETAILS | typeof PHOTO_PRINTING_DETAILS;

type ImageEditorProps = {
    serviceTitle: "Acrylic Printing" | "Photo Printing";
    details: ServiceDetails;
};

type FormValues = {
    size: string;
    frameColor?: string;
    photo: FileList | null;
};

const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="mr-2"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );

export function ImageEditor({ serviceTitle, details }: ImageEditorProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedSizeLabel, setSelectedSizeLabel] = useState<string>('');

    const { control, handleSubmit, watch, register, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            size: '',
            frameColor: serviceTitle === "Acrylic Printing" ? (details.options as typeof ACRYLIC_PRINTING_DETAILS['options']).frameColors[0] : undefined,
            photo: null,
        }
    });

    const isAcrylic = serviceTitle === "Acrylic Printing";
    const selectedFrameColor = watch('frameColor');

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const getWhatsAppMessage = (data: FormValues) => {
        let message = `Hi Shreeji Photobooks, I'd like to order a custom ${serviceTitle}.\n\n`;
        message += `Size: ${data.size}\n`;
        if (isAcrylic && data.frameColor) {
            message += `Frame Color: ${data.frameColor}\n`;
        }
        message += "\nI've uploaded my photo for this order. Please let me know the next steps!";
        return message;
    };

    const frameColorClasses: Record<string, string> = {
        'Black': 'border-black',
        'Brown': 'border-yellow-900',
        'White': 'border-white',
    };

    const sizes = 'sizes' in details.options ? details.options.sizes as any[] : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor Controls */}
            <Card className="lg:col-span-1 h-fit sticky top-24">
                 <form onSubmit={handleSubmit(data => console.log(data))}>
                    <CardHeader>
                        <CardTitle>1. Customize Your Print</CardTitle>
                        <CardDescription>Select your preferred options below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Size Selection */}
                        <div>
                            <Label>Size (in inches)</Label>
                            <Controller
                                name="size"
                                control={control}
                                rules={{ required: 'Please select a size.' }}
                                render={({ field }) => (
                                     <Select onValueChange={(value) => {
                                         field.onChange(value);
                                         const sizeLabel = sizes.find(s => (s.size || s.label) === value)?.label || value;
                                         setSelectedSizeLabel(sizeLabel);
                                     }} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sizes.map((s, i) => (
                                                <SelectItem key={i} value={s.size || s.label}>{s.size || `${s.label} (${s.dimensions})`}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.size && <p className="text-sm text-destructive mt-1">{errors.size.message}</p>}
                        </div>

                        {/* Frame Color Selection (Acrylic Only) */}
                        {isAcrylic && (
                            <div>
                                <Label>Frame Color</Label>
                                <Controller
                                    name="frameColor"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            className="flex items-center gap-4 mt-2"
                                        >
                                            {(details.options as typeof ACRYLIC_PRINTING_DETAILS['options']).frameColors.map((color) => (
                                                <div key={color} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={color} id={`color-${color}`} />
                                                    <Label htmlFor={`color-${color}`}>{color}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                        )}
                        
                         {/* File Upload */}
                        <div>
                             <Label>2. Upload Your Photo</Label>
                             <div className="mt-2">
                                <input 
                                    type="file" 
                                    id="photo-upload" 
                                    className="hidden"
                                    accept="image/*"
                                    {...register('photo', { 
                                        required: 'A photo is required to place an order.',
                                        onChange: handlePhotoChange
                                    })}
                                />
                                <label 
                                    htmlFor="photo-upload"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="mb-1 text-sm text-muted-foreground">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                                    </div>
                                </label>
                                {errors.photo && <p className="text-sm text-destructive mt-1">{errors.photo.message}</p>}
                             </div>
                        </div>

                    </CardContent>
                    <CardFooter>
                         <Button 
                            className='w-full' 
                            size="lg"
                            onClick={handleSubmit((data) => {
                                const message = getWhatsAppMessage(data);
                                window.open(BUSINESS_INFO.getWhatsAppLink(message), '_blank');
                            })}
                        >
                            <WhatsAppIcon />
                            Order on WhatsApp
                        </Button>
                    </CardFooter>
                 </form>
            </Card>

            {/* Preview Section */}
            <div className="lg:col-span-2">
                <Card className={cn(
                    "aspect-w-1 aspect-h-1 lg:aspect-w-4 lg:aspect-h-3 relative flex items-center justify-center bg-muted/50 rounded-lg overflow-hidden transition-all duration-300",
                    isAcrylic && "p-8",
                )}>
                    <div className={cn(
                        "relative w-full h-full shadow-lg transition-all duration-300",
                        isAcrylic && "border-8",
                        isAcrylic && selectedFrameColor ? frameColorClasses[selectedFrameColor] : 'border-transparent'
                    )}>
                        {previewUrl ? (
                            <>
                                <Image
                                    src={previewUrl}
                                    alt="Uploaded preview"
                                    fill
                                    className="object-contain"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 z-10 h-8 w-8"
                                    onClick={() => setPreviewUrl(null)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <ImageIcon className="h-16 w-16" />
                                <p className="mt-4 text-lg font-medium">Your image preview appears here</p>
                                <p className="text-sm">Upload a photo to get started</p>
                            </div>
                        )}
                     </div>
                </Card>
            </div>
        </div>
    );
}
