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
import { Terminal, ChevronDown, ChevronUp, Smartphone, Monitor, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

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

  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [expandAllMode, setExpandAllMode] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Editing panel state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingMode, setEditingMode] = useState<'text' | 'image' | null>(null);
  const [editingDescription, setEditingDescription] = useState('');


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
          imageUri: undefined,
        });

        const updatedImage = originalPost.image;

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
    [posts, topics, toast]
  );

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

  // Editing panel handlers
  const handleStartEditing = (postId: string, mode: 'text' | 'image') => {
    setEditingPostId(postId);
    setEditingMode(mode);
    setEditingDescription('');
  };

  const handleCloseEditing = () => {
    setEditingPostId(null);
    setEditingMode(null);
    setEditingDescription('');
  };

  const handleGenerateEdit = async () => {
    if (!editingPostId || !editingMode || !editingDescription.trim()) return;

    const postIndex = posts.findIndex(p => p.id === editingPostId);
    if (postIndex === -1) return;

    const originalPost = posts[postIndex];

    try {
      if (editingMode === 'text') {
        // Handle text editing
        setPosts(prev =>
          prev.map(p => (p.id === editingPostId ? { ...p, content: '...' } : p))
        );

        const result = await regeneratePostWithEdits({
          originalPost: originalPost.content,
          userEdits: editingDescription,
          topic: topics[0] || 'general',
          platform: originalPost.platform,
          imageUri: undefined,
        });

        setPosts(prev =>
          prev.map(p =>
            p.id === editingPostId
              ? {
                  ...originalPost,
                  content: result.regeneratedPost,
                }
              : p
          )
        );

        toast({
          title: 'Content Updated!',
          description: `Post content has been updated based on your instructions.`,
        });
      } else if (editingMode === 'image') {
        // Handle image editing - for now just show success message
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing

        toast({
          title: 'Image Updated!',
          description: `Post image has been updated based on your description.`,
        });
      }

      handleCloseEditing();
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Generation Error',
        description: 'Could not process your request. Please try again.',
      });

      // Reset loading state
      if (editingMode === 'text') {
        setPosts(prev =>
          prev.map(p => (p.id === editingPostId ? originalPost : p))
        );
      }
    }
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



  // Get the current post being edited
  const editingPost = editingPostId ? posts.find(p => p.id === editingPostId) : null;

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
            globalImageUri={undefined}
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
            onStartEditing={handleStartEditing}
          />
        ))}
      </div>

      {/* Editing Panel */}
      {editingPost && editingMode && (
        <div className="md:col-span-1">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Edit {editingPost.platform} Post</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseEditing}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mode Selection */}
              {!editingMode && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">What would you like to edit?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleStartEditing(editingPost.id, 'text')}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Text
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStartEditing(editingPost.id, 'image')}
                      className="flex items-center gap-2"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </Button>
                  </div>
                </div>
              )}

              {/* Text Editing Mode */}
              {editingMode === 'text' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Describe the text changes you want:
                    </label>
                    <Textarea
                      placeholder="e.g., 'Make it funnier,' 'add three hashtags,' 'target a younger audience'"
                      value={editingDescription}
                      onChange={e => setEditingDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button
                    onClick={handleGenerateEdit}
                    disabled={!editingDescription.trim()}
                    className="w-full"
                  >
                    Generate Updated Content
                  </Button>
                </div>
              )}

              {/* Image Editing Mode */}
              {editingMode === 'image' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Describe the image you want:
                    </label>
                    <Textarea
                      placeholder="e.g., 'A modern office workspace,' 'a happy family scene,' 'a futuristic cityscape'"
                      value={editingDescription}
                      onChange={e => setEditingDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button
                    onClick={handleGenerateEdit}
                    disabled={!editingDescription.trim()}
                    variant="outline"
                    className="w-full"
                  >
                    Generate New Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
