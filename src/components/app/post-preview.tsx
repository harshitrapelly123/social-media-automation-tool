'use client';


import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';

import type { Post, platformDimensions, defaultEngagementMetrics } from '@/lib/types';
import { platformDimensions as dimensions, defaultEngagementMetrics as metrics } from '@/lib/types';
import { Sparkles, Repeat, MessageCircle, Heart, Share2, Upload, ChevronDown } from 'lucide-react';

// Social media platform icons - matching the reference image
const platformIcons = {
  Facebook: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  Twitter: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Instagram: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <circle cx="12" cy="10" r="3"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  ),
  LinkedIn: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
};


interface PostPreviewProps {
  post: Post;
  onRegenerate: (postId: string, edits: string) => Promise<void>;
  onDelete: (postId: string) => void;
  onPublish: (post: Post) => void;
  globalImageUri: string | undefined;
  isOpen: boolean;
  onToggle: () => void;
  viewMode?: 'desktop' | 'mobile';
  onStartEditing?: (postId: string, mode: 'text' | 'image') => void;
}

export default function PostPreview({ post, onRegenerate, onDelete, onPublish, globalImageUri, isOpen, onToggle, viewMode = 'desktop', onStartEditing }: PostPreviewProps) {
  const handleRegenerateClick = () => {
    // Instead of directly regenerating, open the editing panel
    if (onStartEditing) {
      onStartEditing(post.id, 'text');
    } else {
      // Fallback to direct regeneration if no editing panel
      onRegenerate(post.id, '');
    }
  };

  const handlePublishClick = () => {
    onPublish(post);
  };


  
  const isContentLoading = post.content === '...';
  const displayImage = globalImageUri || post.image;

  // Mobile view layout
  if (viewMode === 'mobile') {
    return (
      <Card className="w-full max-w-sm mx-auto overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <Collapsible open={isOpen} onOpenChange={onToggle}>
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-start justify-between space-x-0 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex flex-row items-center space-x-3 flex-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback className="text-xs">{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  {post.author.name === 'Post Automation Platform User' ? (
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full text-white text-sm font-bold",
                        post.platform === 'Facebook' && "bg-blue-600",
                        post.platform === 'Twitter' && "bg-sky-500",
                        post.platform === 'Instagram' && "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400",
                        post.platform === 'LinkedIn' && "bg-blue-700"
                      )}>
                        <div className="w-5 h-5">
                          {platformIcons[post.platform]}
                        </div>
                      </div>
                      <span className="font-semibold text-sm">{post.platform}</span>
                    </div>
                  ) : (
                    <p className="font-semibold text-sm truncate">{post.author.name}</p>
                  )}

                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  onClick={handleRegenerateClick}
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                >
                  <Sparkles className="h-3 w-3" />
                </Button>
                <Button
                  onClick={handlePublishClick}
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                >
                  <Upload className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                  <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isOpen && "transform rotate-180")} />
                </Button>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="p-3 pt-0 space-y-3">
              {isContentLoading ? (
                  <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-[90%]" />
                      <Skeleton className="h-3 w-[80%]" />
                  </div>
              ) : (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{post.content}</p>
              )}

              {displayImage && (
                <div className="relative w-full overflow-hidden rounded-lg border" style={{
                  aspectRatio: dimensions[post.platform].aspectRatio.replace(':', '/')
                }}>
                  <Image
                    src={displayImage}
                    alt={post.imageHint}
                    fill
                    className="object-cover"
                    data-ai-hint={post.imageHint}
                    priority
                    sizes="100vw"
                  />
                </div>
              )}

              <div className="text-xs text-muted-foreground pt-2">
                {post.platform === 'Instagram' ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{metrics[post.platform][0].value}</span>
                      <span>{metrics[post.platform][0].label}</span>
                    </div>
                    <div className="pt-1">
                      <p className="text-xs">View all {metrics[post.platform][1].value} comments</p>
                    </div>
                  </div>
                ) : post.platform === 'Facebook' ? (
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span className="text-xs">{metrics[post.platform][0].value}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span className="text-xs">{metrics[post.platform][1].value}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        <span className="text-xs">{metrics[post.platform][2].value}</span>
                      </div>
                    </div>
                    <div className="text-xs">
                      {metrics[post.platform][3].value} {metrics[post.platform][3].label}
                    </div>
                  </div>
                ) : post.platform === 'Twitter' ? (
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span className="text-xs">{metrics[post.platform][2].value}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Repeat className="h-3 w-3" />
                        <span className="text-xs">{metrics[post.platform][1].value}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span className="text-xs">{metrics[post.platform][0].value}</span>
                      </div>
                    </div>
                    <div className="text-xs">
                      {metrics[post.platform][3].value} {metrics[post.platform][3].label}
                    </div>
                  </div>
                ) : post.platform === 'LinkedIn' ? (
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span className="text-xs">{metrics[post.platform][0].value}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span className="text-xs">{metrics[post.platform][1].value}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        <span className="text-xs">{metrics[post.platform][2].value}</span>
                      </div>
                    </div>
                    <div className="text-xs">
                      {metrics[post.platform][3].value} {metrics[post.platform][3].label}
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>

          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  }

  // Desktop view layout (original)
  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="flex flex-row items-start justify-between space-x-0 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex flex-row items-center space-x-4 flex-1">
              <Avatar>
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {post.author.name === 'Post Automation Platform User' ? (
                  <div className="flex items-center gap-2">
                      <div className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full text-white text-sm font-bold",
                        post.platform === 'Facebook' && "bg-blue-600",
                        post.platform === 'Twitter' && "bg-sky-500",
                        post.platform === 'Instagram' && "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400",
                        post.platform === 'LinkedIn' && "bg-blue-700"
                      )}>
                      <div className="w-5 h-5">
                        {platformIcons[post.platform]}
                      </div>
                    </div>
                    <span className="font-semibold">{post.platform}</span>
                  </div>
                ) : (
                  <p className="font-semibold">{post.author.name}</p>
                )}

                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: {dimensions[post.platform].recommended} • {dimensions[post.platform].aspectRatio}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                onClick={handleRegenerateClick}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <Sparkles className="h-3 w-3" />
              </Button>
              <Button
                onClick={handlePublishClick}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <Upload className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "transform rotate-180")} />
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-4 pt-0 space-y-4">
            {isContentLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[80%]" />
                </div>
            ) : (
                <p className="whitespace-pre-wrap">{post.content}</p>
            )}

            {displayImage && (
              <div className="relative w-full overflow-hidden rounded-lg border" style={{
                aspectRatio: dimensions[post.platform].aspectRatio.replace(':', '/')
              }}>
                <Image
                  src={displayImage}
                  alt={post.imageHint}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={post.imageHint}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}

            <div className="text-sm text-muted-foreground pt-2">
              {post.platform === 'Instagram' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{metrics[post.platform][0].value}</span>
                    <span>{metrics[post.platform][0].label}</span>
                  </div>
                  <div className="pt-1">
                    <p className="text-xs">View all {metrics[post.platform][1].value} comments</p>
                  </div>
                </div>
              ) : post.platform === 'Facebook' ? (
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{metrics[post.platform][0].value}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{metrics[post.platform][1].value}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      <span>{metrics[post.platform][2].value}</span>
                    </div>
                  </div>
                  <div className="text-xs">
                    {metrics[post.platform][3].value} {metrics[post.platform][3].label}
                  </div>
                </div>
              ) : post.platform === 'Twitter' ? (
                <div className="flex justify-between items-center">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">{metrics[post.platform][2].value}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Repeat className="h-4 w-4" />
                      <span className="text-xs">{metrics[post.platform][1].value}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">{metrics[post.platform][0].value}</span>
                    </div>
                  </div>
                  <div className="text-xs">
                    {metrics[post.platform][3].value} {metrics[post.platform][3].label}
                  </div>
                </div>
              ) : post.platform === 'LinkedIn' ? (
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{metrics[post.platform][0].value}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{metrics[post.platform][1].value}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      <span>{metrics[post.platform][2].value}</span>
                    </div>
                  </div>
                  <div className="text-xs">
                    {metrics[post.platform][3].value} {metrics[post.platform][3].label}
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>

        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
