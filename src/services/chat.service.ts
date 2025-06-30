import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];

export interface ChatResponse {
  content: string;
  timestamp: string;
}

export interface ChatContext {
  chapterId: string;
  chapterTitle: string;
  chapterContent: string;
  bookTitle: string;
  authorName: string;
}

/**
 * Chat service interface for AI interactions
 * Currently implements a simple mock, but designed for easy integration with actual AI services
 */
class ChatService {
  /**
   * Send a message and get AI response
   */
  async sendMessage(
    userId: string,
    chapterId: string,
    message: string,
    context: ChatContext
  ): Promise<ChatResponse> {
    try {
      // Store user message
      await this.storeChatMessage(userId, chapterId, 'user', message);

      // Generate AI response (mock implementation)
      const aiResponse = await this.generateAIResponse(message, context);

      // Store AI response
      await this.storeChatMessage(userId, chapterId, 'bot', aiResponse.content);

      return aiResponse;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  /**
   * Get chat history for a chapter
   */
  async getChatHistory(userId: string, chapterId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter_id', chapterId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  /**
   * Store a chat message in the database
   */
  private async storeChatMessage(
    userId: string,
    chapterId: string,
    type: 'user' | 'bot',
    content: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          chapter_id: chapterId,
          type,
          content,
          timestamp: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error storing chat message:', error);
      throw error;
    }
  }

  /**
   * Generate AI response (mock implementation)
   * In production, this would integrate with Groq API or fine-tuned Llama models
   */
  private async generateAIResponse(message: string, context: ChatContext): Promise<ChatResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Mock responses based on context and message content
    const responses = [
      `That's a fascinating perspective on "${context.chapterTitle}"! In this chapter, I explore how ${this.extractKeyTheme(message, context)} relates to the broader themes of ${context.bookTitle}.`,
      
      `Great question about this section! What you're noticing here connects to the deeper meaning I was trying to convey about ${this.extractKeyTheme(message, context)}. Let me elaborate on that...`,
      
      `I'm glad you brought that up! This particular part of "${context.chapterTitle}" was inspired by ${this.generateInsight(context)}. What aspects resonate most with you?`,
      
      `Interesting observation! In writing this chapter, I wanted readers to consider ${this.generateThought(message, context)}. How does this connect with your own experiences?`,
      
      `That's exactly the kind of thinking I hoped this chapter would inspire! The relationship between ${this.extractKeyTheme(message, context)} and the overall narrative is something I explore further in later chapters.`,
    ];

    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      content: selectedResponse,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Extract key themes from user message for contextual responses
   */
  private extractKeyTheme(message: string, context: ChatContext): string {
    const themes = [
      'human creativity and technology',
      'the evolution of digital expression',
      'the intersection of art and innovation',
      'the future of creative collaboration',
      'the democratization of creative tools',
      'the balance between efficiency and authenticity',
    ];

    // Simple keyword matching for demo
    if (message.toLowerCase().includes('technology') || message.toLowerCase().includes('digital')) {
      return themes[0];
    }
    if (message.toLowerCase().includes('creative') || message.toLowerCase().includes('art')) {
      return themes[1];
    }
    if (message.toLowerCase().includes('future') || message.toLowerCase().includes('innovation')) {
      return themes[3];
    }

    return themes[Math.floor(Math.random() * themes.length)];
  }

  /**
   * Generate contextual insights
   */
  private generateInsight(context: ChatContext): string {
    const insights = [
      'my own experiences with emerging creative technologies',
      'conversations with artists and technologists',
      'observing how creative communities adapt to new tools',
      'research into the history of creative innovation',
      'the changing relationship between creators and their audiences',
    ];

    return insights[Math.floor(Math.random() * insights.length)];
  }

  /**
   * Generate thoughtful responses based on context
   */
  private generateThought(message: string, context: ChatContext): string {
    const thoughts = [
      'how traditional creative processes are being transformed',
      'the importance of maintaining human agency in creative work',
      'the potential for technology to amplify rather than replace creativity',
      'the ethical implications of AI in creative fields',
      'how we can preserve authenticity in an increasingly digital world',
    ];

    return thoughts[Math.floor(Math.random() * thoughts.length)];
  }

  /**
   * Synthesize chat conversation into chapter content
   */
  async synthesizeChat(userId: string, chapterId: string): Promise<string> {
    try {
      const chatHistory = await this.getChatHistory(userId, chapterId);
      
      // Extract bot responses (author insights)
      const botMessages = chatHistory
        .filter(msg => msg.type === 'bot')
        .map(msg => msg.content);

      if (botMessages.length === 0) {
        return 'No chat content to synthesize.';
      }

      // Create a synthesized summary
      const synthesis = `
## Insights from Our Conversation

Through our discussion, several key themes emerged:

${botMessages.map((msg, index) => `${index + 1}. ${msg}`).join('\n\n')}

These insights expand on the original chapter content and represent the kind of deeper exploration that becomes possible through interactive dialogue.
      `.trim();

      return synthesis;
    } catch (error) {
      console.error('Error synthesizing chat:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();