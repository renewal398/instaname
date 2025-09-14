import { NameGenerator } from '@/components/name-generator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="z-10 w-full max-w-5xl items-center justify-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
          instaname
        </h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
          Turn your idea into a brand. Instantly generate catchy business names with the power of AI.
        </p>
      </div>
      <div className="mt-12 w-full">
        <NameGenerator />
      </div>
    </main>
  );
}
