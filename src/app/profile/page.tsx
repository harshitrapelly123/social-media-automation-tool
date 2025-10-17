'use client';

import { useUser } from '@/firebase/auth/use-user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Mail, User, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Not available';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccountCreatedDate = () => {
    if (user.metadata?.creationTime) {
      return formatDate(new Date(user.metadata.creationTime));
    }
    return 'Not available';
  };

  const getLastSignInDate = () => {
    if (user.metadata?.lastSignInTime) {
      return formatDate(new Date(user.metadata.lastSignInTime));
    }
    return 'Not available';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            User Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account information and settings
          </p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback className="text-2xl">
                  {getInitials(user.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-2xl text-slate-800 dark:text-slate-200">
                  {user.displayName || 'User'}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Account Details
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Separator />

            {/* User Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Display Name
                    </p>
                    <p className="text-slate-800 dark:text-slate-200">
                      {user.displayName || 'Not set'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Email Address
                    </p>
                    <p className="text-slate-800 dark:text-slate-200">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Email Verified
                    </p>
                    <Badge variant={user.emailVerified ? "default" : "secondary"}>
                      {user.emailVerified ? 'Verified' : 'Not Verified'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Account Created
                    </p>
                    <p className="text-slate-800 dark:text-slate-200">
                      {getAccountCreatedDate()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Last Sign In
                    </p>
                    <p className="text-slate-800 dark:text-slate-200">
                      {getLastSignInDate()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      User ID
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-mono break-all">
                      {user.uid}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Provider Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Authentication Provider
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.providerData?.map((provider: any, index: number) => (
                  <Badge key={index} variant="outline">
                    {provider.providerId}
                  </Badge>
                )) || (
                  <Badge variant="outline">
                    {user.providerId || 'Unknown'}
                  </Badge>
                )}
              </div>
            </div>

            {/* Additional Information */}
            {user.phoneNumber && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Contact Information
                  </h3>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Phone Number
                      </p>
                      <p className="text-slate-800 dark:text-slate-200">
                        {user.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
