'use client';

import { TopicsSelection } from '@/components/app/topics-selection';
import { PostAutomationPlatformIcon } from '@/components/app/post-automation-platform-icon';
import { ThemeToggle } from '@/components/app/theme-toggle';

export default function TopicsPage() {
  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="w-full max-w-3xl space-y-12 relative z-10">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="mx-auto mb-6 h-20 w-20">
              <PostAutomationPlatformIcon />
            </div>
            <div className="space-y-6">
              <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Discover Trending Topics
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Explore what's hot in content creation! Join thousands of creators who are leveraging these trending topics to make engaging content.
              </p>
              {/* Trending Stats */}
              <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
                <div className="text-center">
                  <div className="font-semibold text-primary text-lg">2.1K+</div>
                  <div>Creators Active</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-primary text-lg">50+</div>
                  <div>Trending Topics</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-primary text-lg">25%</div>
                  <div>Avg Engagement ↑</div>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Selection Card */}
          <div className="flex justify-center">
            <TopicsSelection />
          </div>

          {/* Footer hint */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground/60">
              Don't worry, you can always update your preferences in your profile settings.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
