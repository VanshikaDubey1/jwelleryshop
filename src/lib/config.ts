
import { ImagePlaceholder, PlaceHolderImages } from "./placeholder-images";

export const BUSINESS_INFO = {
  name: 'Shreeji Photobooks',
  tagline: 'Turning Your Memories Into Art',
  address: '36/156 Shivala Road, Near Kesa Power House, Kanpur, Uttar Pradesh',
  contact: '+918840363642',
  email: 'shreejiphotobooks@gmail.com',
  workingHours: '10 AM – 8 PM',
  whatsappLink: 'https://wa.me/918840363642?text=Hi%20Shreeji%20Photobooks%2C%20I%20want%20to%20book%20a%20print.',
  googleMapsEmbedLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3572.091338274644!2d80.34701287611216!3d26.4525547789478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c381855999999%3A0x833f248e36b046b5!2sShreeji%20Photobooks!5e0!3m2!1sen!2sin!4v1720542385573!5m2!1sen!2sin',
  googleMapsDirectionLink: 'https://www.google.com/maps/search/?api=1&query=Shreeji+Photobooks+Kanpur'
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
    title: "Acrylic Printing",
    description: "Modern, vibrant, and durable acrylic prints that make your photos pop.",
    priceRange: "₹499 – ₹1999+",
    image: getImage("service-acrylic-printing")
  },
  {
    title: "Photo Printing",
    description: "High-quality prints of your favorite moments, available in various sizes and finishes.",
    priceRange: "₹10 – ₹300+",
    image: getImage("service-photo-printing")
  },
  {
    title: "Album Printing",
    description: "Create beautiful, custom-designed photo albums to preserve your precious memories for a lifetime.",
    priceRange: "₹500 – ₹4000+",
    image: getImage("service-album-printing")
  },
];

export const ACRYLIC_PRINTING_DETAILS = {
    name: "Acrylic Photo Printing",
    options: {
      sizes: [
        {"size": "12x9", "price": 499},
        {"size": "11x11", "price": 699},
        {"size": "16x12", "price": 999},
        {"size": "16x16", "price": 1199},
        {"size": "21x15", "price": 1699},
        {"size": "35x23", "price": 1999}
      ],
      thickness: [
        {"mm": 3, "priceMultiplier": 1},
        {"mm": 8, "priceMultiplier": 2}
      ],
      frameColors: ["Black", "Brown", "White"]
    },
    description: "High-quality acrylic prints with frame color options. Price doubles for 8mm thickness."
};

export const PHOTO_PRINTING_DETAILS = {
    name: "Photo Printing",
    options: {
      sizes: [
        {"label": "4R", "dimensions": "4x6", "priceRange": "10"},
        {"label": "5R", "dimensions": "5x7", "priceRange": "20"},
        {"label": "6R", "dimensions": "6x8", "priceRange": "30"},
        {"label": "A4", "dimensions": "8.3x11.7", "priceRange": "40"},
        {"label": "A3", "dimensions": "11.7x16.5", "priceRange": "50"},
        {"label": "Poster", "dimensions": ">A3", "priceRange": "200+"}
      ]
    },
    description: "Standard and custom photo printing in multiple sizes with estimated pricing."
};

export const WALL_FRAME_DETAILS = {
    name: "Wall Frames",
    options: {
        sizes: PHOTO_PRINTING_DETAILS.options.sizes.filter(s => s.label !== 'Poster')
    },
    description: "Elegant wall frames for your photos."
};


export const PHOTO_ALBUM_DETAILS = {
    name: "Photo Album",
    options: {
      albums: [
        {"type": "Mini Album", "size": "6x6", "price": 500},
        {"type": "Small Album", "size": "8x8", "price": 800},
        {"type": "Medium Album", "size": "11x8.5", "price": 1500},
        {"type": "Large Album", "size": "12x12", "price": 2500},
        {"type": "XL Album", "size": "15x12", "price": 4000},
        {"type": "Custom Album", "size": "Varies", "price": "As per request"}
      ]
    },
    description: "Customizable photo albums in multiple sizes with pricing. Samples available."
};


export const SERVICES_HOME = [
  {
    title: "HD Photo Printing",
    specs: "Glossy / Matte\nStandard Sizes",
    priceRange: "Price: ₹10 Onwards",
    image: getImage("home-hd-printing")
  },
  {
    title: "Luxury Albums",
    specs: "Wedding, Baby, Travel\nCustom Designs",
    priceRange: "Price: ₹500 Onwards",
image: getImage("home-luxury-albums")
  },
  {
    title: "Acrylic Frame Printing",
    specs: "Custom Sizes\nReady-to-Hang",
    priceRange: "Price: ₹800 Onwards",
    image: getImage("home-acrylic-frame")
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
      getImage('gallery-acrylic-new-1'),
      getImage('gallery-acrylic-new-2'),
      getImage('gallery-acrylic-new-3'),
      getImage('gallery-acrylic-new-4'),
      getImage('gallery-acrylic-new-5'),
    ]
  },
  wallframes: {
    title: 'Wall Frames',
    images: [
      getImage('gallery-wallframe-new-1'),
      getImage('gallery-wallframe-new-2'),
      getImage('gallery-wallframe-new-3'),
      getImage('gallery-wallframe-new-4'),
      getImage('gallery-wallframe-new-5'),
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

    