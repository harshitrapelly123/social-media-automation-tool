'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PostAutomationPlatformIcon } from '@/components/app/post-automation-platform-icon';
import { ThemeToggle } from '@/components/app/theme-toggle';
import {
  Sparkles,
  Wand2,
  Edit3,
  RefreshCw,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  CheckCircle,
  Copy,
  Share2,
  ArrowLeft
} from 'lucide-react';

export default function GeneratedSummaryPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [editedSummary, setEditedSummary] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [generatedSummary, setGeneratedSummary] = useState('');

  // Load data from localStorage and generate summary
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem('generatedSummaryData');
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            setSelectedTopics(parsed.selectedTopics || []);
            await generateSummaryWithGemini(parsed.selectedTopics || [], '');
          } catch (error) {
            console.warn('Error loading saved data:', error);
            setSelectedTopics([]);
          }
        }
      }

      // Simulate loading time for smooth animation
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };

    loadData();
  }, []);

  const generateSummaryWithGemini = async (topics: string[], desc: string) => {
    try {
      // Try to use Gemini API if available
      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

      if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
        const prompt = `Create an engaging summary about ${topics.join(', ')}. ${desc ? `Additional context: ${desc}` : ''} Make it suitable for social media sharing with emojis and hashtags.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.candidates[0]?.content?.parts[0]?.text || 'No content generated';
          setGeneratedSummary(generatedText);
          setEditedSummary(generatedText);
          return;
        }
      }

      // Fallback to sample summary if API fails
      generateFallbackSummary(topics, desc);
    } catch (error) {
      console.error('Gemini API Error:', error);
      generateFallbackSummary(topics, desc);
    }
  };

  const generateFallbackSummary = (topics: string[], desc: string) => {
    const topicText = topics.length > 0 ? topics.join(' and ') : 'the selected topics';
    const summary = `🚀 Exciting insights about ${topicText}!

${desc || 'Exploring the latest trends and innovations that are shaping our digital future.'}

Key takeaways:
• Revolutionary approaches to modern challenges
• Enhanced productivity and efficiency gains
• Improved experiences across platforms
• Sustainable solutions for long-term growth

The future holds immense potential for those ready to embrace these innovations. Stay ahead of the curve!

#Innovation #${topics.join(' #').replace(/\s+/g, '')} #Future`;

    setGeneratedSummary(summary);
    setEditedSummary(summary);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setGeneratedSummary(editedSummary);
    setIsEditing(false);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('generatedSummaryData', JSON.stringify({
        selectedTopics,
        summary: editedSummary,
        timestamp: new Date().toISOString()
      }));
    }
  };

  const handleCancelEdit = () => {
    setEditedSummary(generatedSummary);
    setIsEditing(false);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await generateSummaryWithGemini(selectedTopics, '');
    setIsRegenerating(false);
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(generatedSummary);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShareToPlatforms = async () => {
    console.log('Sharing to platforms:', selectedPlatforms);
    console.log('Summary:', generatedSummary);

    // In a real app, this would integrate with each platform's API
    // For now, we'll simulate the sharing process

    // Save the final summary data to localStorage for the dashboard
    if (typeof window !== 'undefined') {
      localStorage.setItem('finalSummaryData', JSON.stringify({
        selectedTopics,
        summary: generatedSummary,
        selectedPlatforms,
        timestamp: new Date().toISOString()
      }));
    }

    // Redirect to dashboard
    router.push('/dashboard');
  };

  const platforms = [
    { id: 'twitter', name: 'X (Twitter)', icon: Twitter },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'facebook', name: 'Facebook', icon: Facebook }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-indigo-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Full Width Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-4 backdrop-blur-sm md:px-6 lg:px-8">
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
            <Link href="/dashboard">Generator</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="whitespace-nowrap transition-all duration-300"
          >
            <Link href="/dashboard/analytics">Analytics</Link>
          </Button>
        </nav>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <div className="relative z-10 flex w-full h-full mt-16 gap-3 pb-4 overflow-hidden">
        {/* Main Content Area - Full Width Initially */}
        <div className={`${selectedTopics.length > 0 && generatedSummary ? 'w-2/3' : 'w-full'} flex flex-col transition-all duration-500`}>
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'none' }}>
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Selected Topics */}
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Selected Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-7 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-full animate-pulse"
                          style={{
                            width: `${80 + (i * 15)}px`,
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '1.5s'
                          }}
                        />
                      ))}
                    </div>
                  ) : selectedTopics.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedTopics.map((topic, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-3 py-1 animate-fade-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-0 shadow-xl flex flex-col h-[calc(100vh-16rem)] mb-8">
                <CardHeader className="pb-4 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        <span>Your Generated Summary</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {isEditing ? 'Edit your summary content' : 'AI-generated summary ready for sharing'}
                      </CardDescription>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEdit}
                            className="flex items-center space-x-2"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRegenerate}
                            disabled={isRegenerating}
                            className="flex items-center space-x-2"
                          >
                            {isRegenerating ? (
                              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4" />
                            )}
                            <span>Regenerate</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 flex-1 overflow-y-auto">
                  {isEditing ? (
                    <Textarea
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      className="h-full text-base border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 bg-white dark:bg-slate-700 resize-none"
                      placeholder="Edit your summary..."
                    />
                  ) : isLoading ? (
                    <div className="h-full p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg space-y-4">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full animate-pulse" />
                        <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded animate-pulse w-48" />
                      </div>

                      {/* Summary content skeleton */}
                      <div className="space-y-3">
                        {[
                          { width: '85%', delay: '0.1s' },
                          { width: '92%', delay: '0.2s' },
                          { width: '78%', delay: '0.3s' },
                          { width: '88%', delay: '0.4s' },
                          { width: '76%', delay: '0.5s' },
                          { width: '82%', delay: '0.6s' }
                        ].map((line, i) => (
                          <div
                            key={i}
                            className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded animate-pulse"
                            style={{
                              width: line.width,
                              animationDelay: line.delay,
                              animationDuration: '1.5s'
                            }}
                          />
                        ))}
                      </div>

                      {/* Hashtags section */}
                      <div className="flex space-x-2 mt-6">
                        {[
                          { width: '60px', delay: '0.2s' },
                          { width: '75px', delay: '0.4s' },
                          { width: '55px', delay: '0.6s' }
                        ].map((hashtag, i) => (
                          <div
                            key={i}
                            className="h-5 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-full animate-pulse"
                            style={{
                              width: hashtag.width,
                              animationDelay: hashtag.delay,
                              animationDuration: '1.5s'
                            }}
                          />
                        ))}
                      </div>

                      {/* Loading indicator */}
                      <div className="flex items-center justify-center mt-8 space-x-3">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
                          Generating your summary...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-lg max-w-none h-full">
                      <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed h-full p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg animate-fade-in">
                        {generatedSummary}
                      </div>
                      {/* End indicator */}
                      <div className="flex justify-center mt-8 mb-8">
                        <div className="flex items-center space-x-3 text-slate-400 dark:text-slate-500">
                          <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
                          <span className="text-sm font-medium">End of Summary</span>
                          <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Platform Selection - Shows only after content is generated */}
        {selectedTopics.length > 0 && generatedSummary && (
          <div className="w-1/4 flex flex-col h-[calc(100vh-8rem)]">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
              <div className="text-center">
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Choose Platforms
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Select where to share your summary
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2" style={{ scrollbarWidth: 'none' }} >
              <div className="space-y-2 max-w-sm mx-auto">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatforms.includes(platform.id);

                  return (
                    <div
                      key={platform.id}
                      className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 ${
                        isSelected ? 'transform scale-105' : ''
                      }`}
                      onClick={() => handlePlatformToggle(platform.id)}
                    >
                      <div className={`p-2 rounded-lg border-2 transition-all duration-300 ${
                        isSelected
                          ? 'bg-white dark:bg-slate-700 border-blue-300 dark:border-blue-600 shadow-md shadow-blue-500/20 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20'
                          : 'bg-white/80 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-slate-600'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isSelected
                              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 group-hover:bg-blue-100 dark:group-hover:bg-slate-500'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-xs transition-colors duration-300 truncate ${
                              isSelected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-800 dark:text-slate-200'
                            }`}>
                              {platform.name}
                            </h3>
                            <p className={`text-xs transition-colors duration-300 ${
                              isSelected ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'
                            }`}>
                              {isSelected ? 'Selected' : 'Click to select'}
                            </p>
                          </div>

                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="flex-shrink-0">
                              <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Selection Summary */}
                {selectedPlatforms.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      ✨ Ready to share on {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''}: {selectedPlatforms.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
              <div className="flex justify-center">
                <Button
                  onClick={handleShareToPlatforms}
                  disabled={selectedPlatforms.length === 0}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 text-white border-0 shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 px-4 py-2 text-sm font-semibold rounded-full w-full max-w-xs"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Approve and Create Posts
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
