
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { NAV_LINKS, BUSINESS_INFO } from "@/lib/config";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const bookNowMessage = "Hi Shreeji Photobooks, I'd like to place an order.";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile Header */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 flex flex-col p-0">
              <div className="p-4 border-b">
                <Logo />
              </div>
              <nav className="flex-1 flex flex-col items-start space-y-2 p-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium w-full text-left p-2 rounded-md transition-colors hover:bg-muted",
                      pathname === link.href ? "text-primary bg-muted" : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/track-order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-lg font-medium w-full text-left p-2 rounded-md transition-colors hover:bg-muted",
                    pathname === "/track-order" ? "text-primary bg-muted" : "text-foreground"
                  )}
                >
                  Track Order
                </Link>
              </nav>
               <div className="mt-auto p-4 border-t">
                  <Button asChild className="w-full" size="lg">
                    <Link href={BUSINESS_INFO.getWhatsAppLink(bookNowMessage)} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>Book Now</Link>
                  </Button>
                </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex-1 flex justify-center md:hidden">
            <Logo />
          </div>

          <div className="w-10" />

        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex w-full items-center">
            <div className="mr-4">
              <Logo />
            </div>
            <nav className="flex-1 flex items-center justify-center space-x-6 text-sm font-medium">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary font-semibold" : "text-foreground/60"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                  href="/track-order"
                  className={cn(
                    "transition-colors hover:text-primary",
                    pathname === "/track-order" ? "text-primary font-semibold" : "text-foreground/60"
                  )}
                >
                  Track Order
                </Link>
            </nav>
            
            <div className="flex items-center justify-end space-x-4">
                <Button asChild>
                    <Link href={BUSINESS_INFO.getWhatsAppLink(bookNowMessage)} target="_blank" rel="noopener noreferrer">Book Now</Link>
                </Button>
            </div>
        </div>
      </div>
    </header>
  );
}
