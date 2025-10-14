
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Post, platformDimensions, defaultEngagementMetrics } from '@/lib/types';
import { platformDimensions as dimensions, defaultEngagementMetrics as metrics } from '@/lib/types';
import { Sparkles, Repeat, MessageCircle, Heart, Share2, Upload, Trash2, ChevronDown } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface PostPreviewProps {
  post: Post;
  onRegenerate: (postId: string, edits: string) => Promise<void>;
  onDelete: (postId: string) => void;
  onPublish: (post: Post) => void;
  globalImageUri: string | undefined;
  isOpen: boolean;
  onToggle: () => void;
}

export default function PostPreview({ post, onRegenerate, onDelete, onPublish, globalImageUri, isOpen, onToggle }: PostPreviewProps) {
  const [edits, setEdits] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerateClick = async () => {
    setIsRegenerating(true);
    await onRegenerate(post.id, edits);
    setEdits('');
    setIsRegenerating(false);
  };

  const handlePublishClick = () => {
    onPublish(post);
  };

  const handleDeleteClick = () => {
    onDelete(post.id);
  };
  
  const isContentLoading = post.content === '...';
  const displayImage = globalImageUri || post.image;

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="flex flex-row items-center justify-between space-x-0 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex flex-row items-center space-x-4 flex-1">
              <Avatar>
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">{post.platform} Post</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: {dimensions[post.platform].recommended} • {dimensions[post.platform].aspectRatio}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
              <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "transform rotate-180")} />
            </Button>
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
          <CardFooter className="bg-muted/50 p-4 flex flex-col items-start gap-4">
            <div className="w-full">
              <label htmlFor={`edits-${post.id}`} className="text-sm font-medium mb-2 block">
                Want changes? Tell the AI.
              </label>
              <Textarea
                id={`edits-${post.id}`}
                placeholder="e.g., 'Make it funnier,' 'add three hashtags,' 'target a younger audience'"
                value={edits}
                onChange={e => setEdits(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2">
              <Button
                onClick={handleRegenerateClick}
                disabled={isRegenerating}
                className="w-full"
              >
                {isRegenerating ? <Repeat className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isRegenerating ? 'Regenerating...' : 'Regenerate'}
              </Button>
              <Button onClick={handlePublishClick} variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Publish
              </Button>
              <Button onClick={handleDeleteClick} variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
