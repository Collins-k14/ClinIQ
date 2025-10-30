// Symptom database for rule-based triage
const SYMPTOM_DATABASE = {
  emergency: [
    'chest pain', 'difficulty breathing', 'severe bleeding', 'loss of consciousness',
    'stroke symptoms', 'severe head injury', 'choking', 'seizure', 'suicide thoughts',
    'severe allergic reaction', 'severe burns', 'poisoning', 'severe chest pressure',
    'unable to breathe', 'uncontrollable bleeding', 'blue lips', 'confusion',
    'slurred speech', 'severe abdominal pain', 'coughing blood', 'vomiting blood'
  ],
  severe: [
    'high fever', 'persistent vomiting', 'severe pain', 'blood in stool', 'blood in urine',
    'severe headache', 'fainting', 'shortness of breath', 'rapid heartbeat',
    'severe dizziness', 'severe weakness', 'severe dehydration', 'high blood pressure',
    'irregular heartbeat', 'severe infection', 'deep wound'
  ],
  moderate: [
    'fever', 'cough', 'headache', 'nausea', 'diarrhea', 'vomiting', 'body aches',
    'sore throat', 'rash', 'dizziness', 'ear pain', 'toothache', 'joint pain',
    'back pain', 'mild chest discomfort', 'stomach pain', 'constipation', 'bloating'
  ],
  mild: [
    'mild headache', 'runny nose', 'sneezing', 'mild cough', 'fatigue', 'mild fever',
    'stuffy nose', 'minor cuts', 'bruises', 'mild rash', 'itching', 'dry skin',
    'mild sore throat', 'watery eyes', 'mild muscle aches'
  ]
};

const FOLLOW_UP_QUESTIONS = [
  "How long have you been experiencing these symptoms?",
  "On a scale of 1-10, how would you rate your discomfort?",
  "Have you noticed any other symptoms?",
  "Have you taken any medication for this?",
  "Do you have any pre-existing medical conditions?",
  "Are your symptoms getting worse, staying the same, or improving?",
  "Does anything make your symptoms better or worse?",
  "Have you had this before?"
];

// Process conversation message
exports.processConversation = async (message, conversationHistory = []) => {
  const lowerMessage = message.toLowerCase();
  const identifiedSymptoms = [];
  let severity = 'mild';
  
  // Check for emergency symptoms
  for (const symptom of SYMPTOM_DATABASE.emergency) {
    if (lowerMessage.includes(symptom)) {
      identifiedSymptoms.push(symptom);
      severity = 'emergency';
    }
  }
  
  // Check for severe symptoms if no emergency
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
  const messageCount = conversationHistory.length;
  let reply = '';
  let suggestions = [];
  let assessmentComplete = false;
  
  if (messageCount < 2) {
    // Initial response
    if (identifiedSymptoms.length > 0) {
      reply = `I understand you're experiencing ${identifiedSymptoms.join(', ')}. Can you tell me more about when these symptoms started and how severe they are?`;
    } else {
      reply = "Could you describe your symptoms in more detail? For example, what are you feeling and where?";
    }
    suggestions = [
      "Symptoms started today",
      "Symptoms for a few days",
      "More than a week"
    ];
  } else if (messageCount < 4) {
    // Follow-up questions
    const randomQuestion = FOLLOW_UP_QUESTIONS[Math.floor(Math.random() * FOLLOW_UP_QUESTIONS.length)];
    reply = randomQuestion;
    suggestions = ["Yes", "No", "I'm not sure"];
  } else {
    // Ready for assessment
    reply = "Thank you for providing that information. I have enough details to give you an assessment. Click 'Complete Assessment' to see your results.";
    assessmentComplete = true;
  }
  
  return {
    reply,
    identifiedSymptoms,
    suggestions,
    assessmentComplete,
    severity
  };
};

// Analyze symptoms and generate triage result
exports.analyzeSymptoms = async (symptoms) => {
  let severity = 'mild';
  let urgencyLevel = 1;
  
  // Determine severity based on symptoms
  for (const symptom of symptoms) {
    const lowerSymptom = symptom.toLowerCase();
    
    if (SYMPTOM_DATABASE.emergency.some(s => lowerSymptom.includes(s))) {
      severity = 'emergency';
      urgencyLevel = 5;
      break;
    } else if (SYMPTOM_DATABASE.severe.some(s => lowerSymptom.includes(s))) {
      severity = 'severe';
      urgencyLevel = 4;
    } else if (SYMPTOM_DATABASE.moderate.some(s => lowerSymptom.includes(s)) && severity === 'mild') {
      severity = 'moderate';
      urgencyLevel = 3;
    }
  }
  
  // Generate self-care advice
  const selfCareAdvice = generateSelfCareAdvice(symptoms, severity);
  
  // Determine facility type
  const facilityInfo = determineFacilityType(severity);
  
  // Get red flags for severe cases
  const redFlags = severity === 'emergency' || severity === 'severe' 
    ? getRedFlags(severity) 
    : [];
  
  return {
    severity,
    urgencyLevel,
    selfCareAdvice,
    suggestedFacilityType: facilityInfo.type,
    suggestedSpecialty: facilityInfo.specialty,
    estimatedWaitTime: facilityInfo.waitTime,
    redFlags,
    followUpNeeded: severity === 'moderate' || severity === 'mild',
    followUpDate: severity === 'moderate' 
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
      : null,
    recommendedFacilities: []
  };
};

function generateSelfCareAdvice(symptoms, severity) {
  const advice = [];
  
  if (severity === 'emergency') {
    advice.push('Call emergency services immediately (999/911/112)');
    advice.push('Do not drive yourself to the hospital');
    advice.push('Stay calm and wait for emergency responders');
    return advice;
  }
  
  advice.push('Get plenty of rest and stay hydrated');
  advice.push('Monitor your symptoms closely');
  
  const symptomStr = symptoms.join(' ').toLowerCase();
  
  if (symptomStr.includes('fever')) {
    advice.push('Take over-the-counter fever reducers like acetaminophen or ibuprofen');
    advice.push('Use cool compresses to reduce fever');
  }
  
  if (symptomStr.includes('cough')) {
    advice.push('Use a humidifier to ease breathing');
    advice.push('Drink warm liquids like tea with honey');
  }
  
  if (symptomStr.includes('headache')) {
    advice.push('Rest in a quiet, dark room');
    advice.push('Apply a cold or warm compress to your head');
  }
  
  if (symptomStr.includes('pain')) {
    advice.push('Apply ice or heat to the affected area');
    advice.push('Take over-the-counter pain relievers as directed');
  }
  
  if (symptomStr.includes('nausea') || symptomStr.includes('vomiting')) {
    advice.push('Sip clear fluids slowly');
    advice.push('Avoid solid foods until nausea subsides');
    advice.push('Try ginger tea or peppermint');
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
