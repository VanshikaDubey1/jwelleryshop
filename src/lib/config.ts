import { ImagePlaceholder, PlaceHolderImages } from "./placeholder-images";

export const BUSINESS_INFO = {
  name: 'Shreeji Photobooks',
  tagline: 'Turning Your Memories Into Art',
  address: '36/156 Shivala Road, Near Kesa Power House, Kanpur, Uttar Pradesh',
  contact: '+918840363642',
  email: 'shreejiphotobooks@gmail.com',
  workingHours: '10 AM – 8 PM',
  whatsappLink: 'https://wa.me/918840363642?text=Hi%20Shreeji%20Photobooks%2C%20I%20want%20to%20book%20a%20print.',
  googleMapsLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3572.088694838024!2d80.3470023150353!3d26.45263298332768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c3818f9c10931%3A0x25b44b94326f54c9!2sKesa%20Power%20House!5e0!3m2!1sen!2sin!4v1622368944512!5m2!1sen!2sin'
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/booking", label: "Book Now" },
  { href: "/contact", label: "Contact" },
];

export const SERVICES = [
  {
    title: "Photo Printing",
    description: "High-quality prints of your favorite moments, available in various sizes and finishes.",
    priceRange: "₹10 – ₹50",
    image: getImage("service-photo-printing")
  },
  {
    title: "Album Printing",
    description: "Create beautiful, custom-designed photo albums to preserve your precious memories for a lifetime.",
    priceRange: "₹500 – ₹2000",
    image: getImage("service-album-printing")
  },
  {
    title: "Acrylic Printing",
    description: "Modern, vibrant, and durable acrylic prints that make your photos pop.",
    priceRange: "₹800 – ₹3000",
    image: getImage("service-acrylic-printing")
  },
];

export const GALLERY_CATEGORIES = {
  albums: {
    title: 'Albums',
    images: [
      getImage('gallery-album-1'),
      getImage('gallery-album-2'),
      getImage('gallery-album-3'),
      getImage('gallery-wallframe-2'),
    ]
  },
  acrylic: {
    title: 'Acrylic Prints',
    images: [
      getImage('gallery-acrylic-1'),
      getImage('gallery-acrylic-2'),
    ]
  },
  wallframes: {
    title: 'Wall Frames',
    images: [
      getImage('gallery-wallframe-1'),
      getImage('gallery-wallframe-2'),
      getImage('gallery-wallframe-3'),
      getImage('gallery-album-1'),
    ]
  }
};

export const TESTIMONIALS = [
  {
    quote: "The quality of the photobook I received was outstanding! Shreeji Photobooks truly turned my vacation photos into a piece of art. Highly recommended!",
    name: "Anjali Sharma",
    location: "Kanpur",
    image: getImage("testimonial-1")
  },
  {
    quote: "I ordered an acrylic print for my office, and it looks absolutely stunning. The colors are so vibrant and the finish is flawless. Excellent service and fast delivery.",
    name: "Rajesh Kumar",
    location: "Lucknow",
    image: getImage("testimonial-2")
  },
  {
    quote: "From the easy booking process to the final product, everything was perfect. The team is very professional and helpful. My wedding album is beautiful!",
    name: "Priya Singh",
    location: "Kanpur",
    image: getImage("testimonial-3")
  },
]

function getImage(id: string): ImagePlaceholder {
  return PlaceHolderImages.find(img => img.id === id) || PlaceHolderImages[0];
}
