
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookingSchema, type Booking } from '@/lib/types';
import { SERVICES, ACRYLIC_PRINTING_DETAILS, PHOTO_ALBUM_DETAILS, PHOTO_PRINTING_DETAILS, BUSINESS_INFO } from '@/lib/config';
import { submitBooking } from '../actions';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, Plus, Send, Trash2, UploadCloud } from 'lucide-react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [filePreview, setFilePreview] = useState<string[]>([]);
  
  const form = useForm<Booking>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      orderItems: [{ 
        service: 'Photo Printing', 
        size: '', 
        variant: '', 
        frameColor: '', 
        quantity: 1,
        itemNotes: ''
      }],
      deliveryOption: 'Pickup',
      address: '',
      preferredDate: new Date(),
      generalNotes: '',
      photos: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "orderItems"
  });

  const deliveryOption = form.watch('deliveryOption');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setFilePreview(newPreviews);
      form.setValue('photos', files);
    }
  };

  const onSubmit = async (data: Booking) => {
    setIsSubmitting(true);
    
    const formData = new FormData();

    // Append simple fields
    formData.append('name', data.name);
    formData.append('phone', data.phone);
    formData.append('email', data.email || '');
    formData.append('deliveryOption', data.deliveryOption);
    formData.append('address', data.address || '');
    formData.append('preferredDate', data.preferredDate.toISOString());
    formData.append('generalNotes', data.generalNotes || '');
    
    // Append order items array as a JSON string
    formData.append('orderItems', JSON.stringify(data.orderItems));

    // Append photos
    if (data.photos) {
        for (let i = 0; i < data.photos.length; i++) {
          formData.append('photos', data.photos[i]);
        }
    }

    const result = await submitBooking(null, formData);

    if (result.success && result.orderId) {
      toast({
        title: 'Booking Confirmed!',
        description: `Your Order ID is ${result.orderId}. We will get in touch with you shortly.`,
      });
      form.reset();
      setFilePreview([]);
    } else if (result.error) {
      toast({
        title: 'Booking Failed',
        description: result.error,
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  const sizeOptions: Record<string, {value: string; label: string}[]> = {
    'Photo Printing': PHOTO_PRINTING_DETAILS.options.sizes.map(s => ({ value: s.dimensions, label: `${s.label} (${s.dimensions} in)` })),
    'Album Printing': PHOTO_ALBUM_DETAILS.options.albums.map(a => ({ value: a.size, label: `${a.size} in` })).filter((v, i, a) => a.findIndex(t => (t.value === v.value)) === i),
    'Acrylic Printing': ACRYLIC_PRINTING_DETAILS.options.sizes.map(s => ({ value: s.size, label: `${s.size} in` })),
  };

  const variantOptions: Record<string, string[]> = {
    'Photo Printing': ['Glossy', 'Matte'],
    'Album Printing': PHOTO_ALBUM_DETAILS.options.albums.map(a => a.type),
    'Acrylic Printing': ['3mm Thickness', '8mm Thickness'],
  };

  return (
    <Card className="border-2 border-primary/10 shadow-lg">
      <CardHeader>
        <CardTitle className='font-headline text-2xl'>Place Your Order</CardTitle>
        <CardDescription>Fill out your details and add the items you want to order. Fields with * are required.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Customer Details */}
            <div className='space-y-4'>
                <h3 className='text-lg font-medium font-headline'>Your Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                                <Input placeholder="+91 12345 67890" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                 </div>
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>

            <Separator />

            {/* Order Items */}
            <div className='space-y-6'>
                <h3 className='text-lg font-medium font-headline'>Order Items</h3>
                {fields.map((item, index) => {
                    const service = form.watch(`orderItems.${index}.service`);
                    return (
                        <div key={item.id} className='p-4 border rounded-lg relative space-y-4 bg-muted/20'>
                             <p className="font-semibold text-foreground">Item #{index + 1}</p>
                            <FormField
                                control={form.control}
                                name={`orderItems.${index}.service`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Service *</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                        field.onChange(value);
                                        form.setValue(`orderItems.${index}.size`, '');
                                        form.setValue(`orderItems.${index}.variant`, '');
                                        form.setValue(`orderItems.${index}.frameColor`, '');
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a service" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {SERVICES.map((service) => (
                                            <SelectItem key={service.title} value={service.title}>
                                            {service.title}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`orderItems.${index}.size`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Size *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a size" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {(sizeOptions[service] || []).map(option => (
                                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`orderItems.${index}.variant`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Variant *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a variant" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {(variantOptions[service] || []).map(option => (
                                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            {service === 'Acrylic Printing' && (
                            <div className="fade-in">
                                <FormField
                                control={form.control}
                                name={`orderItems.${index}.frameColor`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Frame Color *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a frame color" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {ACRYLIC_PRINTING_DETAILS.options.frameColors.map(color => (
                                                <SelectItem key={color} value={color}>{color}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            )}
                             <FormField
                                control={form.control}
                                name={`orderItems.${index}.quantity`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity *</FormLabel>
                                    <FormControl>
                                    <Input type="number" min="1" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`orderItems.${index}.itemNotes`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Item Notes (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                        placeholder="e.g., Use photos DSC_001 to DSC_050 for this album."
                                        className="resize-vertical"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    );
                })}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ service: 'Photo Printing', size: '', variant: '', frameColor: '', quantity: 1, itemNotes: '' })}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Item
                </Button>
                 <FormMessage>{form.formState.errors.orderItems?.root?.message}</FormMessage>
            </div>
            
            <Separator />
            
            {/* Upload & Final Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className='space-y-4'>
                    <FormField
                    control={form.control}
                    name="photos"
                    render={() => (
                        <FormItem>
                        <FormLabel>Upload All Photos (Optional)</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <Input
                                type="file"
                                multiple
                                accept="image/*"
                                className="w-full h-full opacity-0 absolute inset-0 cursor-pointer z-10"
                                onChange={handleFileChange}
                            />
                            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">Click or drag to upload all files for your order</p>
                                {filePreview.length > 0 && <p className="text-xs mt-2 text-primary">{filePreview.length} file(s) selected</p>}
                            </div>
                            </div>
                        </FormControl>
                         <FormDescription>
                            You can upload multiple images. Use the "Item Notes" field for each item to specify which photos to use.
                        </FormDescription>
                        {filePreview.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
                            {filePreview.map((src, i) => (
                                <img key={i} src={src} alt={`Preview ${i + 1}`} className="w-full h-auto object-cover rounded-md aspect-square" />
                            ))}
                            </div>
                        )}
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 </div>
                 <div className="space-y-4">
                     <FormField
                        control={form.control}
                        name="deliveryOption"
                        render={({ field }) => (
                            <FormItem className="space-y-3 rounded-lg border p-4 bg-muted/20">
                            <FormLabel>Delivery Option *</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-2"
                                >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="Pickup" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    Pickup from Shop
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="Delivery" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    Home Delivery
                                    </FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        {deliveryOption === 'Delivery' && (
                        <div className='fade-in'>
                            <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Delivery Address *</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Your full delivery address"
                                    className="resize-none"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        )}
                        <FormField
                        control={form.control}
                        name="preferredDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Preferred Pickup/Delivery Date *</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={'outline'}
                                    className={cn(
                                        'w-full pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, 'PPP')
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="generalNotes"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>General Order Notes (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Any special instructions for your entire order..."
                                className="resize-vertical min-h-[100px]"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                 </div>
            </div>

            <div className="flex justify-center pt-8">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-foreground hover:text-background"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Submit Booking
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
