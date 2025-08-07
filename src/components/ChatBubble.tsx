import React from 'react';
import { ChatMessage } from '@/hooks/useDoctorAIFlow';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, AlertTriangle, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  message: ChatMessage;
  onAgeSubmit?: (age: number) => void;
  onGenderSubmit?: (gender: string) => void;
  onConsent?: () => void;
  onDownloadSummary?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  onAgeSubmit,
  onGenderSubmit,
  onConsent,
  onDownloadSummary
}) => {
  const [ageInput, setAgeInput] = React.useState('');
  const [genderInput, setGenderInput] = React.useState('');
  const [consentChecked, setConsentChecked] = React.useState(false);

  const isUser = message.role === 'user';
  const isUrgent = message.messageType === 'emergency_notice' || message.isUrgent;

  const handleAgeSubmit = () => {
    const age = parseInt(ageInput);
    if (age > 0 && age <= 120 && onAgeSubmit) {
      onAgeSubmit(age);
      setAgeInput('');
    }
  };

  const handleGenderSubmit = (value: string) => {
    setGenderInput(value);
    if (onGenderSubmit) {
      onGenderSubmit(value);
    }
  };

  const handleConsentSubmit = () => {
    if (consentChecked && onConsent) {
      onConsent();
    }
  };

  const renderSpecialContent = () => {
    switch (message.messageType) {
      case 'age_collection':
        return (
          <div className="mt-3 space-y-3">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter your age"
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)}
                min="1"
                max="120"
                className="flex-1"
              />
              <Button onClick={handleAgeSubmit} disabled={!ageInput}>
                Submit
              </Button>
            </div>
          </div>
        );

      case 'gender_collection':
        return (
          <div className="mt-3">
            <Select value={genderInput} onValueChange={handleGenderSubmit}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your biological sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 'consent':
        return (
          <div className="mt-3 space-y-4">
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent"
                    checked={consentChecked}
                    onCheckedChange={(checked) => setConsentChecked(checked === true)}
                  />
                  <label
                    htmlFor="consent"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I agree to the Doctor AI Terms of Service and will discuss all Doctor AI output with a doctor.
                  </label>
                </div>
              </CardContent>
            </Card>
            <Button 
              onClick={handleConsentSubmit} 
              disabled={!consentChecked}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        );

      case 'summary':
        return (
          <div className="mt-3">
            <Button 
              onClick={onDownloadSummary} 
              className="flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Download Summary as PDF
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-3 shadow-sm",
        isUser 
          ? "bg-primary text-primary-foreground ml-12" 
          : "bg-card text-card-foreground mr-12",
        isUrgent && "border-2 border-destructive bg-destructive/10"
      )}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
            <Heart className="h-3 w-3 text-primary" />
            <span>Doctor AI</span>
          </div>
        )}
        
        {isUrgent && (
          <div className="flex items-center gap-2 mb-2 text-destructive font-semibold">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Important Notice</span>
          </div>
        )}
        
        <div className={cn(
          "prose prose-sm max-w-none",
          isUser ? "prose-invert" : "",
          message.messageType === 'summary' && "whitespace-pre-line font-mono text-xs"
        )}>
          {message.content}
        </div>
        
        {renderSpecialContent()}
        
        <div className={cn(
          "text-xs mt-2 opacity-70",
          isUser ? "text-right" : "text-left"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};