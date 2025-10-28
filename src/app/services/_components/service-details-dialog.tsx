
'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { ACRYLIC_PRINTING_DETAILS, PHOTO_ALBUM_DETAILS, PHOTO_PRINTING_DETAILS } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type ServiceDetails = typeof ACRYLIC_PRINTING_DETAILS | typeof PHOTO_ALBUM_DETAILS | typeof PHOTO_PRINTING_DETAILS;

type ServiceDetailsDialogProps = {
    serviceTitle: string;
    details: ServiceDetails;
};

export function ServiceDetailsDialog({ serviceTitle, details }: ServiceDetailsDialogProps) {
    
    const getImageForSize = (sizeLabel: string) => {
        if (serviceTitle === 'Acrylic Printing') {
            return PlaceHolderImages.find(img => img.id === 'gallery-acrylic-1');
        }
        if (serviceTitle === 'Photo Printing') {
            if(sizeLabel.includes('4R')) return PlaceHolderImages.find(img => img.id === 'photo-printing-4r');
            if(sizeLabel.includes('5R')) return PlaceHolderImages.find(img => img.id === 'photo-printing-5r');
            if(sizeLabel.includes('6R')) return PlaceHolderImages.find(img => img.id === 'photo-printing-6r');
            if(sizeLabel.includes('A4')) return PlaceHolderImages.find(img => img.id === 'photo-printing-a4');
            if(sizeLabel.includes('A3')) return PlaceHolderImages.find(img => img.id === 'photo-printing-a3');
            if(sizeLabel.includes('Poster')) return PlaceHolderImages.find(img => img.id === 'gallery-wallframe-2');
            return PlaceHolderImages.find(img => img.id === 'service-photo-printing');
        }
        if (serviceTitle === 'Album Printing') {
            if (sizeLabel.includes('Mini')) return PlaceHolderImages.find(img => img.id === 'album-mini');
            if (sizeLabel.includes('Small')) return PlaceHolderImages.find(img => img.id === 'album-small');
            if (sizeLabel.includes('Medium')) return PlaceHolderImages.find(img => img.id === 'album-medium');
            if (sizeLabel.includes('Large')) return PlaceHolderImages.find(img => img.id === 'album-large');
            if (sizeLabel.includes('XL')) return PlaceHolderImages.find(img => img.id === 'album-xl');
            if (sizeLabel.includes('Custom')) return PlaceHolderImages.find(img => img.id === 'album-custom');
            return PlaceHolderImages.find(img => img.id === 'gallery-album-2');
        }
        return PlaceHolderImages.find(img => img.id === 'hero-2');
    }

    const renderTable = () => {
        switch (serviceTitle) {
            case "Acrylic Printing":
                const acrylicDetails = details as typeof ACRYLIC_PRINTING_DETAILS;
                return (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Size (inches)</TableHead>
                                    <TableHead className="text-right">Price (3mm)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {acrylicDetails.options.sizes.map(s => (
                                    <TableRow key={s.size}>
                                        <TableCell>{s.size}</TableCell>
                                        <TableCell className="text-right">₹{s.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="text-sm text-muted-foreground mt-4 space-y-2">
                            <p><strong>Thickness Option:</strong> Price doubles for 8mm thickness.</p>
                            <div className="flex items-center gap-2 flex-wrap"><strong>Frame Colors:</strong> 
                                {acrylicDetails.options.frameColors.map(color => (
                                    <Badge key={color} variant="secondary">{color}</Badge>
                                ))}
                            </div>
                        </div>
                    </>
                );
            case "Photo Printing":
                 const photoDetails = details as typeof PHOTO_PRINTING_DETAILS;
                 return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Label</TableHead>
                                <TableHead>Dimensions (inches)</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {photoDetails.options.sizes.map(s => (
                                <TableRow key={s.label}>
                                    <TableCell className="font-medium">{s.label}</TableCell>
                                    <TableCell>{s.dimensions}</TableCell>
                                    <TableCell className="text-muted-foreground">{s.notes}</TableCell>
                                    <TableCell className="text-right">₹{s.priceRange}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 );
            case "Album Printing":
                const albumDetails = details as typeof PHOTO_ALBUM_DETAILS;
                return (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Album Type</TableHead>
                                    <TableHead>Size (inches)</TableHead>
                                    <TableHead className="text-right">Starting Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {albumDetails.options.albums.map(a => (
                                    <TableRow key={a.type}>
                                        <TableCell className="font-medium">{a.type}</TableCell>
                                        <TableCell>{a.size}</TableCell>
                                        <TableCell className="text-right">{typeof a.price === 'number' ? `₹${a.price}` : a.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         <div className="text-sm text-muted-foreground mt-4">
                            <p>Samples available in-store. Visit us to see the quality and finish.</p>
                        </div>
                    </>
                );
            default:
                return null;
        }
    }

    const renderImages = () => {
        let items: {label: string}[] = [];
        if ('sizes' in details.options) {
            items = (details.options.sizes as any[]).map(s => ({label: s.size || s.label}));
        } else if ('albums' in details.options) {
            items = details.options.albums.map(a => ({label: a.type}));
        }

        return (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, index) => {
                    const image = getImageForSize(item.label);
                    return (
                        <div key={index} className="group relative overflow-hidden rounded-md">
                             {image && 
                                <Image 
                                    src={image.imageUrl} 
                                    alt={`${item.label} example`} 
                                    width={300}
                                    height={300}
                                    className={cn(
                                        "w-full h-full object-contain transition-transform duration-300",
                                        (item.label.includes('A3') || item.label.includes('5R')) && "object-cover",
                                        (item.label.includes('XL Album')) && "object-cover group-hover:scale-125"
                                    )}
                                    data-ai-hint={image.imageHint}
                                />
                             }
                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white font-bold text-center">{item.label}</p>
                             </div>
                        </div>
                    );
                })}
            </div>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Explore</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">{serviceTitle}</DialogTitle>
                    <DialogDescription>{details.description}</DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-8 mt-4 max-h-[70vh]">
                     <ScrollArea className="h-full">
                        <div className="pr-4">
                           {renderImages()}
                        </div>
                     </ScrollArea>
                     <ScrollArea className="h-full">
                         <div className="pr-4">
                            {renderTable()}
                             <div className="pt-6">
                                <Button asChild className="w-full sm:w-auto">
                                    <Link href="/booking">Book This Service</Link>
                                </Button>
                            </div>
                         </div>
                     </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

    