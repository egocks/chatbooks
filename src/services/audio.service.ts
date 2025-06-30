/**
 * Audio generation service using ElevenLabs API
 * Implements the abstraction layer pattern for future flexibility
 */

export interface AudioGenerationService {
  generateAudio(text: string, voiceId: string): Promise<AudioFile>;
  getAvailableVoices(): Promise<Voice[]>;
  generateChapterAudio(chapterId: string, text: string, voiceId: string): Promise<string>;
}

export interface Voice {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_url?: string;
}

export interface AudioFile {
  url: string;
  duration: number;
  size: number;
}

export interface AudioGenerationOptions {
  voice_id: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

class ElevenLabsAudioService implements AudioGenerationService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found. Audio generation will not work.');
    }
  }

  async generateAudio(text: string, voiceId: string): Promise<AudioFile> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.detail || response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        url: audioUrl,
        duration: 0, // Would need additional processing to get duration
        size: audioBlob.size,
      };
    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    }
  }

  async getAvailableVoices(): Promise<Voice[]> {
    if (!this.apiKey) {
      // Return default voices for demo purposes
      return [
        {
          id: 'EXAVITQu4vr4xnSDxMaL',
          name: 'Sarah (Professional Female)',
          category: 'premade',
          description: 'Professional, clear female voice perfect for narration',
        },
        {
          id: 'VR6AewLTigWG4xSOukaG',
          name: 'David (Professional Male)',
          category: 'premade',
          description: 'Authoritative male voice with excellent clarity',
        },
        {
          id: 'pNInz6obpgDQGcFmaJgB',
          name: 'Emma (Conversational Female)',
          category: 'premade',
          description: 'Warm, conversational female voice',
        },
        {
          id: 'yoZ06aMxZJJ28mfd3POQ',
          name: 'James (Conversational Male)',
          category: 'premade',
          description: 'Friendly, approachable male voice',
        },
      ];
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices.map((voice: any) => ({
        id: voice.voice_id,
        name: voice.name,
        category: voice.category,
        description: voice.description || `${voice.name} voice`,
        preview_url: voice.preview_url,
      }));
    } catch (error) {
      console.error('Error fetching voices:', error);
      // Return default voices as fallback
      return this.getAvailableVoices();
    }
  }

  async generateChapterAudio(chapterId: string, text: string, voiceId: string): Promise<string> {
    try {
      const audioFile = await this.generateAudio(text, voiceId);
      
      // In a real implementation, you would upload this to Supabase Storage
      // For now, we'll return the blob URL
      return audioFile.url;
    } catch (error) {
      console.error(`Error generating audio for chapter ${chapterId}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const audioService = new ElevenLabsAudioService();