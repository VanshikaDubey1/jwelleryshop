
import { BUSINESS_INFO, NAV_LINKS } from "@/lib/config";
import { Mail, Phone, Clock, MapPin, Facebook, Instagram, Twitter, User } from "lucide-react";
import Link from "next/link";
import { Logo } from "../shared/logo";

export function Footer() {
  const socialLinks = [
    { name: "Facebook", href: "#", icon: <Facebook className="h-6 w-6" /> },
    { name: "Instagram", href: "https://www.instagram.com/shreeji.photobooks?igsh=a2NnbnRsMmMwYXZj", icon: <Instagram className="h-6 w-6" /> },
    { name: "Twitter", href: "#", icon: <Twitter className="h-6 w-6" /> },
  ];

  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-4 py-12 sm:px-6 lg:px-8">
        {/* About Section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground">{BUSINESS_INFO.tagline}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold tracking-wider uppercase font-headline">Quick Links</h3>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
             <li>
                <Link href="/track-order" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Track Order
                </Link>
              </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-semibold tracking-wider uppercase font-headline">Contact Us</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 mt-1 shrink-0 text-primary" />
              <span className="text-muted-foreground">{BUSINESS_INFO.address}</span>
            </li>
             <li className="flex items-center">
              <User className="h-5 w-5 mr-3 shrink-0 text-primary" />
              <span className="text-muted-foreground">{BUSINESS_INFO.owner}</span>
            </li>
            <li className="flex items-center">
              <Phone className="h-5 w-5 mr-3 shrink-0 text-primary" />
              <a href={`tel:${BUSINESS_INFO.contact}`} className="text-muted-foreground hover:text-primary transition-colors">{BUSINESS_INFO.contact}</a>
            </li>
            <li className="flex items-center">
              <Mail className="h-5 w-5 mr-3 shrink-0 text-primary" />
              <a href={`mailto:${BUSINESS_INFO.email}`} className="text-muted-foreground hover:text-primary transition-colors">{BUSINESS_INFO.email}</a>
            </li>
            <li className="flex items-center">
              <Clock className="h-5 w-5 mr-3 shrink-0 text-primary" />
              <span className="text-muted-foreground">{BUSINESS_INFO.workingHours}</span>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-sm font-semibold tracking-wider uppercase font-headline">Follow Us</h3>
          <div className="mt-4 flex space-x-4">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.href} className="text-muted-foreground hover:text-primary" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">{social.name}</span>
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {BUSINESS_INFO.name}. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0">
            Designed with <span className="text-red-500">&hearts;</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
