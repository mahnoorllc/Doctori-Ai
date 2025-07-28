import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VoiceChatWidgetProps {
  agentId?: string;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onResponse?: (text: string) => void;
  className?: string;
}

export const VoiceChatWidget: React.FC<VoiceChatWidgetProps> = ({
  agentId = 'demo-agent', // Default demo agent
  onTranscript,
  onResponse,
  className,
}) => {
  const [volume, setVolume] = useState([0.8]);
  const [showTranscript, setShowTranscript] = useState(true);

  const {
    isListening,
    isConnected,
    transcript,
    error,
    isSpeaking,
    status,
    startListening,
    stopListening,
    setVolume: setVoiceVolume,
  } = useVoiceChat({
    agentId,
    onTranscript,
    onResponse,
  });

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    setVoiceVolume(newVolume[0]);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Voice Assistant</span>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {status || 'disconnected'}
            </Badge>
            {isSpeaking && (
              <Badge variant="outline" className="animate-pulse">
                Speaking
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Voice Controls */}
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleListening}
            variant={isListening ? 'destructive' : 'default'}
            size="lg"
            className="flex-1"
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Voice Chat
              </>
            )}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <VolumeX className="h-4 w-4" />
            <Slider
              value={volume}
              onValueChange={handleVolumeChange}
              max={1}
              min={0}
              step={0.1}
              className="flex-1"
            />
            <Volume2 className="h-4 w-4" />
          </div>
          <p className="text-sm text-muted-foreground">
            Volume: {Math.round(volume[0] * 100)}%
          </p>
        </div>

        {/* Live Transcript */}
        {showTranscript && isListening && (
          <div className="space-y-2">
            <h4 className="font-medium">Live Transcript:</h4>
            <div className="min-h-[60px] p-3 bg-muted rounded-md">
              {transcript ? (
                <p className="text-sm">{transcript}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Listening... Start speaking to see transcript
                </p>
              )}
            </div>
          </div>
        )}

        {/* Connection Status */}
        <div className="text-xs text-muted-foreground">
          {isConnected ? (
            <span className="text-green-600">✓ Connected to voice assistant</span>
          ) : (
            <span>○ Ready to connect</span>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground border-t pt-2">
          <p>💡 <strong>Tip:</strong> Click "Start Voice Chat" and speak naturally about your health concerns. The AI will respond with voice and provide personalized health guidance.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceChatWidget;