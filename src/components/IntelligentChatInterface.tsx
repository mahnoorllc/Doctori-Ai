import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { useDoctorAIFlow } from '@/hooks/useDoctorAIFlow';
import { ChatBubble } from './ChatBubble';
import { MedicalDisclaimer } from './MedicalDisclaimer';
import { PDFReportGenerator } from './PDFReportGenerator';

export const IntelligentChatInterface: React.FC = () => {
  const {
    state,
    processUserMessage,
    initializeChat,
    handleConsent
  } = useDoctorAIFlow();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize chat when component mounts
    if (state.messages.length === 0) {
      initializeChat();
    }
  }, [initializeChat, state.messages.length]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages]);

  useEffect(() => {
    // Focus input when not loading
    if (!state.isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || state.isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    await processUserMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAgeSubmit = (age: number) => {
    processUserMessage(age.toString());
  };

  const handleGenderSubmit = (gender: string) => {
    processUserMessage(gender);
  };

  const formatChatData = () => {
    return {
      sessionData: {
        symptoms: state.detectedSymptoms,
        urgencyLevel: state.urgencyLevel,
        userData: state.userData,
        sessionId: state.sessionId
      },
      chatMessages: state.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))
    };
  };

  const canSendMessage = (
    state.phase === 'welcome' ||
    state.phase === 'consent' ||
    state.phase === 'symptom_gathering' ||
    state.phase === 'dynamic_questions' ||
    (state.phase === 'age_gender' && (state.userData.age && state.userData.gender))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto max-w-4xl p-4 h-screen flex flex-col">
        {/* Header */}
        <Card className="mb-4 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-2xl font-bold text-primary flex items-center justify-center gap-2">
              🩺 Doctor AI Consultation
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Your private and personal AI health assistant
            </p>
          </CardHeader>
        </Card>

        {/* Chat Messages */}
        <Card className="flex-1 flex flex-col shadow-lg">
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-1">
                {state.messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    onAgeSubmit={handleAgeSubmit}
                    onGenderSubmit={handleGenderSubmit}
                    onConsent={handleConsent}
                    onDownloadSummary={() => {}} // Handled by PDF generator
                  />
                ))}
                
                {state.isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-card text-card-foreground rounded-lg px-4 py-3 shadow-sm mr-12 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Doctor AI is typing...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t bg-background p-4">
              {state.phase === 'summary' && (
                <div className="mb-4 flex justify-center">
                  <PDFReportGenerator
                    sessionData={formatChatData().sessionData}
                    chatMessages={formatChatData().chatMessages}
                    className="max-w-sm"
                  />
                </div>
              )}
              
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    !state.hasConsented 
                      ? "Type 'I agree' to consent and continue..."
                      : state.phase === 'symptom_gathering'
                      ? "Describe your symptoms or health concern..."
                      : state.phase === 'dynamic_questions'
                      ? "Please answer the question above..."
                      : "Type your message..."
                  }
                  onKeyPress={handleKeyPress}
                  disabled={state.isLoading || !canSendMessage}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || state.isLoading || !canSendMessage}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {!state.hasConsented && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Please consent to the terms to continue
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <MedicalDisclaimer />
    </div>
  );
};