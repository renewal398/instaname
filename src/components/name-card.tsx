'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, X } from 'lucide-react';

type NameCardProps = {
  name: string;
  description: string;
};

export function NameCard({ name, description }: NameCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetUrl = `https://x.com/intent/tweet?text=I just generated a cool business name with instaname: "${encodeURIComponent(name)}" - ${encodeURIComponent(description)}`;

  return (
    <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-card">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleCopy} aria-label={copied ? 'Copied' : 'Copy name'}>
            {copied ? <Check className="text-accent-foreground" /> : <Copy />}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={tweetUrl} target="_blank" rel="noopener noreferrer" aria-label="Tweet this name">
              <X />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
