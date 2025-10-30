const SymptomCheck = require('../models/SymptomCheck');
const { analyzeSymptoms, processConversation } = require('../services/aiService');

// Process chat message
exports.processMessage = async (req, res) => {
  try {
    const { message, sessionId, conversationHistory } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({
        error: 'Message and sessionId are required'
      });
    }

    // Analyze the message using AI or rule-based system
    const analysis = await processConversation(message, conversationHistory);

    // Extract symptoms from message
    const identifiedSymptoms = analysis.identifiedSymptoms || [];
    
    // Determine if we need more information
    const needsMoreInfo = conversationHistory.length < 4 && !analysis.assessmentComplete;
    
    // Generate appropriate response
    let reply = analysis.reply;
    let suggestions = analysis.suggestions || [];
    
    // Check if assessment is complete
    const assessmentComplete = analysis.assessmentComplete || 
      (identifiedSymptoms.length > 0 && conversationHistory.length >= 4);

    let triageData = null;
    if (assessmentComplete) {
      triageData = await analyzeSymptoms(identifiedSymptoms);
    }

    res.json({
      reply,
      identifiedSymptoms,
      suggestions,
      assessmentComplete,
      triageData
    });

  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message
    });
  }
};

// Complete symptom check
exports.checkSymptoms = async (req, res) => {
  try {
    const { symptoms, conversationHistory, sessionId } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({
        error: 'Symptoms array is required'
      });
    }

    // Perform triage analysis
    const triageResult = await analyzeSymptoms(symptoms);

    res.json(triageResult);

  } catch (error) {
    console.error('Error checking symptoms:', error);
    res.status(500).json({
      error: 'Failed to check symptoms',
      message: error.message
    });
  }
};

// Save to history (protected route)
exports.saveToHistory = async (req, res) => {
  try {
    const { symptoms, triageResult, conversationHistory } = req.body;
    const userId = req.user._id;

    const symptomCheck = new SymptomCheck({
      userId,
      symptoms,
      conversation: conversationHistory,
      triageResult: {
        severity: triageResult.severity,
        urgencyLevel: triageResult.urgencyLevel,
        recommendation: triageResult.suggestedFacilityType,
        selfCareAdvice: triageResult.selfCareAdvice,
        suggestedSpecialty: triageResult.suggestedSpecialty,
        redFlags: triageResult.redFlags,
        followUpNeeded: triageResult.followUpNeeded,
        followUpDate: triageResult.followUpDate
      }
    });

    await symptomCheck.save();

    res.status(201).json({
      message: 'Symptom check saved to history',
      symptomCheckId: symptomCheck._id
    });

  } catch (error) {
    console.error('Error saving to history:', error);
    res.status(500).json({
      error: 'Failed to save to history',
      message: error.message
    });
  }
};

// Get symptom history (protected route)
exports.getSymptomHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10, skip = 0 } = req.query;

    const history = await SymptomCheck.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-conversation'); // Exclude full conversation for list view

    const total = await SymptomCheck.countDocuments({ userId });

    res.json({
      history,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error getting symptom history:', error);
    res.status(500).json({
      error: 'Failed to get symptom history',
      message: error.message
    });
  }
};

// Get symptom check by ID (protected route)
exports.getSymptomCheckById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const symptomCheck = await SymptomCheck.findOne({
      _id: id,
      userId
    });

    if (!symptomCheck) {
      return res.status(404).json({
        error: 'Symptom check not found'
      });
    }

    res.json(symptomCheck);

  } catch (error) {
    console.error('Error getting symptom check:', error);
    res.status(500).json({
      error: 'Failed to get symptom check',
      message: error.message
    });
  }
};

// Get common symptoms list
exports.getCommonSymptoms = async (req, res) => {
  try {
    const commonSymptoms = [
      { name: 'Fever', category: 'general' },
      { name: 'Cough', category: 'respiratory' },
      { name: 'Headache', category: 'neurological' },
      { name: 'Sore Throat', category: 'respiratory' },
      { name: 'Fatigue', category: 'general' },
      { name: 'Body Aches', category: 'musculoskeletal' },
      { name: 'Nausea', category: 'gastrointestinal' },
      { name: 'Diarrhea', category: 'gastrointestinal' },
      { name: 'Shortness of Breath', category: 'respiratory' },
      { name: 'Dizziness', category: 'neurological' },
      { name: 'Chest Pain', category: 'cardiovascular' },
      { name: 'Abdominal Pain', category: 'gastrointestinal' },
      { name: 'Rash', category: 'dermatological' },
      { name: 'Runny Nose', category: 'respiratory' },
      { name: 'Loss of Taste/Smell', category: 'sensory' }
    ];

    res.json(commonSymptoms);

  } catch (error) {
    console.error('Error getting common symptoms:', error);
    res.status(500).json({
      error: 'Failed to get common symptoms',
      message: error.message
    });
  }
};
