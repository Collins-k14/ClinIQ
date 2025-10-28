import api from './api';

export const symptomService = {
  // Process chat message
  processMessage: async (messageData) => {
    try {
      const response = await api.post('/symptoms/chat', messageData);
      return response.data;
    } catch (error) {
      // Fallback to rule-based system if AI fails
      console.error('AI processing failed, using fallback:', error);
      return ruleBased_processMessage(messageData);
    }
  },
  
  // Complete symptom check
  checkSymptoms: async (symptomsData) => {
    try {
      const response = await api.post('/symptoms/check', symptomsData);
      return response.data;
    } catch (error) {
      console.error('Symptom check error:', error);
      // Return fallback triage
      return ruleBased_triageSymptoms(symptomsData.symptoms);
    }
  },
  
  // Get symptom history
  getSymptomHistory: async () => {
    const response = await api.get('/symptoms/history');
    return response.data;
  },
  
  // Save to history
  saveToHistory: async (historyData) => {
    const response = await api.post('/symptoms/history', historyData);
    return response.data;
  },
  
  // Get symptom check by ID
  getSymptomCheckById: async (id) => {
    const response = await api.get(`/symptoms/${id}`);
    return response.data;
  },
  
  // Get common symptoms list
  getCommonSymptoms: async () => {
    const response = await api.get('/symptoms/common');
    return response.data;
  }
};

// ============ FALLBACK RULE-BASED SYSTEM ============
// This provides basic triage when backend is unavailable

const SYMPTOM_DATABASE = {
  // Emergency symptoms
  emergency: [
    'chest pain', 'difficulty breathing', 'severe bleeding', 'loss of consciousness',
    'stroke symptoms', 'severe head injury', 'choking', 'seizure', 'suicide thoughts',
    'severe allergic reaction', 'severe burns', 'poisoning'
  ],
  
  // Severe symptoms
  severe: [
    'high fever', 'persistent vomiting', 'severe pain', 'blood in stool', 'blood in urine',
    'severe headache', 'confusion', 'severe abdominal pain', 'fainting', 'shortness of breath'
  ],
  
  // Moderate symptoms
  moderate: [
    'fever', 'cough', 'headache', 'nausea', 'diarrhea', 'vomiting', 'body aches',
    'sore throat', 'rash', 'dizziness', 'ear pain', 'toothache'
  ],
  
  // Mild symptoms
  mild: [
    'mild headache', 'runny nose', 'sneezing', 'mild cough', 'fatigue', 'mild fever',
    'stuffy nose', 'minor cuts', 'bruises', 'mild rash'
  ]
};

const FOLLOW_UP_QUESTIONS = [
  "How long have you been experiencing these symptoms?",
  "On a scale of 1-10, how would you rate your pain or discomfort?",
  "Have you noticed any other symptoms?",
  "Have you taken any medication for this?",
  "Do you have any pre-existing medical conditions?",
  "Are your symptoms getting worse, staying the same, or improving?"
];

function ruleBased_processMessage(messageData) {
  const { message, conversationHistory } = messageData;
  const lowerMessage = message.toLowerCase();
  
  // Identify symptoms in the message
  const identifiedSymptoms = [];
  let severity = 'mild';
  
  // Check for emergency symptoms
  for (const symptom of SYMPTOM_DATABASE.emergency) {
    if (lowerMessage.includes(symptom)) {
      identifiedSymptoms.push(symptom);
      severity = 'emergency';
    }
  }
  
  // Check for severe symptoms if no emergency found
  if (severity !== 'emergency') {
    for (const symptom of SYMPTOM_DATABASE.severe) {
      if (lowerMessage.includes(symptom)) {
        identifiedSymptoms.push(symptom);
        severity = 'severe';
      }
    }
  }
  
  // Check for moderate symptoms
  if (severity !== 'emergency' && severity !== 'severe') {
    for (const symptom of SYMPTOM_DATABASE.moderate) {
      if (lowerMessage.includes(symptom)) {
        identifiedSymptoms.push(symptom);
        severity = 'moderate';
      }
    }
  }
  
  // Check for mild symptoms
  if (identifiedSymptoms.length === 0) {
    for (const symptom of SYMPTOM_DATABASE.mild) {
      if (lowerMessage.includes(symptom)) {
        identifiedSymptoms.push(symptom);
        severity = 'mild';
      }
    }
  }
  
  // Generate response based on conversation stage
  const messageCount = conversationHistory?.length || 0;
  let reply = '';
  let suggestions = [];
  let assessmentComplete = false;
  
  if (messageCount < 2) {
    // Initial response - acknowledge and ask for more details
    reply = identifiedSymptoms.length > 0
      ? `I understand you're experiencing ${identifiedSymptoms.join(', ')}. Can you tell me more about when these symptoms started and how severe they are?`
      : "I'd like to help assess your symptoms. Could you describe what you're experiencing in more detail?";
    
    suggestions = [
      "Symptoms started today",
      "Symptoms for a few days",
      "More than a week"
    ];
  } else if (messageCount < 4) {
    // Follow-up questions
    const randomQuestion = FOLLOW_UP_QUESTIONS[Math.floor(Math.random() * FOLLOW_UP_QUESTIONS.length)];
    reply = randomQuestion;
    
    suggestions = [
      "Yes",
      "No",
      "I'm not sure"
    ];
  } else {
    // Ready for assessment
    reply = "Thank you for providing that information. I have enough details to provide you with an assessment. Click 'Complete Assessment' to see your results.";
    assessmentComplete = true;
  }
  
  return {
    reply,
    identifiedSymptoms,
    suggestions,
    assessmentComplete,
    triageData: assessmentComplete ? ruleBased_triageSymptoms(identifiedSymptoms) : null
  };
}

