'use client';

import { useState, useEffect }from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookingSchema, type Booking } from '@/lib/types';
import { SERVICES, ACRYLIC_PRINTING_DETAILS, PHOTO_ALBUM_DETAILS, PHOTO_PRINTING_DETAILS } from '@/lib/config';
import { submitBooking, sendToGoogleSheet } from '../actions';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';
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
import { CalendarIcon, Loader2, Send, UploadCloud, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [filePreview, setFilePreview] = useState<string[]>([]);
  const [calculatedPrice, setCalculatedPrice] = useState<string | null>(null);

  const form = useForm<Booking>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      service: 'Photo Printing',
      size: '',
      variant: '',
      frameColor: '',
      quantity: 1,
      deliveryOption: 'Pickup',
      address: '',
      preferredDate: new Date(),
      notes: '',
      photos: undefined,
    },
  });

  const deliveryOption = form.watch('deliveryOption');
  const service = form.watch('service');
  const size = form.watch('size');
  const variant = form.watch('variant');
  const quantity = form.watch('quantity');

  useEffect(() => {
    const calculatePrice = () => {
      if (!service || !size || !variant || !quantity) {
        setCalculatedPrice(null);
        return;
      }
  
      let price: number | string | null = null;
  
      if (service === 'Acrylic Printing') {
        const sizeOption = ACRYLIC_PRINTING_DETAILS.options.sizes.find(s => s.size === size);
        if (sizeOption) {
          price = sizeOption.price * quantity;
        }
      } else if (service === 'Album Printing') {
        const albumOption = PHOTO_ALBUM_DETAILS.options.albums.find(a => a.type === variant && a.size === size);
        if (albumOption && typeof albumOption.price === 'number') {
          price = albumOption.price * quantity;
        } else if (albumOption) {
            price = albumOption.price;
        }
      } else if (service === 'Photo Printing') {
         const sizeOption = PHOTO_PRINTING_DETAILS.options.sizes.find(s => s.dimensions === size);
         if (sizeOption) {
            price = `From ₹${sizeOption.priceRange.split('–')[0]} per print`;
         }
      }
  
      if (typeof price === 'number') {
        setCalculatedPrice(`₹${price.toFixed(2)}`);
      } else if (typeof price === 'string') {
        setCalculatedPrice(price);
      } else {
        setCalculatedPrice("Price not available for this selection.");
      }
    };
  
    calculatePrice();
  }, [service, size, variant, quantity]);

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
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'photos' && value) {
        for (let i = 0; i < value.length; i++) {
          formData.append('photos', value[i]);
        }
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value) {
        formData.append(key, String(value));
      }
    });

    const result = await submitBooking(null, formData);

    if (result.success && result.orderId) {
      toast({
        title: 'Booking Confirmed!',
        description: `Your Order ID is ${result.orderId}. We will get in touch with you shortly.`,
      });
      
      const sheetResult = await sendToGoogleSheet(result.bookingData as Booking);
      if(sheetResult.success) {
        console.log("Successfully sent to Google Sheet");
      } else {
        console.error("Failed to send to Google Sheet:", sheetResult.error);
        toast({
          title: 'Google Sheet Error',
          description: 'Could not save the booking to the sheet.',
          variant: 'destructive',
        });
      }

      const emailjsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const emailjsTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const emailjsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
        const templateParams = {
          order_id: result.orderId,
          customer_name: data.name,
          customer_phone: data.phone,
          service: data.service,
        };

        emailjs
          .send(emailjsServiceId, emailjsTemplateId, templateParams, emailjsPublicKey)
          .then(
            (response) => console.log('EmailJS success!', response.status, response.text),
            (error) => console.log('EmailJS failed...', error),
          );
      }

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
  }

  return (
    <Card className="border-2 border-primary/10 shadow-lg">
      <CardHeader>
        <CardTitle className='font-headline text-2xl'>Your Order Details</CardTitle>
        <CardDescription>Fill out the form to get started. All fields marked with * are required.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Column 1 */}
              <div className="space-y-8">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue('size', '');
                          form.setValue('variant', '');
                          form.setValue('frameColor', '');
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
                    name="size"
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
                    name="variant"
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
                      name="frameColor"
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
                    name="quantity"
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
                  name="photos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Photos (Optional)</FormLabel>
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
                            <p className="mt-2 text-sm text-muted-foreground">Click or drag to upload files</p>
                            {filePreview.length > 0 && <p className="text-xs mt-2 text-primary">{filePreview.length} file(s) selected</p>}
                          </div>
                        </div>
                      </FormControl>
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

              {/* Column 2 */}
              <div className="space-y-8">
                <div className="sticky top-24">
                  <Alert>
                    <IndianRupee className="h-4 w-4" />
                    <AlertTitle>Estimated Price</AlertTitle>
                    <AlertDescription className="text-lg font-bold text-foreground">
                      {calculatedPrice || "Select options to see price"}
                    </AlertDescription>
                  </Alert>
                </div>
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
                          className="flex space-x-4 pt-2"
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
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special instructions for your order..."
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

            <div className="flex justify-end pt-8">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-foreground hover:text-background"
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
