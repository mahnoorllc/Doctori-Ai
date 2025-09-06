import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useRoleBasedAuth } from '@/hooks/useRoleBasedAuth';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Crown,
  Loader2,
  Play,
  Square
} from 'lucide-react';

interface VoiceChatInterfaceProps {
  onVoiceMessage?: (message: string) => void;
  onSpeakText?: (text: string) => void;
  disabled?: boolean;
}

export const VoiceChatInterface: React.FC<VoiceChatInterfaceProps> = ({
  onVoiceMessage,
  onSpeakText,
  disabled = false
}) => {
  const { profile } = useRoleBasedAuth();
  const [selectedVoice, setSelectedVoice] = useState<'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'>('alloy');
  const [lastSpokenText, setLastSpokenText] = useState('');
  
  const {
    generateSpeech,
    speak,
    isGenerating,
    isPlaying,
    isActive: ttsActive
  } = useTextToSpeech();
  
  const {
    startRecording,
    stopRecording,
    reset,
    isRecording,
    isProcessing,
    transcript,
    isActive: sttActive
  } = useSpeechToText();

  // Check if user has premium access (simplified - you can add more complex logic)
  const isPremiumUser = profile?.role === 'admin' || profile?.role === 'provider';

  const handleStartRecording = useCallback(async () => {
    if (!isPremiumUser) return;
    
    reset();
    await startRecording({
      language: 'en', // You can make this configurable
      continuous: false
    });
  }, [isPremiumUser, startRecording, reset]);

  const handleStopRecording = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

  const handleSpeakText = useCallback(async (text: string) => {
    if (!isPremiumUser || !text.trim()) return;
    
    setLastSpokenText(text);
    await speak(text, { voice: selectedVoice });
    onSpeakText?.(text);
  }, [isPremiumUser, speak, selectedVoice, onSpeakText]);

  // Auto-send transcribed message
  React.useEffect(() => {
    if (transcript && !isProcessing && onVoiceMessage) {
      onVoiceMessage(transcript);
    }
  }, [transcript, isProcessing, onVoiceMessage]);

  if (!isPremiumUser) {
    return (
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <CardContent className="p-4 text-center">
          <Crown className="h-8 w-8 text-amber-600 mx-auto mb-2" />
          <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
            Premium Voice Features
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
            Upgrade to access voice chat with speech-to-text and text-to-speech capabilities
          </p>
          <Button variant="outline" size="sm" className="border-amber-400 text-amber-700">
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Voice Chat
            <Badge variant="secondary" className="text-xs">Premium</Badge>
          </div>
          
          <Select value={selectedVoice} onValueChange={(value) => setSelectedVoice(value as typeof selectedVoice)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alloy">Alloy</SelectItem>
              <SelectItem value="echo">Echo</SelectItem>
              <SelectItem value="fable">Fable</SelectItem>
              <SelectItem value="onyx">Onyx</SelectItem>
              <SelectItem value="nova">Nova</SelectItem>
              <SelectItem value="shimmer">Shimmer</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Voice Recording Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Speech to Text</h4>
            {(isRecording || isProcessing) && (
              <Badge variant="outline" className="text-xs">
                {isRecording ? 'Recording...' : 'Processing...'}
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            {!isRecording ? (
              <Button
                onClick={handleStartRecording}
                disabled={disabled || sttActive}
                variant="outline"
                className="flex-1"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Mic className="h-4 w-4 mr-2" />
                )}
                {isProcessing ? 'Processing...' : 'Start Recording'}
              </Button>
            ) : (
              <Button
                onClick={handleStopRecording}
                variant="destructive"
                className="flex-1"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Recording
              </Button>
            )}
            
            <Button
              onClick={reset}
              variant="outline"
              size="icon"
              disabled={!transcript && !isRecording}
            >
              <MicOff className="h-4 w-4" />
            </Button>
          </div>
          
          {transcript && (
            <div className="p-3 bg-secondary/50 rounded-md border">
              <p className="text-sm text-muted-foreground mb-1">Transcribed:</p>
              <p className="text-sm">{transcript}</p>
            </div>
          )}
        </div>

        {/* Text to Speech Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Text to Speech</h4>
            {(isGenerating || isPlaying) && (
              <Badge variant="outline" className="text-xs">
                {isGenerating ? 'Generating...' : 'Playing...'}
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => handleSpeakText("Hello! I'm your AI health assistant. How can I help you today?")}
              disabled={disabled || ttsActive}
              variant="outline"
              className="flex-1"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : isPlaying ? (
                <Volume2 className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? 'Generating...' : isPlaying ? 'Playing...' : 'Test Voice'}
            </Button>
            
            {lastSpokenText && (
              <Button
                onClick={() => handleSpeakText(lastSpokenText)}
                disabled={disabled || ttsActive}
                variant="outline"
                size="icon"
                title="Repeat last message"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {lastSpokenText && (
            <div className="p-3 bg-secondary/50 rounded-md border">
              <p className="text-sm text-muted-foreground mb-1">Last spoken:</p>
              <p className="text-sm">{lastSpokenText}</p>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${
              sttActive || ttsActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
            }`} />
            Voice features {sttActive || ttsActive ? 'active' : 'ready'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};