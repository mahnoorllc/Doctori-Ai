import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Doctori AI, your virtual health assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response with more realistic health assistant responses
    setTimeout(() => {
      let aiResponse = "I understand your concern. ";
      
      if (inputValue.toLowerCase().includes("headache") || inputValue.toLowerCase().includes("head")) {
        aiResponse += "Headaches can have various causes. Are you drinking enough water? Have you been under stress lately? For persistent headaches, I'd recommend consulting with a doctor.";
      } else if (inputValue.toLowerCase().includes("fever") || inputValue.toLowerCase().includes("temperature")) {
        aiResponse += "A fever usually indicates your body is fighting an infection. Make sure to stay hydrated and rest. If your fever is above 101.3°F (38.5°C) or persists, please see a healthcare provider.";
      } else if (inputValue.toLowerCase().includes("cough") || inputValue.toLowerCase().includes("cold")) {
        aiResponse += "Coughs can be caused by various factors including allergies, infections, or irritants. If it persists for more than a week or you have other symptoms, consider seeing a doctor.";
      } else {
        aiResponse += "Based on what you've described, I'd recommend monitoring your symptoms. If they persist or worsen, please consult with a healthcare professional.";
      }
      
      aiResponse += " Would you like me to help you find a doctor near you?";
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
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
    <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-float z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-primary rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-white" />
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

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-2 ${
              message.isUser ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div
              className={`p-2 rounded-full ${
                message.isUser ? "bg-primary text-white" : "bg-muted"
              }`}
            >
              {message.isUser ? (
                <User className="h-3 w-3" />
              ) : (
                <Bot className="h-3 w-3" />
              )}
            </div>
            <div
              className={`p-3 rounded-lg max-w-[200px] text-sm ${
                message.isUser
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-muted rounded-bl-none"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your health question..."
            className="flex-1"
          />
          <Button variant="medical" size="icon" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};