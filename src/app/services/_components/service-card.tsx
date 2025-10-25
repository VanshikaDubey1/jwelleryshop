import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type ServiceCardProps = {
  title: string;
  description: string;
  image: ImagePlaceholder;
  children: ReactNode;
};

export function ServiceCard({ title, description, image, children }: ServiceCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group bg-card border-border">
      <div className="relative aspect-w-4 aspect-h-3">
        <Image
          src={image.imageUrl}
          alt={image.description}
          fill
          className="object-cover"
          data-ai-hint={image.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <CardHeader>
        <CardTitle className="font-headline relative text-2xl">
          {title}
          <span className="absolute bottom-0 left-0 h-0.5 bg-primary w-16 transition-all duration-300 group-hover:w-24"></span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <p className="text-muted-foreground">{description}</p>
        <div>
            {children}
        </div>
      </CardContent>
      <div className="p-6 pt-0 mt-auto">
        <Button asChild className="w-full">
            <Link href="/booking">Book This Service</Link>
        </Button>
      </div>
    </Card>
  );
}
