"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GALLERY_CATEGORIES } from "@/lib/config";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function GalleryClient() {
    return (
        <Tabs defaultValue="albums" className="w-full">
            <div className="flex justify-center">
                <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex">
                    {Object.entries(GALLERY_CATEGORIES).map(([key, { title }]) => (
                        <TabsTrigger key={key} value={key}>
                            {title}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            
            <div className="mt-8">
                {Object.entries(GALLERY_CATEGORIES).map(([key, { images }]) => (
                    <TabsContent key={key} value={key}>
                        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
                            {images.map((image, index) => (
                                <div key={`${image.id}-${index}`} className="break-inside-avoid">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        width={500}
                                        height={500}
                                        className="w-full h-auto object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                                        data-ai-hint={image.imageHint}
                                    />
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </div>
        </Tabs>
    );
}
