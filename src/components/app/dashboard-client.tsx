'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { generateInitialPosts } from '@/ai/flows/generate-initial-posts';
import { regeneratePostWithEdits } from '@/ai/flows/regenerate-post-with-edits';
import type { Post, Platform, Topic } from '@/lib/types';
import PostPreview from './post-preview';
import LoadingSkeleton from './loading-skeleton';
import placeholderData from '@/lib/placeholder-images.json';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Terminal, UploadCloud, ChevronDown, ChevronUp, Smartphone, Monitor } from 'lucide-react';
import ImageUploader from './image-uploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';


const platforms: Platform[] = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'];
const { placeholderImages } = placeholderData;
const defaultTopics: Topic[] = ['Technology', 'Health & Wellness'];

interface DashboardClientProps {
  children: React.ReactNode;
}

export default function DashboardClient({
  children,
}: DashboardClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: userData } = useDoc(userDocRef);

  const topics = useMemo(() => {
    // First check if we have selected topics from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const localStorageTopics = localStorage.getItem('selectedTopics');
      if (localStorageTopics) {
        try {
          const parsedTopics = JSON.parse(localStorageTopics);
          if (parsedTopics.length > 0) {
            return parsedTopics;
          }
        } catch (error) {
          console.warn('Error parsing selectedTopics from localStorage:', error);
        }
      }
    }

    // Fall back to Firestore data
    if (user?.isAnonymous) {
      return defaultTopics;
    }
    if (userData?.preferenceIds?.length > 0) {
      return userData.preferenceIds;
    }
    return defaultTopics;
  }, [user, userData]);

  const [posts, setPosts] = useState<Post[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalImageUri, setGlobalImageUri] = useState<string | undefined>(
    undefined
  );
  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [expandAllMode, setExpandAllMode] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');


  const isGeneratorPage = pathname === '/dashboard';

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user auth state is resolved
    }
    if (!user) {
      router.push('/login');
      return;
    }

    if (isGeneratorPage && posts.length === 0) {
      setLoading(true);
      setError(null);
      generateInitialPosts({ topics, platforms })
        .then(result => {
          const newPosts: Post[] = result.posts.map((p, index) => {
            const randomImage = placeholderImages[index % placeholderImages.length];
            return {
              id: `${p.platform.toLowerCase()}-${Date.now()}`,
              platform: p.platform,
              content: p.content,
              image: randomImage.imageUrl,
              imageHint: randomImage.imageHint,
              author: {
                name: user.displayName || 'Post Automation Platform User',
                avatar: user.photoURL || 'https://picsum.photos/seed/user/40/40',
              },
            };
          });
          setPosts(newPosts);

          // Prevent auto-scroll by setting focus to body after posts are loaded
          setTimeout(() => {
            if (document.body) {
              document.body.focus();
            }
          }, 100);
        })
        .catch(e => {
          console.error(e);
          const errorMessage =
            e instanceof Error
              ? e.message
              : 'Could not generate posts. The AI service may be temporarily unavailable.';
          setError(
            `Failed to generate initial posts. Please try again later. Error: ${errorMessage}`
          );
          toast({
            variant: 'destructive',
            title: 'Generation Error',
            description: errorMessage,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
        setLoading(false);
    }
  }, [isUserLoading, user, isGeneratorPage, topics, router, toast, posts.length]);


  const memoizedChildren = useMemo(
    () =>
      React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            publishedPosts,
          })
        : children,
    [children, publishedPosts]
  );

  const handleDelete = useCallback(
    (postId: string) => {
      setPosts(prev => prev.filter(p => p.id !== postId));
      toast({
        variant: 'destructive',
        title: 'Post Deleted',
        description: 'The post has been removed.',
      });
    },
    [toast]
  );

  const handleRegenerate = useCallback(
    async (postId: string, edits: string) => {
      const postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex === -1) return;

      const originalPost = posts[postIndex];

      setPosts(prev =>
        prev.map(p => (p.id === postId ? { ...p, content: '...' } : p))
      );

      try {
        const result = await regeneratePostWithEdits({
          originalPost: originalPost.content,
          userEdits: edits,
          topic: topics[0] || 'general',
          platform: originalPost.platform,
          imageUri: globalImageUri,
        });

        const updatedImage = globalImageUri || originalPost.image;

        setPosts(prev =>
          prev.map(p =>
            p.id === postId
              ? {
                  ...originalPost,
                  content: result.regeneratedPost,
                  image: updatedImage,
                }
              : p
          )
        );

        toast({
          title: 'Post Regenerated!',
          description: `A new version for ${originalPost.platform} has been created.`,
        });
      } catch (e) {
        console.error(e);
        toast({
          variant: 'destructive',
          title: 'Regeneration Error',
          description: 'Could not regenerate post. Please try again.',
        });
        setPosts(prev =>
          prev.map(p => (p.id === postId ? originalPost : p))
        );
      }
    },
    [posts, topics, toast, globalImageUri]
  );

  const handleImageUpload = (imageUri: string) => {
    setGlobalImageUri(imageUri);
  };

  const handlePublish = (post: Post) => {
    setPublishedPosts(prev => {
      if (prev.find(p => p.id === post.id)) {
        return prev;
      }
      return [...prev, post];
    });
    toast({
      title: 'Post Published!',
      description: `Your post for ${post.platform} has been published.`,
    });
  };

  const handlePublishAll = () => {
    setPublishedPosts(currentPosts => {
      const newPosts = posts.filter(
        p => !currentPosts.some(cp => cp.id === p.id)
      );
      return [...currentPosts, ...newPosts];
    });
    toast({
      title: 'Publishing All Posts!',
      description: `Your posts for all platforms are being published.`,
    });
  };

  if (loading || isUserLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!isGeneratorPage) {
    return <>{memoizedChildren}</>;
  }

  const allPostsClosed = openPostId === null && !expandAllMode;

  const handleToggleAll = () => {
    if (allPostsClosed) {
      setExpandAllMode(true);
      setOpenPostId(null);
    } else {
      setExpandAllMode(false);
      setOpenPostId(null);
    }
  };



  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-2 space-y-8">
        {/* View Mode Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {viewMode === 'desktop' ? (
                <>
                  <Monitor className="h-3 w-3" />
                  Desktop View
                </>
              ) : (
                <>
                  <Smartphone className="h-3 w-3" />
                  Mobile View
                </>
              )}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className="flex items-center gap-1"
            >
              <Monitor className="h-3 w-3" />
              Desktop
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className="flex items-center gap-1"
            >
              <Smartphone className="h-3 w-3" />
              Mobile
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleAll}
              className="flex items-center gap-2"
            >
              {allPostsClosed ? (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Expand All
                </>
              ) : (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Collapse All
                </>
              )}
            </Button>
          </div>
        </div>
        {posts.map(post => (
          <PostPreview
            key={post.id}
            post={post}
            onRegenerate={handleRegenerate}
            onDelete={handleDelete}
            onPublish={handlePublish}
            globalImageUri={globalImageUri}
            isOpen={expandAllMode || openPostId === post.id}
            onToggle={() => {
              if (expandAllMode) {
                setExpandAllMode(false);
                setOpenPostId(post.id);
              } else if (openPostId === post.id) {
                setOpenPostId(null);
              } else {
                setOpenPostId(post.id);
              }
            }}
            viewMode={viewMode}
          />
        ))}
      </div>
      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Customization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm">
              Upload a single image to apply it across all generated posts, or
              publish everything at once.
            </p>
            <ImageUploader onImageUpload={handleImageUpload} />
            <div className="space-y-4">
              <div className="text-xs text-muted-foreground">
              </div>
              <Button onClick={handlePublishAll} className="w-full" size="lg">
                <UploadCloud className="mr-2" />
                Publish All Posts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
