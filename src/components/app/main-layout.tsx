'use client';

import { usePathname } from 'next/navigation';
import { PostAutomationPlatformIcon } from '@/components/app/post-automation-platform-icon';
import Link from 'next/link';
import UserNav from '@/components/app/user-nav';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { useFirebase } from '@/firebase';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useFirebase();

  const showDashboardHeader = pathname.startsWith('/dashboard') && user;

  if (!showDashboardHeader) {
    return <>{children}</>;
  }

  const navLinks = [
    { href: '/dashboard', label: 'Generator', exact: true },
    { href: '/dashboard/analytics', label: 'Analytics' },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 mr-4">
          <div className="h-8 w-8">
            <PostAutomationPlatformIcon />
          </div>
          <span className="font-headline text-xl font-semibold hidden md:inline-block">Post Automation Platform</span>
        </Link>
        <nav className="flex items-center gap-2">
            {navLinks.map(link => {
                const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
                return (
                    <Button key={link.href} variant="ghost" asChild className={cn(isActive && "bg-accent text-accent-foreground")}>
                        <Link href={link.href}>{link.label}</Link>
                    </Button>
                )
            })}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
