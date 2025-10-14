
import { Suspense } from 'react';
import DashboardClient from '@/components/app/dashboard-client';
import LoadingSkeleton from '@/components/app/loading-skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="container mx-auto p-4 md:p-6">
       <Suspense fallback={<LoadingSkeleton />}>
        <DashboardClient>
          {children}
        </DashboardClient>
       </Suspense>
    </div>
  );
}
