'use client';

import { useState, useEffect, useRef } from 'react';
import { BsChatDots, BsSend } from 'react-icons/bs';

interface Message {
  from: 'user' | 'bot';
  text: string;
}

export default function HelpChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const templates = [
    'How can I buy event tickets?',
    'Where can I see my purchased tickets?',
    'Can I refund or cancel my ticket?',
    'How to contact event organizers?',
    'How to reset my password?',
    'What payment options do you support?'
  ];

  useEffect(() => {
    // Initialize with welcome message
    setMessages([{ from: 'bot', text: "👋 Hi! I'm your TicketWeb Assistant. How can I help you today?" }]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const getAutoReply = (userText: string): string => {
    const lower = userText.toLowerCase();
    
    if (lower.includes('buy') || lower.includes('ticket')) {
      return "You can purchase tickets by visiting an event page and selecting your preferred seat, then clicking 'Buy Ticket'.";
    } else if (lower.includes('view') && lower.includes('ticket')) {
      return "Go to your profile and click on 'My Tickets' to view all your purchased tickets.";
    } else if (lower.includes('refund') || lower.includes('cancel')) {
      return "Refunds or cancellations depend on the event organizer's policy. Check the event page or contact support.";
    } else if (lower.includes('contact') || lower.includes('organizer')) {
      return "Organizer contact info is shown on the event details page under 'Contact Organizer'.";
    } else if (lower.includes('reset') || lower.includes('password')) {
      return "Go to the login page and click 'Forgot Password' to reset your account credentials.";
    } else if (lower.includes('payment')) {
      return "We support GCash, PayPal, and major debit/credit cards.";
    }
    
    return "I'm still learning, but here's what I know about our system.";
  };

  const askQuestion = (question: string) => {
    setInput(question);
    handleSendMessage(question);
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Add user message
    setMessages(prev => [...prev, { from: 'user', text: messageText }]);
    
    // Clear input if it was typed
    if (!text) setInput('');

    // Simulate bot thinking delay
    setTimeout(() => {
      const reply = getAutoReply(messageText);
      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
    }, 700);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="max-w-5xl mx-auto py-16 px-6">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left Column – FAQ / Template Questions */}
        <div>
          <h2 className="text-3xl font-bold text-[#E85C0D] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-700 mb-6">
            Choose a question below or chat directly with our assistant.
          </p>

          <div className="space-y-3">
            {templates.map((question, index) => (
              <button
                key={index}
                onClick={() => askQuestion(question)}
                className="w-full text-left bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition flex items-center justify-between"
              >
                <span className="text-sm font-medium">{question}</span>
                <BsChatDots className="text-[#E85C0D]" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column – AI Chat Interface */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col h-[500px]">
          {/* Chat Messages */}
          <div
            ref={chatBoxRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.from === 'user' ? 'text-right' : 'text-left'}
              >
                <div
                  className={`inline-block rounded-2xl px-4 py-2 ${
                    msg.from === 'user'
                      ? 'bg-[#E85C0D] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t p-3 flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask something about the system..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85C0D]"
            />
            <button
              onClick={() => handleSendMessage()}
              className="ml-3 bg-[#E85C0D] text-white p-2 rounded-full hover:bg-[#d24f0b] transition"
            >
              <BsSend />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}