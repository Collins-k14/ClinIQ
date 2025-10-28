import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import TriageResults from './TriageResult';
import { symptomService } from '../../services/symptomsService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function SymptomChecker() {
  const [stage, setStage] = useState('intro'); // intro, chat, results
  const [messages, setMessages] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [triageResult, setTriageResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Generate unique session ID
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }, []);
  
  const startChat = () => {
    setStage('chat');
    // Initial greeting message
    const greeting = {
      id: Date.now(),
      role: 'bot',
      message: user 
        ? `Hello ${user.firstName || user.name}! I'm here to help assess your symptoms. Can you describe what you're experiencing?`
        : "Hello! I'm here to help assess your symptoms. Can you describe what you're experiencing?",
      timestamp: new Date()
    };
    setMessages([greeting]);
  };
  
  const handleSendMessage = async (userMessage) => {
    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      message: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    
    setLoading(true);
    
    try {
      // Send to backend for processing
      const response = await symptomService.processMessage({
        message: userMessage,
        sessionId,
        conversationHistory: messages
      });
      
      // Add bot response
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        message: response.reply,
        timestamp: new Date(),
        suggestions: response.suggestions || []
      };
      setMessages(prev => [...prev, botMsg]);
      
      // Update symptoms list
      if (response.identifiedSymptoms) {
        setSymptoms(response.identifiedSymptoms);
      }
      
      // Check if assessment is complete
      if (response.assessmentComplete) {
        setTimeout(() => {
          handleCompleteAssessment(response.triageData);
        }, 1000);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMsg = {
        id: Date.now() + 1,
        role: 'bot',
        message: "I'm having trouble processing that. Could you rephrase or try again?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCompleteAssessment = async (triageData) => {
    setLoading(true);
    try {
      // Get final triage result
      const result = triageData || await symptomService.checkSymptoms({
        symptoms,
        conversationHistory: messages,
        sessionId
      });
      
      setTriageResult(result);
      setStage('results');
      
      // Save to user history if logged in
      if (user) {
        await symptomService.saveToHistory({
          symptoms,
          triageResult: result,
          conversationHistory: messages
        });
      }
    } catch (error) {
      console.error('Error completing assessment:', error);
      // Still show results with what we have
      if (triageData) {
        setTriageResult(triageData);
        setStage('results');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleRestart = () => {
    setStage('intro');
    setMessages([]);
    setSymptoms([]);
    setTriageResult(null);
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  };
  
  if (loading && stage === 'results') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Analyzing your symptoms...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {stage === 'intro' && (
        <IntroScreen onStart={startChat} />
      )}
      
      {stage === 'chat' && (
        <ChatInterface
          messages={messages}
          symptoms={symptoms}
          onSendMessage={handleSendMessage}
          onComplete={handleCompleteAssessment}
          loading={loading}
          onBack={() => setStage('intro')}
        />
      )}
      
      {stage === 'results' && triageResult && (
        <TriageResults
          result={triageResult}
          symptoms={symptoms}
          onRestart={handleRestart}
          onFindFacilities={() => navigate('/find-facilities', { 
            state: { triageResult } 
          })}
        />
      )}
    </div>
  );
}

// ==================== INTRO SCREEN COMPONENT ====================
function IntroScreen({ onStart }) {
  const disclaimers = [
    "This tool provides general health information and is not a substitute for professional medical advice.",
    "If you're experiencing a medical emergency, call emergency services immediately.",
    "Our assessment is based on the information you provide and may not cover all conditions.",
    "Always consult with a healthcare professional for proper diagnosis and treatment."
  ];
  
  const steps = [
    {
      emoji: '💬',
      title: 'Describe Symptoms',
      description: 'Tell us what you\'re experiencing',
      color: 'bg-green-100'
    },
    {
      emoji: '🤖',
      title: 'AI Analysis',
      description: 'Get intelligent assessment',
      color: 'bg-blue-100'
    },
    {
      emoji: '🏥',
      title: 'Get Recommendations',
      description: 'Find nearby facilities',
      color: 'bg-purple-100'
    }
  ];
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Symptom Checker
          </h1>
          <p className="text-lg text-gray-600">
            Get personalized health recommendations based on your symptoms
          </p>
        </div>
        
        {/* Disclaimer Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Important Information
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {disclaimers.map((disclaimer, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{disclaimer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <span className="text-2xl">{step.emoji}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        {/* Start Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={onStart}
            className="px-8"
          >
            Start Symptom Check
          </Button>
        </div>
      </div>
    </div>
  );
}