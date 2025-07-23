
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Bot, User, AlertTriangle, Phone, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatSession } from "@/hooks/useChatSession";
import { useAuth } from "@/hooks/useAuth";

const Chat = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { sessionState, sendMessage, initializeChat } = useChatSession();

  useEffect(() => {
    if (!loading) {
      initializeChat();
    }
  }, [loading, initializeChat]);

  const handleSendMessage = () => {
    const inputElement = document.querySelector('textarea') as HTMLTextAreaElement;
    const content = inputElement?.value.trim();
    if (!content) return;
    
    sendMessage(content);
    inputElement.value = '';
  };

  const handleViewSummary = () => {
    navigate("/chat-summary");
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

  if (!user) {
    return (
      <div className="min-h-screen bg-muted/20 py-8 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">
              Please log in to start a secure chat session with Doctori AI.
            </p>
            <Button 
              onClick={() => navigate('/login')}
              variant="medical"
              className="w-full"
            >
              Log In to Continue
            </Button>
          </CardContent>
        </Card>
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
              <span>Chat with Doctori AI</span>
            </CardTitle>
            <p className="text-white/90 text-sm">
              Your personal AI health assistant - Always here to help
            </p>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {sessionState.messages.map((message) => (
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
              
              {sessionState.isLoading && (
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
              {sessionState.phase === "summary" ? (
                <div className="space-y-4">
                  <Button 
                    onClick={handleViewSummary}
                    variant="medical" 
                    size="lg" 
                    className="w-full"
                  >
                    View Your Health Summary & Recommended Doctors
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Emergency? Need immediate help?
                    </p>
                    <Button variant="destructive" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call 911
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Textarea
                      onKeyPress={handleKeyPress}
                      placeholder="Describe your symptoms in detail..."
                      className="flex-1 min-h-[60px]"
                      disabled={sessionState.isLoading}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      variant="medical" 
                      size="icon"
                      className="self-end"
                      disabled={sessionState.isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {(sessionState.urgencyLevel === "high" || sessionState.urgencyLevel === "emergency") && (
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
                      ⚠️ This AI assistant provides general information only and is not a substitute for professional medical advice.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
