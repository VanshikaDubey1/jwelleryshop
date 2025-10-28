
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import Image from "next/image";
import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


type ServiceCardProps = {
  title: string;
  description: string;
  image: ImagePlaceholder;
  children: ReactNode;
};

export function ServiceCard({ title, description, image, children }: ServiceCardProps) {
  return (
    <Card className="flex flex-col md:flex-row overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group bg-card border-border rounded-lg">
        <div className="relative aspect-w-16 aspect-h-9 md:aspect-w-3 md:aspect-h-2 md:w-1/3">
            <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="flex-1 flex items-center p-6">
            <div className="flex-1">
                <CardTitle className="font-headline text-2xl">{title}</CardTitle>
                <CardDescription className="mt-2 text-base text-muted-foreground">{description}</CardDescription>
            </div>
            <div className="ml-6 flex items-center gap-4">
                {children}
            </div>
        </div>
    </Card>
  );
}
