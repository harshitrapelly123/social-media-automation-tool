'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import RegistrationForm from '@/components/app/registration-form';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { ArrowLeft, AlertCircle, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in and redirect to dashboard
    if (typeof window !== 'undefined') {
      const token = document.cookie.split(';').find(row => row.trim().startsWith('token='))?.split('=')[1];
      const accessToken = document.cookie.split(';').find(row => row.trim().startsWith('access_token='))?.split('=')[1];
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

      if (token || accessToken || isAuthenticated) {
        router.push('/dashboard');
        return;
      }
    }
  }, [router]);

  const handleRegisterSuccess = () => {
    // Redirect to login page after successful registration
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex h-16 items-center gap-2 sm:gap-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-3 sm:px-4 md:px-6 lg:px-8 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100 transition-colors duration-300 flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <Link href="/">
          <div className="flex items-center gap-2 mr-2 sm:mr-4 cursor-pointer min-w-0 flex-shrink-0">
            <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-headline text-base sm:text-lg md:text-xl font-semibold hidden sm:inline-block text-slate-800 dark:text-slate-200 truncate">
              Post Automation Platform
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto flex-1 min-w-0">
          <Button
            variant="ghost"
            asChild
            className="whitespace-nowrap text-sm sm:text-base px-2 sm:px-3 py-2 transition-all duration-300 flex-shrink-0"
          >
            <Link href="/create-post">Create Post</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="whitespace-nowrap text-sm sm:text-base px-2 sm:px-3 py-2 transition-all duration-300 flex-shrink-0"
          >
            <Link href="/analytics">Analytics</Link>
          </Button>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="w-9 h-9 p-0"
          >
            <Link href="/profile">
              <User className="w-4 h-4" />
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-indigo-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-3 sm:p-4 md:p-6 pt-20 sm:pt-24 md:pt-28 lg:pt-10">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Session Expired Alert */}
          {showSessionExpired && (
            <Alert className="mb-4 sm:mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-sm sm:text-base text-orange-800 dark:text-orange-200">
                You need to sign in to access this page.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            <h1 className=" mt-6 sm:mt-10 md:mt-12 lg:mt-16 font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-800 dark:text-slate-200 bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 dark:from-slate-200 dark:via-blue-200 dark:to-slate-200 bg-clip-text text-transparent leading-tight">
              Create an Account
            </h1>

            <p className="mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 rounded-2xl border-0 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 p-4 sm:p-6 md:p-8">
            <RegistrationForm onRegisterSuccess={handleRegisterSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}
