import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon,
  ArrowLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function ChatInterface({ 
  messages, 
  symptoms,
  onSendMessage, 
  onComplete,
  loading,
  onBack 
}) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !loading) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    if (!loading) {
      onSendMessage(suggestion);
    }
  };
  
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Symptom Checker
                </h2>
                <p className="text-sm text-gray-500">
                  AI Health Assistant
                </p>
              </div>
            </div>
            {symptoms.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={onComplete}
                disabled={loading}
              >
                Complete Assessment
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Symptoms Bar */}
      {symptoms.length > 0 && (
        <div className="bg-blue-50 border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">
                Identified Symptoms:
              </span>
              {symptoms.map((symptom, index) => (
                <Badge key={index} variant="primary" size="sm">
                  {symptom}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <MessageBubble
                  message={message}
                  formatTime={formatTime}
                />
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 ml-12">
                    <p className="text-xs text-gray-500 mb-2">
                      Quick responses:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          disabled={loading}
                          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex items-start space-x-3">
                <div className="bg-primary-100 rounded-full p-2 flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 shadow-sm max-w-xl">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">Analyzing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      
      {/* Input Area */}
      <div className="bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Describe your symptoms in detail..."
                rows="3"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={!inputMessage.trim() || loading}
              className="h-12 w-12 p-0 flex items-center justify-center flex-shrink-0"
              aria-label="Send message"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ message, formatTime }) {
  const isBot = message.role === 'bot';
  
  return (
    <div className={`flex items-start space-x-3 ${!isBot ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`${isBot ? 'bg-primary-100' : 'bg-gray-200'} rounded-full p-2 flex-shrink-0`}>
        {isBot ? (
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </div>
      
      {/* Message Content */}
      <div className={`flex flex-col ${!isBot ? 'items-end' : 'items-start'} max-w-xl`}>
        <div className={`${
          isBot 
            ? 'bg-white text-gray-900' 
            : 'bg-primary-600 text-white'
        } rounded-lg px-4 py-3 shadow-sm`}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.message}
          </p>
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}