
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Bot, User, AlertTriangle, Clock, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isUrgent?: boolean;
}

interface ChatState {
  phase: "initial" | "followup" | "analysis" | "summary";
  symptoms: string[];
  followupAnswers: Record<string, string>;
  specialty: string;
  urgency: "low" | "medium" | "high";
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Doctori AI, your personal health assistant. I'm here to help you understand your symptoms and connect you with the right healthcare providers. Please describe your symptoms or health concerns in detail.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    phase: "initial",
    symptoms: [],
    followupAnswers: {},
    specialty: "",
    urgency: "low",
  });

  const symptomToSpecialty = {
    chest: "Cardiologist",
    heart: "Cardiologist",
    headache: "General Practice",
    fever: "General Practice",
    cough: "General Practice",
    stomach: "General Practice",
    pain: "General Practice",
    child: "Pediatrics",
    baby: "Pediatrics",
    skin: "Dermatology",
    mental: "Psychiatry",
    anxiety: "Psychiatry",
    depression: "Psychiatry",
  };

  const urgentSymptoms = [
    "chest pain", "severe headache", "difficulty breathing", "unconscious",
    "severe bleeding", "stroke", "heart attack", "emergency"
  ];

  const analyzeSymptoms = (text: string) => {
    const lowerText = text.toLowerCase();
    const detectedSymptoms = Object.keys(symptomToSpecialty).filter(symptom => 
      lowerText.includes(symptom)
    );
    
    const isUrgent = urgentSymptoms.some(urgent => lowerText.includes(urgent));
    const specialty = detectedSymptoms.length > 0 ? 
      symptomToSpecialty[detectedSymptoms[0] as keyof typeof symptomToSpecialty] : 
      "General Practice";
    
    return {
      symptoms: detectedSymptoms,
      specialty,
      urgency: isUrgent ? "high" : "medium",
    };
  };

  const getFollowupQuestions = (symptoms: string[]) => {
    const questions = [
      "How long have you been experiencing these symptoms?",
      "On a scale of 1-10, how would you rate your pain or discomfort?",
      "Are you taking any medications currently?",
      "Have you experienced these symptoms before?",
      "Do you have any known allergies or medical conditions?",
    ];
    return questions;
  };

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
    setIsTyping(true);

    // Process the message based on current phase
    setTimeout(() => {
      let aiResponse = "";
      let newChatState = { ...chatState };

      if (chatState.phase === "initial") {
        const analysis = analyzeSymptoms(inputValue);
        newChatState = {
          ...chatState,
          phase: "followup",
          symptoms: analysis.symptoms,
          specialty: analysis.specialty,
          urgency: analysis.urgency as "low" | "medium" | "high",
        };

        if (analysis.urgency === "high") {
          aiResponse = "⚠️ Based on your symptoms, this could be a serious condition. Please seek immediate medical attention by calling 911 or going to the nearest emergency room. Do not delay seeking care.";
        } else {
          aiResponse = `I understand you're experiencing ${analysis.symptoms.join(", ") || "these symptoms"}. To better help you, I need to ask a few follow-up questions. How long have you been experiencing these symptoms?`;
        }
      } else if (chatState.phase === "followup") {
        const questions = getFollowupQuestions(chatState.symptoms);
        const currentAnswers = Object.keys(chatState.followupAnswers).length;
        
        newChatState.followupAnswers[currentAnswers.toString()] = inputValue;
        
        if (currentAnswers < 2) {
          aiResponse = questions[currentAnswers + 1];
        } else {
          newChatState.phase = "analysis";
          aiResponse = "Thank you for providing that information. Let me analyze your symptoms and prepare a summary with recommendations...";
          
          // Trigger summary generation
          setTimeout(() => {
            generateSummary(newChatState);
          }, 2000);
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        isUrgent: newChatState.urgency === "high",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setChatState(newChatState);
      setIsTyping(false);
    }, 1500);
  };

  const generateSummary = (state: ChatState) => {
    const summaryData = {
      symptoms: state.symptoms,
      specialty: state.specialty,
      urgency: state.urgency,
      responses: state.followupAnswers,
      conversation: messages,
    };

    // Store in sessionStorage for the summary page
    sessionStorage.setItem("chatSummary", JSON.stringify(summaryData));

    const summaryMessage: Message = {
      id: (Date.now() + 2).toString(),
      text: `Based on our conversation, I've prepared a comprehensive summary of your symptoms and recommended healthcare providers. Click the button below to view your personalized health summary and connect with suitable doctors.`,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, summaryMessage]);
    setChatState({ ...state, phase: "summary" });
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
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.isUser ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      message.isUser ? "bg-primary text-white" : "bg-muted"
                    }`}
                  >
                    {message.isUser ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`p-4 rounded-lg max-w-md ${
                      message.isUser
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
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
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
              {chatState.phase === "summary" ? (
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
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe your symptoms in detail..."
                      className="flex-1 min-h-[60px]"
                      disabled={isTyping}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      variant="medical" 
                      size="icon"
                      className="self-end"
                      disabled={isTyping || !inputValue.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {chatState.urgency === "high" && (
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
