import Link from 'next/link';
import { Camera } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/config';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2 text-2xl font-bold font-headline", className)}>
      <Camera className="h-8 w-8 text-primary" />
      <span className="text-foreground">{BUSINESS_INFO.name}</span>
    </Link>
  );
}
