'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopicsSelection } from '@/components/app/topics-selection';
import { PostAutomationPlatformIcon } from '@/components/app/post-automation-platform-icon';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Plus, Wand2, RefreshCw, CheckCircle } from 'lucide-react';

export default function TopicsPage() {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isButtonSticky, setIsButtonSticky] = useState(true);
  const formRef = useRef<HTMLDivElement>(null);
  const topicsSectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    topic: '',
    description: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string>('');
  const [showSummaryActions, setShowSummaryActions] = useState(false);
  const [inputsCollapsed, setInputsCollapsed] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const summaryRef = useRef<HTMLDivElement>(null);

  // Load saved data on component mount (from sessionStorage - cleared when tab closes)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem('createPostFormData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData.formData || { topic: '', description: '' });
          setGeneratedSummary(parsedData.generatedSummary || '');
          setShowSummaryActions(parsedData.showSummaryActions || false);
          setInputsCollapsed(parsedData.inputsCollapsed || false);
          setIsEditingSummary(parsedData.isEditingSummary || false);
          setEditedSummary(parsedData.editedSummary || '');
        } catch (error) {
          console.warn('Error loading saved form data:', error);
        }
      }
    }
  }, []);

  // Save form data whenever it changes (to sessionStorage - cleared when tab closes)
  useEffect(() => {
    if (typeof window !== 'undefined' && (formData.topic || formData.description)) {
      const dataToSave = {
        formData,
        generatedSummary,
        showSummaryActions,
        inputsCollapsed,
        isEditingSummary,
        editedSummary,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('createPostFormData', JSON.stringify(dataToSave));
    }
  }, [formData, generatedSummary, showSummaryActions, inputsCollapsed, isEditingSummary, editedSummary]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setShowCreateForm(true);
  };

  const generateDummySummary = (topic: string, description: string) => {
    return `Description

${description}

This comprehensive overview covers the essential aspects of ${topic.toLowerCase()}, providing valuable insights and practical guidance for better understanding and application in real-world scenarios.`;
  };

  const handleGenerateSummary = async () => {
    if (!formData.topic.trim() || !formData.description.trim()) return;

    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate dummy summary
    const summary = generateDummySummary(formData.topic, formData.description);
    setGeneratedSummary(summary);
    setShowSummaryActions(true);
    setInputsCollapsed(true); // Collapse inputs after generation
    setIsGenerating(false);
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Keep the same summary for now (as requested)
    // In the future, this could generate a new variation
    setGeneratedSummary(generatedSummary);
    setIsGenerating(false);
  };

  const handleEditSummary = () => {
    setEditedSummary(generatedSummary);
    setIsEditingSummary(true);
  };

  const handleSaveEdit = () => {
    setGeneratedSummary(editedSummary);
    setIsEditingSummary(false);
  };

  const handleCancelEdit = () => {
    setEditedSummary('');
    setIsEditingSummary(false);
  };

  const handleApprove = () => {
    // Store the summary data for the dashboard (use edited version if available)
    const finalSummary = editedSummary || generatedSummary;
    if (typeof window !== 'undefined') {
      localStorage.setItem('approvedSummary', JSON.stringify({
        topic: formData.topic,
        description: formData.description,
        summary: finalSummary,
        timestamp: new Date().toISOString()
      }));
    }

    // Redirect to dashboard
    router.push('/dashboard');
  };

  // Handle scroll to change button behavior
  useEffect(() => {
    const handleScroll = () => {
      if (topicsSectionRef.current) {
        const topicsBottom = topicsSectionRef.current.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;

        // If trending topics section is scrolled out of view, make button static
        if (topicsBottom < windowHeight * 0.3) {
          setIsButtonSticky(false);
        } else {
          setIsButtonSticky(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to summary when it's generated
  useEffect(() => {
    if (showSummaryActions && summaryRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [showSummaryActions]);

  return (
    <>
      <div className="absolute top-4 right-4 z-50">
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
          <div ref={topicsSectionRef} className="flex justify-center">
            <TopicsSelection />
          </div>

          {/* Conditional Button - Sticky or Static */}
          {isButtonSticky ? (
            /* Floating Create Post Button - Centered at bottom */
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
              <Button
                onClick={scrollToForm}
                size="lg"
                className="relative bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary/90 hover:to-primary/70 text-primary-foreground shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 border-0 px-8 py-4 text-lg font-semibold rounded-full group overflow-hidden backdrop-blur-sm bg-primary/95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span>Create Post</span>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              </Button>
            </div>
          ) : (
            /* Static Create Post Button - Right after trending topics */
            <div className="flex justify-center mt-8 animate-fade-in">
              <Button
                onClick={scrollToForm}
                size="lg"
                className="relative bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary/90 hover:to-primary/70 text-primary-foreground shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 border-0 px-8 py-4 text-lg font-semibold rounded-full group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span>Create Post</span>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              </Button>
            </div>
          )}

          {/* Footer hint */}
          
        </div>

        {/* Create Post Form Section */}
        <div ref={formRef} className={`w-full max-w-4xl mt-16 transition-all duration-700 ${showCreateForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none absolute'}`}>
          <Card className="backdrop-blur-sm bg-card/95 border-2 border-primary/20 shadow-2xl shadow-primary/10">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center border border-primary/20">
                <Wand2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Create Your Post
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Transform your ideas into engaging content with AI-powered summaries
                </CardDescription>
              </div>
              
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Collapsed Inputs View */}
              {inputsCollapsed && (
                <div className="space-y-4 p-6 bg-gradient-to-br from-muted/10 to-muted/5 rounded-xl border border-border/30 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Topic</span>
                        <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30 text-xs font-medium px-3 py-1">
                          {formData.topic}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide block">Description</span>
                        <p className="text-sm text-muted-foreground leading-relaxed pl-0">
                          {formData.description.length > 120
                            ? `${formData.description.substring(0, 120)}...`
                            : formData.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputsCollapsed(false)}
                      className="ml-6 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-xs font-medium">Expand</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Input Fields - Hidden when collapsed */}
              {!inputsCollapsed && (
                <div className="space-y-8">
                  {/* Topic Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
                      Topic
                    </label>
                    <Input
                      placeholder="Enter your main topic (e.g., Artificial Intelligence, Climate Change)"
                      value={formData.topic}
                      onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                      className="h-12 text-base border-2 border-border hover:border-primary/50 focus:border-primary transition-colors bg-background/50 backdrop-blur-sm"
                    />
                  </div>

                  {/* Description Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
                      Description
                    </label>
                    <Textarea
                      placeholder="Describe what you want to cover in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[120px] text-base border-2 border-border hover:border-primary/50 focus:border-primary transition-colors bg-background/50 backdrop-blur-sm resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleGenerateSummary}
                  disabled={!formData.topic.trim() || !formData.description.trim() || isGenerating}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 border-0 px-12 py-4 text-lg font-semibold rounded-full group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center space-x-3">
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Generating Summary...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        <span>Generate Summary</span>
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </>
                    )}
                  </div>
                </Button>
              </div>

              {/* Generated Summary Section */}
              {showSummaryActions && (
                <div ref={summaryRef} className="space-y-8 pt-8 border-t border-gradient-to-r from-transparent via-border to-transparent">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-foreground mb-6 tracking-wide">
                      Generated Summary
                    </h3>
                  </div>

                  {/* Summary Display / Edit Mode - Premium Design */}
                  <div className="relative bg-gradient-to-br from-background via-muted/20 to-background border border-border/60 rounded-2xl p-8 shadow-lg backdrop-blur-sm overflow-hidden">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />

                    {/* Content */}
                    <div className="relative">
                      {isEditingSummary ? (
                        /* Edit Mode */
                        <div className="space-y-6">
                          <Textarea
                            value={editedSummary}
                            onChange={(e) => setEditedSummary(e.target.value)}
                            className="min-h-[250px] text-base border-2 border-border hover:border-primary/50 focus:border-primary transition-colors bg-background/90 backdrop-blur-sm resize-none leading-relaxed"
                            placeholder="Edit your summary..."
                          />
                          <div className="flex justify-end space-x-3 pt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                              className="bg-background/60 border border-border hover:bg-muted/50"
                            >
                              <span className="font-medium">Cancel</span>
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              <span className="font-medium">Save Changes</span>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        /* Read-only Mode */
                        <div className="prose prose-lg max-w-none text-foreground leading-relaxed">
                          <div className="space-y-4 text-muted-foreground">
                            {generatedSummary.split('\n').map((line, index) => (
                              <p key={index} className={`${index === 0 ? 'font-semibold text-lg mb-6 text-foreground' : 'mb-4'} ${index > 0 ? 'leading-relaxed' : ''}`}>
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Decorative elements - only show in read-only mode */}
                    {!isEditingSummary && (
                      <>
                        <div className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full" />
                        <div className="absolute bottom-4 left-4 w-1 h-1 bg-secondary/40 rounded-full" />
                      </>
                    )}
                  </div>

                  {/* Action Buttons - Premium Layout */}
                  <div className="flex justify-center space-x-4 pt-6">
                    <Button
                      onClick={handleRegenerate}
                      disabled={isGenerating}
                      variant="outline"
                      size="lg"
                      className="bg-background/80 border-2 border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 px-6 py-3 rounded-xl"
                    >
                      <div className="flex items-center space-x-2">
                        {isGenerating ? (
                          <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                        <span className="font-medium">Regenerate</span>
                      </div>
                    </Button>

                    <Button
                      onClick={handleEditSummary}
                      variant="outline"
                      size="lg"
                      className="bg-background/80 border-2 border-blue-500/30 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-500/50 transition-all duration-300 px-6 py-3 rounded-xl"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="font-medium">Edit</span>
                      </div>
                    </Button>

                    <Button
                      onClick={handleApprove}
                      size="lg"
                      className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 text-white shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 border-0 px-6 py-3 rounded-xl"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Approve</span>
                      </div>
                    </Button>
                  </div>
                </div>
              )}

              {/* Premium Features Hint */}
              <div className="text-center pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-3">
                  ✨ Premium features included:
                </p>
                <div className="flex justify-center space-x-6 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>SEO Optimized</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Engaging Hooks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Call-to-Actions</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
