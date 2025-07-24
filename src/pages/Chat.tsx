import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Send, Bot, User, AlertTriangle, Phone, Shield, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatSession } from "@/hooks/useChatSession";
import { useGuestChat } from "@/hooks/useGuestChat";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

const Chat = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
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
    const inputElement = document.querySelector('textarea') as HTMLTextAreaElement;
    const content = inputElement?.value.trim();
    if (!content) return;
    
    chat.sendMessage(content);
    inputElement.value = '';
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

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container max-w-4xl mx-auto">
        <Card className="shadow-medical">
          <CardHeader className="bg-gradient-primary text-white">
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-6 w-6" />
              <span>{t('chat.title')}</span>
            </CardTitle>
            <p className="text-white/90 text-sm">
              {t('chat.subtitle')}
            </p>
            {!isAuthenticated && (
              <div className="bg-white/10 rounded-lg p-3 mt-2">
                <p className="text-white/90 text-sm">
                  💡 You're chatting as a guest. {t('auth.loginMessage')}
                </p>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {chat.sessionState.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      message.role === 'user' ? "bg-primary text-white" : "bg-muted"
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`p-4 rounded-lg max-w-md ${
                      message.role === 'user'
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-muted rounded-bl-none"
                    } ${message.isUrgent ? "border-2 border-red-500" : ""}`}
                  >
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
            <div className="p-6 border-t">
              {chat.sessionState.phase === "summary" || ('requiresAuth' in chat.sessionState && chat.sessionState.requiresAuth) ? (
                <div className="space-y-4">
                  <Button 
                    onClick={handleViewSummary}
                    variant="default" 
                    size="lg" 
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isAuthenticated ? 
                      'View Your Health Summary & Recommended Doctors' : 
                      'Get Your Health Summary (Login Required)'
                    }
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('chat.emergency')}
                    </p>
                    <Button variant="destructive" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      {t('chat.call911')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Textarea
                      onKeyPress={handleKeyPress}
                      placeholder={t('chat.placeholder')}
                      className="flex-1 min-h-[60px]"
                      disabled={chat.sessionState.isLoading}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      variant="default" 
                      size="icon"
                      className="self-end"
                      disabled={chat.sessionState.isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {(chat.sessionState.urgencyLevel === "high" || chat.sessionState.urgencyLevel === "emergency") && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="text-red-800 font-semibold">Emergency Alert</span>
                      </div>
                      <p className="text-red-700 text-sm mt-1">
                        If you're experiencing a medical emergency, please call 911 immediately.
                      </p>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      {t('chat.disclaimer')}
                    </p>
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
            <Button 
              onClick={() => navigate('/login')}
              className="w-full"
            >
              {t('auth.login')}
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              variant="outline"
              className="w-full"
            >
              {t('auth.signup')}
            </Button>
            <Button 
              onClick={() => setShowAuthDialog(false)}
              variant="ghost"
              className="w-full"
            >
              {t('auth.guestContinue')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;