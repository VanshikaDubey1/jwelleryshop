
'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ContactInquiry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Loader2, Mail, Phone, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface MessageDocument extends ContactInquiry {
  id: string;
  createdAt: Date;
}

export function MessageTable() {
  const [messages, setMessages] = useState<MessageDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const messagesData: MessageDocument[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          messagesData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
          } as MessageDocument);
        });
        setMessages(messagesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch messages.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const filteredMessages = useMemo(() => {
    return messages.filter(
      (message) =>
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [messages, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <Input
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <Card key={message.id} className='flex flex-col'>
              <CardHeader>
                <div className='flex items-start justify-between'>
                    <div>
                        <CardTitle>{message.name}</CardTitle>
                        <CardDescription>
                            Received on {format(new Date(message.createdAt), 'PPP, p')}
                        </CardDescription>
                    </div>
                    <User className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <p className="text-muted-foreground flex-1">"{message.message}"</p>
                <div className="border-t pt-4 space-y-2 text-sm">
                   {message.email && 
                     <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-3 shrink-0" />
                        <a href={`mailto:${message.email}`} className="text-primary hover:underline">{message.email}</a>
                     </div>
                   }
                   <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-3 shrink-0" />
                        <a href={`tel:${message.phone}`} className="text-primary hover:underline">{message.phone}</a>
                   </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground md:col-span-2 lg:col-span-3">
            No messages found.
          </div>
        )}
      </div>
    </div>
  );
}
