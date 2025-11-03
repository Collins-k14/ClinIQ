const SymptomCheck = require('../models/SymptomCheck');
const { analyzeSymptoms, processConversation } = require('../services/aiService');
const User = require('../models/User');

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
    const clerkUserId = req.userId; // From Clerk middleware

    // Create or find user record linked to Clerk ID
    let user = await User.findOne({ clerkId: clerkUserId });
    
    if (!user) {
      // Create a user record linked to Clerk
      user = await User.create({
        clerkId: clerkUserId,
        // You can sync additional info from Clerk if needed
      });
    }

    const symptomCheck = new SymptomCheck({
      userId: user._id,
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
    const clerkUserId = req.userId; // Comes from Clerk middleware
    if (!clerkUserId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Find the local user linked to the Clerk ID
    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      return res.status(404).json({ error: 'User record not found' });
    }

    const { limit = 10, skip = 0 } = req.query;

    const history = await SymptomCheck.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-conversation');

    const total = await SymptomCheck.countDocuments({ userId: user._id });

    res.json({
      history,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error getting symptom history:', error);
    res.status(500).json({
      error: 'Failed to get symptom history',
      message: error.message,
    });
  }
};

// Get symptom check by ID (protected route)
exports.getSymptomCheckById = async (req, res) => {
  try {
    const clerkUserId = req.userId; // Clerk user ID
    if (!clerkUserId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      return res.status(404).json({ error: 'User record not found' });
    }

    const { id } = req.params;

    const symptomCheck = await SymptomCheck.findOne({
      _id: id,
      userId: user._id,
    });

    if (!symptomCheck) {
      return res.status(404).json({ error: 'Symptom check not found' });
    }

    res.json(symptomCheck);
  } catch (error) {
    console.error('Error getting symptom check:', error);
    res.status(500).json({
      error: 'Failed to get symptom check',
      message: error.message,
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
