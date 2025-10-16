import apiClient from "../apiClient";

export interface GenerateSummaryResponse {
  summary: string;
  topics: string[];
  summaryId?: string; // Added for regenerate functionality
}

export interface RegenerateTextResponse {
  regeneratedContent: string;
}

export interface RegenerateTextRequest {
  "summary id": string;
  "content-type": string;
}

export interface ApproveSummaryResponse {
  message: string;
  approved: boolean;
}

export interface PlatformContent {
  platform_id: string;
  platform_name: string;
  post_text: string;
  image_url: string;
}

export interface GenerateContentResponse {
  summary_id: string;
  platforms: PlatformContent[];
  generated: boolean;
  message: string;
}

export const PostService = {
  generateSummary: async (topics: string[]): Promise<GenerateSummaryResponse> => {
    try {
      console.log('PostService.generateSummary called with topics:', topics);
      const topicString = topics.join(',');
      const response = await apiClient.post<GenerateSummaryResponse>("/posts/generate-summary", {
        topic: topicString
      });
      console.log('PostService.generateSummary response:', response);
      return response;
    } catch (error: any) {
      console.error('PostService.generateSummary error:', error);
      // Don't log to console to avoid popup errors - error handling is done via toast
      throw error;
    }
  },

  regenerateText: async (summaryId: string): Promise<RegenerateTextResponse> => {
    try {
      const response = await apiClient.post<RegenerateTextResponse>("/post/regenerate-text", {
        "summary id": summaryId,
        "content-type": "summary"
      });
      return response;
    } catch (error: any) {
      // Don't log to console to avoid popup errors - error handling is done via toast
      throw error;
    }
  },

  approveSummary: async (summary: string, summaryId: string): Promise<ApproveSummaryResponse> => {
    try {
      console.log('PostService.approveSummary called with summaryId:', summaryId);
      const response = await apiClient.post<ApproveSummaryResponse>("/posts/approve-summary", {
        summary: summary,
        summary_id: summaryId
      });
      console.log('PostService.approveSummary response:', response);
      return response;
    } catch (error: any) {
      console.error('PostService.approveSummary error:', error);
      throw error;
    }
  },

  generateContent: async (summaryId: string, platforms: string[]): Promise<GenerateContentResponse> => {
    try {
      console.log('PostService.generateContent called with summaryId:', summaryId, 'platforms:', platforms);
      const response = await apiClient.post<GenerateContentResponse>("/posts/generate-content", {
        summary_id: summaryId,
        platforms: platforms
      });
      console.log('PostService.generateContent response:', response);
      return response;
    } catch (error: any) {
      console.error('PostService.generateContent error:', error);
      throw error;
    }
  },

  regeneratePostText: async (platformId: string, userSuggestions: string): Promise<{regenerated_content: string}> => {
    try {
      console.log('PostService.regeneratePostText called with platformId:', platformId, 'userSuggestions:', userSuggestions);
      const response = await apiClient.post<{regenerated_content: string}>("/posts/regenerate-text", {
        platform_id: platformId,
        user_suggestions: userSuggestions,
        content_type: "post"
      });
      console.log('PostService.regeneratePostText response:', response);
      return response;
    } catch (error: any) {
      console.error('PostService.regeneratePostText error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack
      });
      throw error;
    }
  },

  regeneratePostImage: async (platformId: string, userSuggestions: string): Promise<{image_url: string}> => {
    try {
      console.log('PostService.regeneratePostImage called with platformId:', platformId, 'userSuggestions:', userSuggestions);
      const response = await apiClient.post<{image_url: string}>("/posts/regenerate-image", {
        platform_id: platformId,
        user_suggestions: userSuggestions
      });
      console.log('PostService.regeneratePostImage response:', response);
      return response;
    } catch (error: any) {
      console.error('PostService.regeneratePostImage error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack
      });
      throw error;
    }
  },
};
