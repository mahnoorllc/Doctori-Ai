import { useState, useCallback, useRef } from 'react';
import { useConversation } from '@11labs/react';

interface VoiceChatOptions {
  agentId?: string;
  apiKey?: string;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onResponse?: (text: string) => void;
  onError?: (error: string) => void;
}

export const useVoiceChat = (options: VoiceChatOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Voice chat connected');
      setIsConnected(true);
      setError(null);
    },
    onDisconnect: () => {
      console.log('Voice chat disconnected');
      setIsConnected(false);
      setIsListening(false);
    },
    onMessage: (message) => {
      console.log('Message received:', message);
      // Handle voice chat messages - simplified for demo
      setTranscript(message.message || '');
      options.onTranscript?.(message.message || '', true);
    },
    onError: (error) => {
      console.error('Voice chat error:', error);
      setError(typeof error === 'string' ? error : 'Voice chat error occurred');
      options.onError?.(typeof error === 'string' ? error : 'Unknown error');
      setIsListening(false);
    },
  });

  const startListening = useCallback(async () => {
    try {
      setError(null);
      
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start conversation with agent
      if (options.agentId) {
        conversationIdRef.current = await conversation.startSession({
          agentId: options.agentId,
        });
      } else {
        // Use a default public agent or throw error
        throw new Error('Agent ID is required for voice chat');
      }
      
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start voice chat:', error);
      setError(error instanceof Error ? error.message : 'Failed to start voice chat');
    }
  }, [conversation, options.agentId]);

  const stopListening = useCallback(async () => {
    try {
      await conversation.endSession();
      setIsListening(false);
      setTranscript('');
    } catch (error) {
      console.error('Failed to stop voice chat:', error);
    }
  }, [conversation]);

  const setVolume = useCallback(async (volume: number) => {
    try {
      await conversation.setVolume({ volume: Math.max(0, Math.min(1, volume)) });
    } catch (error) {
      console.error('Failed to set volume:', error);
    }
  }, [conversation]);

  return {
    isListening,
    isConnected,
    transcript,
    error,
    isSpeaking: conversation.isSpeaking,
    status: conversation.status,
    startListening,
    stopListening,
    setVolume,
    conversationId: conversationIdRef.current,
  };
};

export default useVoiceChat;