import { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Heart,
  AlertTriangle,
  Clock,
  Lightbulb
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  petContext?: string;
  category?: 'general' | 'health' | 'behavior' | 'nutrition' | 'emergency';
}

const quickPrompts = [
  {
    category: 'health',
    icon: Heart,
    title: 'Health Check',
    prompt: 'What are signs of a healthy pet I should look for?'
  },
  {
    category: 'behavior',
    icon: Lightbulb,
    title: 'Behavior Tips',
    prompt: 'My pet has been acting differently lately. What should I observe?'
  },
  {
    category: 'nutrition',
    icon: Heart,
    title: 'Nutrition Guide',
    prompt: 'What should I feed my pet for optimal health?'
  },
  {
    category: 'emergency',
    icon: AlertTriangle,
    title: 'Emergency Signs',
    prompt: 'What are warning signs that require immediate veterinary attention?'
  }
];

export function AIChatbot() {
  const { pets } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI pet care assistant. I can help you with questions about pet health, behavior, nutrition, and general care. How can I assist you today?',
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const message = userMessage.toLowerCase();
    const selectedPetData = pets.find(pet => pet.id === selectedPet);
    const petContext = selectedPetData ? `for your ${selectedPetData.species.toLowerCase()} ${selectedPetData.name}` : '';

    // Health-related responses
    if (message.includes('health') || message.includes('sick') || message.includes('symptoms')) {
      return `Here are some key health indicators to monitor ${petContext}:

🔍 **Daily Health Checks:**
• Clear, bright eyes without discharge
• Clean, moist nose (dry nose can be normal for some pets)
• Healthy appetite and normal water consumption
• Regular bowel movements and urination
• Active and alert behavior
• Smooth, shiny coat without excessive shedding

⚠️ **Warning Signs to Watch For:**
• Loss of appetite for more than 24 hours
• Excessive lethargy or hiding
• Vomiting or diarrhea that persists
• Difficulty breathing or excessive panting
• Unusual lumps or swelling

${selectedPetData ? `For ${selectedPetData.name} specifically, at ${selectedPetData.age} years old, regular ${selectedPetData.age > 7 ? 'senior' : 'annual'} checkups are important.` : ''}

Would you like more specific information about any particular health concern?`;
    }

    // Behavior-related responses
    if (message.includes('behavior') || message.includes('acting') || message.includes('training')) {
      return `Understanding pet behavior ${petContext} is crucial for their wellbeing:

🧠 **Normal Behavior Changes:**
• Seasonal variations in activity
• Age-related changes (puppies/kittens vs seniors)
• Response to environmental changes
• Routine disruptions

🚩 **Concerning Behavioral Changes:**
• Sudden aggression or fearfulness
• Excessive hiding or withdrawal
• Changes in sleep patterns
• Loss of house training
• Repetitive behaviors (excessive grooming, pacing)

💡 **Tips for Behavioral Health:**
• Maintain consistent routines
• Provide mental stimulation (toys, puzzles)
• Ensure adequate exercise
• Create safe, comfortable spaces
• Positive reinforcement training

${selectedPetData && selectedPetData.species === 'Dog' ? 'Dogs especially benefit from structured training and socialization.' : ''}
${selectedPetData && selectedPetData.species === 'Cat' ? 'Cats appreciate vertical spaces and environmental enrichment.' : ''}

What specific behavioral changes have you noticed?`;
    }

    // Nutrition-related responses
    if (message.includes('food') || message.includes('nutrition') || message.includes('diet') || message.includes('feed')) {
      return `Proper nutrition ${petContext} is fundamental to health:

🥘 **General Feeding Guidelines:**
• High-quality, age-appropriate food
• Consistent feeding schedule
• Proper portion control based on weight and activity
• Fresh water available at all times
• Limited treats (no more than 10% of daily calories)

${selectedPetData ? `**For ${selectedPetData.name} (${selectedPetData.species}):**
• Current weight: ${selectedPetData.weight} lbs
• ${selectedPetData.age < 1 ? 'Puppy/Kitten food for growth' : selectedPetData.age > 7 ? 'Senior formula for mature pets' : 'Adult maintenance formula'}
• Feeding frequency: ${selectedPetData.age < 1 ? '3-4 times daily' : selectedPetData.age > 7 ? '2 times daily with easily digestible food' : '2 times daily'}` : ''}

🚫 **Foods to Avoid:**
• Chocolate, grapes, onions, garlic
• Xylitol (artificial sweetener)
• Excessive fatty foods
• Bones that can splinter

🔍 **Signs of Good Nutrition:**
• Healthy weight maintenance
• Shiny coat and healthy skin
• Good energy levels
• Normal digestion

Would you like specific feeding recommendations or have concerns about your pet's current diet?`;
    }

    // Emergency-related responses
    if (message.includes('emergency') || message.includes('urgent') || message.includes('danger') || message.includes('poison')) {
      return `🚨 **EMERGENCY SITUATIONS - Seek immediate veterinary care:**

⚡ **Critical Signs:**
• Difficulty breathing or choking
• Unconsciousness or collapse
• Severe bleeding
• Suspected poisoning
• Inability to urinate or defecate
• Severe pain or trauma
• Seizures
• Bloated or distended abdomen

📞 **Emergency Actions:**
1. Contact your veterinarian immediately
2. Call pet poison control if poisoning is suspected
3. Keep your pet calm and warm
4. Do not induce vomiting unless instructed
5. Bring any packaging if poisoning is suspected

**Emergency Contacts:**
• Your veterinarian: [Add your vet's number]
• After-hours emergency clinic: [Add local emergency clinic]
• Pet Poison Control: (888) 426-4435

⚠️ **Important:** This AI assistant provides general information only. In true emergencies, always contact a veterinary professional immediately.

Are you currently experiencing a pet emergency? If so, please contact your veterinarian right away.`;
    }

    // General care responses
    return `I'm here to help with pet care guidance ${petContext}! Here are some areas I can assist with:

🏥 **Health & Wellness:**
• Recognizing signs of illness
• Preventive care schedules
• Medication administration tips
• Recovery care guidance

🎾 **Behavior & Training:**
• Understanding normal behaviors
• Addressing behavioral concerns
• Training techniques
• Environmental enrichment

🍽️ **Nutrition & Diet:**
• Feeding guidelines
• Nutritional requirements
• Treat recommendations
• Weight management

🆘 **Emergency Preparedness:**
• Recognizing emergencies
• First aid basics
• Emergency contact information
• Disaster preparedness

${pets.length > 0 ? `I can provide more specific advice if you select one of your pets: ${pets.map(p => p.name).join(', ')}.` : ''}

What specific topic would you like to discuss? Remember, while I can provide helpful information, always consult with your veterinarian for medical concerns.`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      petContext: selectedPet
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const botResponse = await generateBotResponse(inputMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        category: 'general'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment, or contact your veterinarian for immediate assistance.',
        timestamp: new Date(),
        category: 'general'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-600" />
            AI Pet Care Assistant
          </h1>
          <p className="text-gray-600 mt-1">Get instant guidance on pet health, behavior, and care</p>
        </div>
        
        {pets.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Ask about:</span>
            <select 
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm"
            >
              <option value="">General advice</option>
              {pets.map(pet => (
                <option key={pet.id} value={pet.id}>{pet.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Prompts */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Quick Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickPrompts.map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    className="w-full justify-start h-auto p-3 text-left"
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{prompt.title}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {prompt.prompt}
                        </p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pet Care Assistant</CardTitle>
                  <p className="text-sm text-gray-600">
                    {isTyping ? (
                      <span className="flex items-center gap-1">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        Typing...
                      </span>
                    ) : (
                      'Online • Ready to help'
                    )}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.type === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        {message.type === 'user' ? (
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white ml-auto'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about pet health, behavior, nutrition, or emergency care..."
                    className="flex-1 resize-none"
                    rows={2}
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    size="icon"
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  💡 This AI provides general guidance only. Always consult your veterinarian for medical concerns.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}