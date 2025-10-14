
'use client';

import { useState } from 'react';
import { PostAutomationPlatformIcon } from '@/components/app/post-automation-platform-icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/app/login-form';
import RegistrationForm from '@/components/app/registration-form';
import { ThemeToggle } from '@/components/app/theme-toggle';

export default function LoginPage() {
  const [tab, setTab] = useState('login');

  return (
    <>
    <div className="absolute top-4 right-4">
        <ThemeToggle />
    </div>
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16">
            <PostAutomationPlatformIcon />
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {tab === 'login'
              ? 'Sign in to continue to your dashboard.'
              : "Let's get your content strategy spinning."}
          </p>
        </div>
        <Tabs defaultValue="login" className="w-full" onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegistrationForm onRegisterSuccess={() => setTab('login')} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
    </>
  );
}
