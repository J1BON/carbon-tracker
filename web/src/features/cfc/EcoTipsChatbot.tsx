import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, Bot, User, Lightbulb } from "lucide-react";

interface Message {
  type: "user" | "bot";
  text: string;
}

// Simple rule-based responses
const getBotResponse = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();

  // CFC reduction keywords
  if (
    lowerInput.includes("reduce cfc") ||
    lowerInput.includes("how to reduce") ||
    lowerInput.includes("prevent cfc")
  ) {
    return "To reduce CFC emissions, use modern appliances with R-600a or R-290 refrigerants, maintain your AC and refrigerator regularly to prevent leaks, and ensure proper disposal through certified recycling facilities. Report any leaks immediately!";
  }

  // Gas leak keywords
  if (
    lowerInput.includes("gas leak") ||
    lowerInput.includes("refrigerant leak") ||
    lowerInput.includes("cfc leak")
  ) {
    return "If you suspect a CFC gas leak: 1) Turn off the appliance immediately, 2) Ventilate the area, 3) Contact a certified technician, 4) Report it through our system. Don't try to repair it yourself - refrigerants can be dangerous!";
  }

  // Alternatives keywords
  if (
    lowerInput.includes("alternative") ||
    lowerInput.includes("replace") ||
    lowerInput.includes("safe refrigerant")
  ) {
    return "Safe alternatives to CFCs include R-600a (isobutane) and R-290 (propane). These have zero ozone depletion potential and very low global warming potential. Look for appliances labeled 'CFC-free' or using these refrigerants.";
  }

  // Disposal keywords
  if (
    lowerInput.includes("dispose") ||
    lowerInput.includes("old appliance") ||
    lowerInput.includes("throw away")
  ) {
    return "When disposing of old appliances: Never throw them in regular trash. Contact certified recycling facilities that can safely extract CFCs. Many appliance stores offer take-back programs. Proper disposal prevents CFCs from entering the atmosphere.";
  }

  // Servicing keywords
  if (
    lowerInput.includes("service") ||
    lowerInput.includes("maintain") ||
    lowerInput.includes("repair")
  ) {
    return "Regular servicing helps prevent CFC leaks. Have a certified technician check your AC and refrigerator annually. They can detect leaks early and repair them before significant emissions occur. Prevention is key!";
  }

  // General eco tips
  if (
    lowerInput.includes("eco") ||
    lowerInput.includes("environment") ||
    lowerInput.includes("green") ||
    lowerInput.includes("sustainable")
  ) {
    return "Here are eco-friendly tips: Use energy-efficient appliances, maintain them regularly, choose CFC-free alternatives, recycle properly, and report any environmental concerns. Every small action helps protect our planet!";
  }

  // Default response
  return "I'm here to help with CFC-related questions! Try asking about: reducing CFC emissions, gas leaks, safe alternatives, disposal, or servicing. How can I help you today?";
};

export default function EcoTipsChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      text: "Hello! I'm your Eco Tips Helper. I can help you with questions about CFCs, gas leaks, alternatives, disposal, and more. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        type: "bot",
        text: getBotResponse(input),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Eco Tips Helper</h1>
          <p className="text-gray-300">
            Get instant answers to your CFC and environmental questions
          </p>
        </div>

        <div className="glass-card rounded-2xl border border-white/10 shadow-lg">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
                <Bot className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Chat with Eco Helper</h2>
                <p className="text-sm text-gray-300 mt-1">
                  Ask about CFCs, gas leaks, alternatives, disposal, or eco tips
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {/* Messages Area */}
            <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.type === "bot" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/10 border border-emerald-400/20 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-emerald-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                        : "bg-white/5 text-white border border-white/10"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  {message.type === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question here... (e.g., 'How to reduce CFC?' or 'What to do about gas leak?')"
                className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-emerald-500/50"
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim()}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-white">Quick Tips</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "How to reduce CFC?",
                  "What to do about gas leak?",
                  "Safe alternatives?",
                  "How to dispose appliances?",
                ].map((tip) => (
                  <button
                    key={tip}
                    onClick={() => setInput(tip)}
                    className="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-300 hover:text-white transition-colors"
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="glass-card mt-6 rounded-2xl border border-white/10 shadow-lg bg-blue-500/10">
          <div className="p-6">
            <p className="text-sm text-gray-300">
              <strong className="text-white">Note:</strong> This is a simple rule-based chatbot. For complex questions or
              urgent issues, please consult a certified technician or environmental expert.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

