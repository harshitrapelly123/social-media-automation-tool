
import { PostAutomationPlatformIcon } from '@/components/app/post-automation-platform-icon';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="absolute top-4 right-4">
          <ThemeToggle />
      </div>
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="mx-auto mb-4 h-20 w-20">
            <PostAutomationPlatformIcon />
          </div>
          <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground md:text-6xl">
            Welcome to the Post Automation Platform
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Your AI-powered partner for creating and scheduling engaging social media content.
          </p>
          <Button asChild size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
