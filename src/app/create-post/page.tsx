'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PostAutomationPlatformIcon } from '@/components/app/post-automation-platform-icon';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { Sparkles, Wand2, Plus, ArrowLeft } from 'lucide-react';
import { PostService } from '@/lib/services/postService';
import { useToast } from '@/hooks/use-toast';

export default function CreatePostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [manualTopic, setManualTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [addedTopics, setAddedTopics] = useState<string[]>([]);

  const defaultTopics = [
    'Artificial Intelligence',
    'Climate Change',
    'Digital Marketing',
    'Remote Work',
    'Mental Health',
    'Sustainable Living',
    'Cryptocurrency',
    'Space Exploration',
    'Wellness & Fitness',
    'Personal Finance',
    'Future of Education',
    'Cybersecurity'
  ];

  const allTopics = [...defaultTopics, ...addedTopics];

  const handleTopicToggle = (topic: string) => {
    const isCurrentlySelected = selectedTopics.includes(topic);
    const isAddedTopic = addedTopics.includes(topic);

    if (isCurrentlySelected) {
      setSelectedTopics(prev => prev.filter(t => t !== topic));
      if (isAddedTopic) setAddedTopics(prev => prev.filter(t => t !== topic));
    } else {
      setSelectedTopics(prev => [...prev, topic]);
    }
  };

  const handleAddManualTopic = () => {
    const trimmedTopic = manualTopic.trim();
    if (trimmedTopic && !allTopics.includes(trimmedTopic)) {
      setAddedTopics(prev => [...prev, trimmedTopic]);
      setSelectedTopics(prev => [...prev, trimmedTopic]);
      setManualTopic('');
    }
  };

  const handleGenerateSummary = async () => {
    if (selectedTopics.length === 0 || isGenerating) return;

    console.log('Generate Summary button clicked - starting generation process');
    setIsGenerating(true);

    try {
      // Call the FastAPI backend to generate summary (only one call)
      console.log('Making API call to generate summary for topics:', selectedTopics);
      const response = await PostService.generateSummary(selectedTopics);
      console.log('API response received:', response);

      // Store the response data in localStorage for the next page
      if (typeof window !== 'undefined') {
        const summaryText = (response as any).summary_text ?? response.summary ?? '';
        console.log('Storing summary data in localStorage:', {
          selectedTopics,
          summary: summaryText,
          summaryId: (response as any).summary_id || response.summaryId,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem(
          'generatedSummaryData',
          JSON.stringify({
            selectedTopics,
            summary: summaryText,
            summaryId: (response as any).summary_id || response.summaryId,
            timestamp: new Date().toISOString(),
          })
        );
      }

      toast({
        title: 'Summary Generated!',
        description: 'Your AI-generated summary is ready.',
      });

      // Redirect to the generated summary page
      router.push('/generated-summary');
    } catch (error: any) {
      console.error('Error in handleGenerateSummary:', error);

      let errorMessage = 'Could not generate summary. Please try again.';

      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check if your FastAPI backend is running.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Generate summary endpoint not found. Please check your backend URL and endpoints.';
      } else if (error.response?.status === 422) {
        errorMessage = 'Invalid topic data. Please check your selected topics and try again.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please check your FastAPI backend logs.';
      } else if (error.response?.data?.detail) {
        errorMessage = (error.response.data as any)?.detail || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-indigo-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-4 backdrop-blur-sm md:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="flex items-center gap-2 mr-4">
            <div className="h-8 w-8 md:h-10 md:w-10">
              <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-headline text-lg md:text-xl font-semibold hidden sm:inline-block text-slate-800 dark:text-slate-200">
              Post Automation Platform
            </span>
          </div>

          <nav className="flex items-center gap-2 overflow-x-auto">
            <Button
              variant="ghost"
              asChild
              className="whitespace-nowrap transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl"
            >
              <Link href="/create-post">Create Post</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="whitespace-nowrap transition-all duration-300"
            >
              <Link href="/dashboard/analytics">Analytics</Link>
            </Button>
          </nav>

          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 px-2 pb-6 overflow-hidden">
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            {/* Header Section */}
            <div className="text-center py-4 mb-2 flex-shrink-0">

              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 dark:from-slate-200 dark:via-blue-200 dark:to-slate-200 bg-clip-text text-transparent mb-2">
                Select Your Topics
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Select your topics and generate engaging summaries with AI
              </p>
            </div>

            {/* Card Section */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-0 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 flex-1 flex flex-col min-h-0">
              <CardHeader className="text-center pb-0">
                
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
                {/* Topics Grid */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    {addedTopics.length > 0 ? 'All Topics' : 'Trending Topics'}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
                    {allTopics.map((topic, index) => (
                      <div
                        key={index}
                        className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedTopics.includes(topic)
                            ? 'transform scale-105'
                            : 'hover:shadow-lg'
                        }`}
                        onClick={() => handleTopicToggle(topic)}
                      >
                        <div
                          className={`relative p-2 md:p-3 rounded-lg border-2 transition-all duration-300 overflow-hidden ${
                            selectedTopics.includes(topic)
                              ? 'bg-white dark:bg-slate-700 border-blue-300 dark:border-blue-600 shadow-lg shadow-blue-500/20 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20'
                              : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-blue-300 hover:bg-blue-50/30 dark:hover:bg-slate-600'
                          }`}
                        >
                          {selectedTopics.includes(topic) && (
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse" />
                          )}
                          <div className="relative">
                            <span
                              className={`font-medium transition-colors duration-300 block text-sm ${
                                selectedTopics.includes(topic)
                                  ? 'text-slate-800 dark:text-slate-200'
                                  : 'text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                              }`}
                            >
                              {topic}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Custom Topic */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Add Custom Topic
                  </h3>
                  <div className="flex space-x-3">
                    <Input
                      placeholder="Enter your custom topic..."
                      value={manualTopic}
                      onChange={(e) => setManualTopic(e.target.value)}
                      className="flex-1 h-12 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                      onKeyPress={(e) =>
                        e.key === 'Enter' && handleAddManualTopic()
                      }
                    />
                    <Button
                      onClick={handleAddManualTopic}
                      disabled={!manualTopic.trim()}
                      className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex justify-center pt-8">
                  <Button
                    onClick={handleGenerateSummary}
                    disabled={selectedTopics.length === 0 || isGenerating}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 hover:from-blue-600 hover:via-purple-700 hover:to-indigo-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed px-12 py-4 text-lg font-semibold rounded-full"
                  >
                    <div className="flex items-center space-x-3">
                      {isGenerating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Generating Summary...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Generate Summary</span>
                          <Wand2 className="w-5 h-5" />
                        </>
                      )}
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
