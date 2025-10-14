
'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { platformIcons, defaultEngagementMetrics } from '@/lib/types';
import type { Post, AnalyticsPost, EngagementMetric, Platform } from '@/lib/types';
import Image from 'next/image';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import placeholderData from '@/lib/placeholder-images.json';

const { placeholderImages } = placeholderData;

const dummyPosts: Post[] = [
    {
      id: 'facebook-dummy-1',
      platform: 'Facebook',
      content: 'Exploring the latest trends in AI and machine learning. The future is now! #AI #Tech #Innovation',
      image: placeholderImages[0].imageUrl,
      imageHint: placeholderImages[0].imageHint,
      author: { name: 'Analytics Admin', avatar: 'https://picsum.photos/seed/admin/40/40' },
    },
    {
      id: 'instagram-dummy-1',
      platform: 'Instagram',
      content: 'Just another beautiful day to be productive and creative. #WorkLifeBalance #Scenery',
      image: placeholderImages[3].imageUrl,
      imageHint: placeholderImages[3].imageHint,
      author: { name: 'Analytics Admin', avatar: 'https://picsum.photos/seed/admin/40/40' },
    },
    {
      id: 'twitter-dummy-1',
      platform: 'Twitter',
      content: 'Quick thoughts on the new framework release - it\'s a game changer for developers!',
      image: placeholderImages[0].imageUrl,
      imageHint: placeholderImages[0].imageHint,
      author: { name: 'Analytics Admin', avatar: 'https://picsum.photos/seed/admin/40/40' },
    },
    {
        id: 'linkedin-dummy-1',
        platform: 'LinkedIn',
        content: 'Excited to share our Q3 results and the strategic direction for the upcoming year. #BusinessGrowth #Leadership',
        image: placeholderImages[2].imageUrl,
        imageHint: placeholderImages[2].imageHint,
        author: { name: 'Analytics Admin', avatar: 'https://picsum.photos/seed/admin/40/40' },
    }
];


const generateAnalyticsFromPosts = (posts: Post[]): AnalyticsPost[] => {
    return posts.map((post) => {
        return {
            ...post,
            engagement: defaultEngagementMetrics[post.platform],
        };
    });
};

const platformIconColors: { [key in Platform]: string } = {
    Facebook: 'bg-blue-100 dark:bg-blue-900/50',
    Twitter: 'bg-sky-100 dark:bg-sky-900/50',
    Instagram: 'bg-rose-100 dark:bg-rose-900/50',
    LinkedIn: 'bg-indigo-100 dark:bg-indigo-900/50',
};


function MetricCard({ metric, platform }: { metric: EngagementMetric, platform: Platform }) {
    const ChangeIcon = metric.changeType === 'positive' ? TrendingUp : TrendingDown;
    const changeColor = metric.changeType === 'positive' ? 'text-emerald-500' : 'text-red-500';

    return (
        <div className="flex items-center gap-2 rounded-md bg-muted/30 p-2 min-h-[48px]">
            <div className={cn("flex size-6 items-center justify-center rounded-full border", platformIconColors[platform])}>
                <metric.icon className="size-3 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground leading-none truncate">{metric.label}</p>
                <p className="text-sm font-semibold leading-none truncate">{metric.value}</p>
                {metric.change && (
                    <div className={cn("flex items-center gap-0.5 text-[9px] leading-none", changeColor)}>
                        <ChangeIcon className="size-2.5" />
                        <span>{metric.change}</span>
                    </div>
                )}
            </div>
        </div>
    );
}


function AnalyticsPostCard({ post }: { post: AnalyticsPost }) {
    const PlatformIcon = platformIcons[post.platform];

    return (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 max-w-md mx-auto dark:bg-linear-to-r dark:from-slate-900 dark:to-blue-950">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
                <div className="flex items-center gap-2">
                    <PlatformIcon className="size-5 text-muted-foreground" />
                    <CardTitle className="text-lg font-bold">{post.platform} Post</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
                <div className="flex gap-3">
                    <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg border">
                        <Image
                          src={post.image}
                          alt={post.imageHint}
                          fill
                          className="object-cover"
                          data-ai-hint={post.imageHint}
                          sizes="80px"
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-3">{post.content}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-muted/20 p-3">
                 <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2">
                    {post.engagement.map(metric => (
                        <MetricCard key={metric.label} metric={metric} platform={post.platform} />
                    ))}
                 </div>
            </CardFooter>
        </Card>
    );
}

export default function AnalyticsDashboard() {
  const analyticsData = generateAnalyticsFromPosts(dummyPosts);
  const [selectedPlatform, setSelectedPlatform] = React.useState<string>('All');

  const filteredData = selectedPlatform === 'All'
    ? analyticsData
    : analyticsData.filter(post => post.platform === selectedPlatform);

  if (analyticsData.length === 0) {
    return (
        <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No Posts Published</AlertTitle>
            <AlertDescription>
                You haven't published any posts yet. Go to the "Generator" tab to create and publish your first post.
            </AlertDescription>
        </Alert>
    )
  }

  const platformOptions = ['All', ...Array.from(new Set(analyticsData.map(post => post.platform)))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Monitor your social media performance</p>
        </div>
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            {platformOptions.map(platform => (
              <SelectItem key={platform} value={platform}>
                {platform}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map(post => (
          <AnalyticsPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
