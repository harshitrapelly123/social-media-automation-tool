'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { PostAutomationPlatformIcon } from '@/components/app/post-automation-platform-icon';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { Sparkles, Wand2, Plus, X } from 'lucide-react';

export default function CreatePostPage() {
  const router = useRouter();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [manualTopic, setManualTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [addedTopics, setAddedTopics] = useState<string[]>([]);

  // 12 default trending topics
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

  // Combine default topics with manually added topics
  const allTopics = [...defaultTopics, ...addedTopics];

  const handleTopicToggle = (topic: string) => {
    const isCurrentlySelected = selectedTopics.includes(topic);
    const isAddedTopic = addedTopics.includes(topic);

    if (isCurrentlySelected) {
      // Deselecting a topic
      setSelectedTopics(prev => prev.filter(t => t !== topic));

      // If it's a manually added topic, remove it from addedTopics as well
      if (isAddedTopic) {
        setAddedTopics(prev => prev.filter(t => t !== topic));
      }
    } else {
      // Selecting a topic
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

  const handleRemoveTopic = (topic: string) => {
    setSelectedTopics(prev => prev.filter(t => t !== topic));
  };

  const handleGenerateSummary = async () => {
    if (selectedTopics.length === 0) return;

    setIsGenerating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Save data for the generated summary page
    if (typeof window !== 'undefined') {
      localStorage.setItem('generatedSummaryData', JSON.stringify({
        selectedTopics,
        timestamp: new Date().toISOString()
      }));
    }

    // Redirect to generated summary page
    router.push('/generated-summary');

    setIsGenerating(false);
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
        {/* Dashboard-style Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-4 backdrop-blur-sm md:px-6 lg:px-8">
          <div className="flex items-center gap-2 mr-4">
            <div className="h-8 w-8 md:h-10 md:w-10">
              <PostAutomationPlatformIcon />
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
              <Link href="/topics">Topics</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="whitespace-nowrap transition-all duration-300"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </nav>

          <div className="ml-auto flex items-center gap-2 md:gap-4">
            {/* <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-2 shadow-xl">
                <Wand2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 dark:from-slate-200 dark:via-blue-200 dark:to-slate-200 bg-clip-text text-transparent">
                Create Post
              </h1>
            </div> */}

            <ThemeToggle />
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <div className="max-w-4xl mx-auto">
            {/* Centered Icon and Title */}
            <div className="text-center py-8 mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-xl">
                <Wand2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 dark:from-slate-200 dark:via-blue-200 dark:to-slate-200 bg-clip-text text-transparent mb-4">
                Create Post
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Select your topics and generate engaging summaries with AI
              </p>
            </div>

            <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-0 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50">
              <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                Select Your Topics
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* All Topics Grid */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {addedTopics.length > 0 ? 'All Topics' : 'Trending Topics'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                      <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                        selectedTopics.includes(topic)
                          ? 'bg-white dark:bg-slate-700 border-blue-300 dark:border-blue-600 shadow-lg shadow-blue-500/20 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20'
                          : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-blue-300 hover:bg-blue-50/30 dark:hover:bg-slate-600'
                      }`}>
                        {/* Selection Indicator */}
                        {selectedTopics.includes(topic) && (
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse" />
                        )}

                        <div className="relative">
                          <span className={`font-medium transition-colors duration-300 block ${
                            selectedTopics.includes(topic)
                              ? 'text-slate-800 dark:text-slate-200'
                              : 'text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          }`}>
                            {topic}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manual Topic Input */}
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
                    onKeyPress={(e) => e.key === 'Enter' && handleAddManualTopic()}
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

              {/* Generate Summary Button */}
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

              {/* Premium Features */}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
  );
}
