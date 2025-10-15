
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PostAutomationPlatformIcon } from '@/components/app/post-automation-platform-icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/app/login-form';
import RegistrationForm from '@/components/app/registration-form';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-indigo-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-4 backdrop-blur-sm md:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100 transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <div className="flex items-center gap-2 mr-4">
          <div className="h-8 w-8 md:h-10 md:w-10">
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-headline text-lg md:text-xl font-semibold hidden sm:inline-block text-slate-800 dark:text-slate-200">
            Post Automation Platform
          </span>
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto">
          <Button
            variant="ghost"
            asChild
            className="whitespace-nowrap transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl"
          >
            <Link href="/topics">Topics</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="whitespace-nowrap transition-all duration-300"
          >
            <Link href="/">Dashboard</Link>
          </Button>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:gap-4">
          <ThemeToggle />
        </div>
      </header>

      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto mb-6 h-16 w-16 md:h-20 md:w-20">
              <PostAutomationPlatformIcon />
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-800 dark:text-slate-200 bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 dark:from-slate-200 dark:via-blue-200 dark:to-slate-200 bg-clip-text text-transparent">
              {tab === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {tab === 'login'
                ? 'Sign in to continue to your dashboard.'
                : "Let's get your content strategy spinning."}
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 rounded-2xl border-0 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 p-6 md:p-8">
            <Tabs defaultValue="login" className="w-full" onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm transition-all duration-300">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm transition-all duration-300">
                  Register
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-6">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register" className="mt-6">
                <RegistrationForm onRegisterSuccess={() => setTab('login')} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
