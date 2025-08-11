
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, Bot, User, AlertTriangle, Phone, Shield, Download, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatSession } from "@/hooks/useChatSession";
import { useGuestChat } from "@/hooks/useGuestChat";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { isHealthRelated, getHealthFilterResponse } from '@/hooks/useHealthTopicFilter';

const Chat = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [chatLanguage, setChatLanguage] = useState(language);

  // Use guest chat by default, authenticated chat when logged in
  const authenticatedChat = useChatSession();
  const guestChat = useGuestChat();
  const isAuthenticated = user && !loading;
  const chat = isAuthenticated ? authenticatedChat : guestChat;

  useEffect(() => {
    if (!loading) {
      const welcomeMessage = t('chat.welcome');
      chat.initializeChat(welcomeMessage);
    }
  }, [loading, chat.initializeChat, t]);

  const handleSendMessage = () => {
    const content = messageInput.trim();
    if (!content) return;

    // Check if the message is health-related
    if (!isHealthRelated(content)) {
      // Add filter response as assistant message
      const filterMessage = {
        id: Date.now().toString(),
        content: getHealthFilterResponse(),
        role: 'assistant' as const,
        timestamp: new Date(),
        isUrgent: false
      };

      // Add the message to state (this is a simplified approach)
      chat.sendMessage("__FILTER_RESPONSE__" + content);
      setMessageInput('');
      return;
    }

    // Send message with language context
    chat.sendMessage(content);
    setMessageInput('');
  };

  const handleViewSummary = () => {
    if (isAuthenticated) {
      navigate("/chat-summary");
    } else {
      setShowAuthDialog(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const getPlaceholder = () => {
    if (chatLanguage === 'bn') {
      return "আপনার প্রধান স্বাস্থ্য সমস্যা শেয়ার করুন। আমি একবারে একটি প্রশ্ন জিজ্ঞাসা করব।";
    }
    return "Share your main health concern. I will ask one question at a time.";
  };

  return (
    <div className="min-h-screen bg-muted/20 py-4 md:py-8 px-4 md:px-0">
      <div className="container max-w-4xl mx-auto">
        <Card className="shadow-medical h-[calc(100vh-2rem)] md:h-auto">
          <CardHeader className="bg-gradient-primary text-white p-4 md:p-6 px-[20px]">
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
              <span>Doctori AI Health Assistant</span>
            </CardTitle>
            <p className="text-white/90 text-sm md:text-base">Professional health guidance with compassionate care</p>
            {!isAuthenticated && (
              <div className="bg-white/10 rounded-lg p-3 mt-2">
                <p className="text-white/90 text-xs md:text-sm">
                  💡 You're chatting as a guest. Create an account to save your health summary and get personalized doctor recommendations.
                </p>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[calc(100vh-12rem)] md:h-auto">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 min-h-[300px] md:h-96">
              {chat.sessionState.messages.map(message => (
                <div key={message.id} className={`flex items-start space-x-3 ${message.role === 'user' ? "flex-row-reverse space-x-reverse" : ""}`}>
                  <div className={`p-2 rounded-full ${message.role === 'user' ? "bg-primary text-white" : "bg-muted"}`}>
                    {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`p-4 rounded-lg max-w-md ${message.role === 'user' ? "bg-primary text-white rounded-br-none" : "bg-muted rounded-bl-none"} ${message.isUrgent ? "border-2 border-red-500" : ""}`}>
                    {message.isUrgent && (
                      <div className="flex items-center space-x-1 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <Badge variant="destructive">URGENT</Badge>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              
              {chat.sessionState.isLoading && (
                <div className="flex items-center space-x-2">
                  <div className="bg-muted p-2 rounded-full">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 border-t">
              {chat.sessionState.phase === "summary" || ('requiresAuth' in chat.sessionState && chat.sessionState.requiresAuth) ? (
                <div className="space-y-4">
                  <Button onClick={handleViewSummary} variant="default" size="lg" className="w-full text-sm md:text-base">
                    <Download className="h-4 w-4 mr-2" />
                    {isAuthenticated ? 'View Your Health Summary & Recommended Doctors' : 'Get Your Health Summary (Login Required)'}
                  </Button>
                  
                  {/* Emergency Call Button - Always Visible */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="text-red-800 font-semibold text-sm">EMERGENCY</span>
                    </div>
                    <p className="text-red-700 text-xs md:text-sm text-center mb-3">
                      If you're experiencing a medical emergency, call {chatLanguage === 'bn' ? '999' : '911'} immediately
                    </p>
                    <Button variant="destructive" size="sm" className="w-full" onClick={() => window.open(`tel:${chatLanguage === 'bn' ? '999' : '911'}`)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call {chatLanguage === 'bn' ? '999' : '911'} Emergency
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Emergency Alert - Always Visible */}
                  {(chat.sessionState.urgencyLevel === "high" || chat.sessionState.urgencyLevel === "emergency") && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="text-red-800 font-semibold text-sm">URGENT MEDICAL ATTENTION NEEDED</span>
                      </div>
                      <p className="text-red-700 text-xs md:text-sm mb-3">
                        Based on your symptoms, please seek immediate medical care. Call {chatLanguage === 'bn' ? '999' : '911'} or go to the nearest emergency room.
                      </p>
                      <Button variant="destructive" size="sm" className="w-full" onClick={() => window.open(`tel:${chatLanguage === 'bn' ? '999' : '911'}`)}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call {chatLanguage === 'bn' ? '999' : '911'} Emergency
                      </Button>
                    </div>
                  )}
                  
                  {/* Language Selector */}
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Select value={chatLanguage} onValueChange={setChatLanguage}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="bn">বাংলা</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Textarea 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress} 
                      placeholder={getPlaceholder()}
                      className="flex-1 min-h-[60px] text-sm md:text-base resize-none" 
                      disabled={chat.sessionState.isLoading} 
                    />
                    <Button onClick={handleSendMessage} variant="default" size="icon" className="self-end h-[60px] w-12 md:w-14" disabled={chat.sessionState.isLoading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Medical Disclaimer - Always Visible */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-center">
                      <p className="text-xs md:text-sm text-blue-800 mb-1">
                        ℹ️ <strong>Medical Disclaimer</strong>
                      </p>
                      <p className="text-xs text-blue-700">
                        This AI provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for personal health concerns.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>{t('auth.loginRequired')}</span>
            </DialogTitle>
            <DialogDescription>
              {t('auth.loginMessage')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-3">
            <Button onClick={() => navigate('/login')} className="w-full">
              {t('auth.login')}
            </Button>
            <Button onClick={() => navigate('/login')} variant="outline" className="w-full">
              {t('auth.signup')}
            </Button>
            <Button onClick={() => setShowAuthDialog(false)} variant="ghost" className="w-full">
              {t('auth.guestContinue')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;
