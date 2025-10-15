
import { Suspense } from 'react';
import DashboardClient from '@/components/app/dashboard-client';
import LoadingSkeleton from '@/components/app/loading-skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-indigo-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 h-full">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
           <Suspense fallback={<LoadingSkeleton />}>
            <DashboardClient>
              {children}
            </DashboardClient>
           </Suspense>
        </div>
      </div>
    </div>
  );
}
