
import { z } from "zod";

export const OrderItemSchema = z.object({
  service: z.enum(["Photo Printing", "Album Printing", "Acrylic Printing"]),
  size: z.string().min(1, { message: "Size is required." }),
  variant: z.string().min(1, { message: "Variant is required." }),
  frameColor: z.string().optional(),
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1." }),
  itemNotes: z.string().optional(), // For notes like "Use photos img_001 to img_050"
}).refine(data => {
    if (data.service === 'Acrylic Printing') {
        return !!data.frameColor && data.frameColor.length > 0;
    }
    return true;
}, {
    message: "Frame color is required for Acrylic Printing.",
    path: ["frameColor"],
});

export const BookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  orderItems: z.array(OrderItemSchema).min(1, "Please add at least one item to your order."),
  deliveryOption: z.enum(["Delivery", "Pickup"]),
  address: z.string().optional(),
  preferredDate: z.date(),
  generalNotes: z.string().optional(),
  photos: z.any().optional(),
}).refine(data => {
  if (data.deliveryOption === "Delivery") {
    return !!data.address && data.address.length > 0;
  }
  return true;
}, {
  message: "Address is required for delivery.",
  path: ["address"],
});


export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Booking = z.infer<typeof BookingSchema>;

export interface BookingDocument extends Omit<Booking, 'photos' | 'preferredDate' | 'orderItems' | 'generalNotes'> {
  id: string;
  orderId: string;
  orderItems: OrderItem[];
  photoURLs: string[];
  preferredDate: Date;
  status: "Pending" | "Printing" | "Ready" | "Delivered";
  createdAt: Date;
  generalNotes?: string;
}


export const ContactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactInquiry = z.infer<typeof ContactSchema>;
