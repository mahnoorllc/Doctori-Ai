
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate("/chat");
  };

  if (!isOpen) {
    return (
      <Button
        variant="chat"
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-float z-50"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 shadow-float z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-primary rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-white" />
          <span className="font-medium text-white">Doctori AI</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="text-center">
          <h3 className="font-semibold mb-2">Hi! I'm Doctori AI</h3>
          <p className="text-sm text-muted-foreground mb-4">
            I'm here to help you understand your symptoms and connect you with the right healthcare providers.
          </p>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleStartChat}
            variant="medical" 
            className="w-full"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Start Health Chat
          </Button>
          
          <Button 
            onClick={() => navigate("/doctors")}
            variant="outline" 
            className="w-full"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Browse Doctors
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Available 24/7 • HIPAA Compliant • Free to use
          </p>
        </div>
      </div>
    </Card>
  );
};