function ruleBased_triageSymptoms(symptoms) {
  // Determine severity
  let severity = 'mild';
  let urgencyLevel = 1;
  
  for (const symptom of symptoms) {
    if (SYMPTOM_DATABASE.emergency.includes(symptom)) {
      severity = 'emergency';
      urgencyLevel = 5;
      break;
    } else if (SYMPTOM_DATABASE.severe.includes(symptom)) {
      severity = 'severe';
      urgencyLevel = 4;
    } else if (SYMPTOM_DATABASE.moderate.includes(symptom) && severity === 'mild') {
      severity = 'moderate';
      urgencyLevel = 3;
    }
  }
  
  // Generate self-care advice
  const selfCareAdvice = generateSelfCareAdvice(symptoms, severity);
  
  // Determine facility type
  const facilityInfo = determineFacilityType(severity);
  
  return {
    severity,
    urgencyLevel,
    selfCareAdvice,
    suggestedFacilityType: facilityInfo.type,
    suggestedSpecialty: facilityInfo.specialty,
    estimatedWaitTime: facilityInfo.waitTime,
    redFlags: getRedFlags(severity),
    followUpNeeded: severity === 'moderate' || severity === 'mild',
    followUpDate: severity === 'moderate' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
    recommendedFacilities: [] // Would be populated with nearby facilities
  };
}

function generateSelfCareAdvice(symptoms, severity) {
  const advice = [];
  
  if (severity === 'emergency') {
    advice.push('Call emergency services immediately (999/911/112)');
    advice.push('Do not drive yourself to the hospital');
    advice.push('Stay calm and wait for emergency responders');
    return advice;
  }
  
  // General advice
  advice.push('Get plenty of rest and stay hydrated');
  advice.push('Monitor your symptoms closely');
  
  // Symptom-specific advice
  if (symptoms.some(s => s.includes('fever'))) {
    advice.push('Take over-the-counter fever reducers like acetaminophen or ibuprofen');
    advice.push('Use cool compresses to reduce fever');
  }
  
  if (symptoms.some(s => s.includes('cough'))) {
    advice.push('Use a humidifier to ease breathing');
    advice.push('Drink warm liquids like tea with honey');
  }
  
  if (symptoms.some(s => s.includes('headache'))) {
    advice.push('Rest in a quiet, dark room');
    advice.push('Apply a cold or warm compress to your head');
  }
  
  if (symptoms.some(s => s.includes('pain'))) {
    advice.push('Apply ice or heat to the affected area');
    advice.push('Take over-the-counter pain relievers as directed');
  }
  
  advice.push('Avoid strenuous activities until symptoms improve');
  advice.push('Seek medical attention if symptoms worsen');
  
  return advice;
}

function determineFacilityType(severity) {
  switch (severity) {
    case 'emergency':
      return {
        type: 'Emergency Room',
        specialty: 'Emergency Medicine',
        waitTime: 'Immediate'
      };
    case 'severe':
      return {
        type: 'Urgent Care or Hospital',
        specialty: 'General Medicine',
        waitTime: 'Within 2-4 hours'
      };
    case 'moderate':
      return {
        type: 'Clinic or General Practitioner',
        specialty: 'General Practice',
        waitTime: '1-2 days'
      };
    default:
      return {
        type: 'Pharmacy or Telemedicine',
        specialty: 'General Consultation',
        waitTime: 'Self-care or next available'
      };
  }
}

function getRedFlags(severity) {
  if (severity === 'emergency' || severity === 'severe') {
    return [
      'Difficulty breathing or shortness of breath',
      'Chest pain or pressure',
      'Severe bleeding that won\'t stop',
      'Signs of stroke (facial drooping, arm weakness, speech difficulty)',
      'Loss of consciousness or severe confusion',
      'Severe allergic reaction with swelling',
      'High fever (above 103°F/39.4°C) that doesn\'t respond to medication'
    ];
  }
  return [];
}

export default symptomService;