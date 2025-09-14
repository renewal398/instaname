'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { getBusinessNamesAction, BusinessNameState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { NameCard } from '@/components/name-card';
import { Wand2, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const MAX_CHARS = 500;

export function NameGenerator() {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<BusinessNameState | null>(null);
  const [lastDescription, setLastDescription] = useState('');
  const [charCount, setCharCount] = useState(0);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.value = lastDescription;
      setCharCount(lastDescription.length);
    }
  }, [lastDescription]);

  const handleSubmit = (formData: FormData, isRegeneration = false) => {
    const description = formData.get('description') as string;
    setLastDescription(description);

    startTransition(async () => {
      const result = await getBusinessNamesAction(formData);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Oops! Something went wrong.',
          description: result.error,
        });
        setState(s => ({...s, error: result.error}));
      } else {
        if (isRegeneration) {
          setState(result);
        } else {
          const existingNames = state?.names || [];
          if (existingNames.length > 0 && result.names) {
            setState(prevState => ({
              names: [...(prevState?.names || []), ...result.names]
            }));
          } else {
            setState(result);
          }
        }
      }
    });
  };

  const handleRegenerate = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      if (!formData.has('description') || !formData.get('description')) {
        formData.set('description', lastDescription);
      }
      
      const existingNames = state?.names?.map(n => n.name) || [];
      if (existingNames.length > 0) {
        formData.set('existingNames', JSON.stringify(existingNames));
      }

      handleSubmit(formData, true);
    }
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(event.target.value.length);
  };
  
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ names: [] });
    const formData = new FormData(event.currentTarget);
    handleSubmit(formData);
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
        <input type="hidden" name="existingNames" value={JSON.stringify(state?.names?.map(n => n.name) || [])} />
        <div className="grid w-full gap-2">
          <Label htmlFor="description" className="text-lg font-semibold">
            Business Description
          </Label>
          <Textarea
            id="description"
            name="description"
            ref={descriptionRef}
            placeholder="e.g., A modern clothing brand for teenagers focusing on sustainable materials."
            rows={4}
            required
            className="text-base"
            minLength={10}
            maxLength={MAX_CHARS}
            defaultValue={lastDescription}
            onChange={handleDescriptionChange}
          />
           <p className="text-sm text-muted-foreground text-right">
            {charCount}/{MAX_CHARS}
          </p>
        </div>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto" size="lg">
          {isPending && !state?.names?.length ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2" />
              Generate Names
            </>
          )}
        </Button>
      </form>

      {isPending && !state?.names?.length && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-headline text-center animate-pulse">Generating your names...</h2>
          <div className="grid gap-4 sm:grid-cols-1">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className='flex-1 space-y-2'>
                    <Skeleton className="h-6 w-3/5 rounded-md" />
                    <Skeleton className="h-4 w-4/5 rounded-md" />
                  </div>
                  <div className="flex items-center gap-1">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {state?.names && state.names.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-center items-center gap-4">
             <h2 className="text-3xl font-bold font-headline text-center">Your new brand names!</h2>
            <Button onClick={handleRegenerate} variant="outline" disabled={isPending} size="icon" aria-label="Regenerate names">
              {isPending ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div> : <RefreshCw />}
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-1">
            {state.names.map((item, index) => (
              <NameCard key={index} name={item.name} description={item.description} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
