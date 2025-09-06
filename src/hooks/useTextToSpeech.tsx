import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TTSOptions {
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  autoPlay?: boolean;
}

export const useTextToSpeech = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const generateSpeech = useCallback(async (text: string, options: TTSOptions = {}) => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "No text provided for speech generation",
        variant: "destructive"
      });
      return null;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: text.trim(),
          voice: options.voice || 'alloy'
        }
      });

      if (error) {
        console.error('TTS error:', error);
        throw new Error(error.message || 'Failed to generate speech');
      }

      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }

      // Convert base64 to blob
      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Auto-play if requested
      if (options.autoPlay) {
        await playAudio(audioUrl);
      }

      return audioUrl;

    } catch (error: any) {
      console.error('Text-to-speech error:', error);
      toast({
        title: "Speech Generation Failed",
        description: error.message || "Unable to generate speech. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const playAudio = useCallback(async (audioUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      
      setIsPlaying(true);
      
      audio.onended = () => {
        setIsPlaying(false);
        resolve();
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        reject(new Error('Audio playback failed'));
      };
      
      audio.play().catch(reject);
    });
  }, []);

  const speak = useCallback(async (text: string, options: TTSOptions = {}) => {
    const audioUrl = await generateSpeech(text, { ...options, autoPlay: true });
    return audioUrl;
  }, [generateSpeech]);

  return {
    generateSpeech,
    speak,
    playAudio,
    isGenerating,
    isPlaying,
    isActive: isGenerating || isPlaying
  };
};