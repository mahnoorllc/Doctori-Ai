import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useStructuredChat } from '@/hooks/useStructuredChat';
import { ChatSummaryScreen } from './ChatSummaryScreen';

export const StructuredChatInterface = () => {
  const {
    currentStep,
    answers,
    chatId,
    isCompleted,
    isLoading,
    totalSteps,
    createChatSession,
    updateAnswer,
    nextStep,
    previousStep,
    getCurrentQuestion,
    isCurrentStepValid,
    getProgress
  } = useStructuredChat();

  const [currentAnswer, setCurrentAnswer] = useState('');

  useEffect(() => {
    // Initialize chat session
    if (!chatId) {
      createChatSession();
    }
  }, [chatId, createChatSession]);

  useEffect(() => {
    // Update current answer when step changes
    const question = getCurrentQuestion();
    const savedAnswer = answers[question?.field as keyof typeof answers];
    setCurrentAnswer(savedAnswer?.toString() || '');
  }, [currentStep, answers, getCurrentQuestion]);

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
    const question = getCurrentQuestion();
    if (question) {
      const finalValue = question.type === 'number' ? parseInt(value) || 0 : value;
      updateAnswer(question.field, finalValue);
    }
  };

  const handleNext = () => {
    if (isCurrentStepValid()) {
      nextStep();
    }
  };

  if (isCompleted && chatId) {
    return <ChatSummaryScreen chatId={chatId} answers={answers} />;
  }

  const question = getCurrentQuestion();

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Setting up your health consultation</p>
        </div>
      </div>
    );
  }

  const renderInput = () => {
    switch (question.type) {
      case 'select':
        return (
          <Select value={currentAnswer} onValueChange={handleAnswerChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Please select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter your age"
            min="1"
            max="120"
            className="w-full"
          />
        );
      
      case 'text':
      default:
        if (question.id === 'mainSymptom' || question.id === 'additionalSymptoms') {
          return (
            <Textarea
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Please describe your symptoms..."
              className="w-full min-h-[120px] resize-none"
            />
          );
        }
        return (
          <Input
            type="text"
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Please enter your answer"
            className="w-full"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-primary">
                {getProgress()}% Complete
              </span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {question.question}
            </CardTitle>
            {question.required && (
              <p className="text-sm text-muted-foreground text-center">
                * This question is required
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {renderInput()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={previousStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isCurrentStepValid() || isLoading}
                className="flex items-center gap-2"
              >
                {currentStep === totalSteps - 1 ? (
                  <>
                    Complete
                    <Download className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            Your responses are confidential and will help provide personalized health guidance.
          </p>
        </div>
      </div>
    </div>
  );
};