import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
  // Core accessibility settings
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(false);
  const [signLanguageEnabled, setSignLanguageEnabled] = useState(false);
  const [screenReaderOptimized, setScreenReaderOptimized] = useState(false);
  const [cognitiveAssistEnabled, setCognitiveAssistEnabled] = useState(false);
  const [smartKeyboardEnabled, setSmartKeyboardEnabled] = useState(false);
  const [caregiverModeEnabled, setCaregiverModeEnabled] = useState(false);
  const [multiSensoryEnabled, setMultiSensoryEnabled] = useState(false);
  const [communityFeaturesEnabled, setCommunityFeaturesEnabled] = useState(false);
  const [accessibilityPassportEnabled, setAccessibilityPassportEnabled] = useState(false);
  const [emotionalSupportEnabled, setEmotionalSupportEnabled] = useState(false);
  
  // Additional settings for specific features
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [animationReduced, setAnimationReduced] = useState(false);
  const [readingLevel, setReadingLevel] = useState('standard'); // 'simple', 'standard', 'advanced'
  
  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('accessibilitySettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Apply saved settings
        setVoiceCommandsEnabled(settings.voiceCommandsEnabled || false);
        setSignLanguageEnabled(settings.signLanguageEnabled || false);
        setScreenReaderOptimized(settings.screenReaderOptimized || false);
        setCognitiveAssistEnabled(settings.cognitiveAssistEnabled || false);
        setSmartKeyboardEnabled(settings.smartKeyboardEnabled || false);
        setCaregiverModeEnabled(settings.caregiverModeEnabled || false);
        setMultiSensoryEnabled(settings.multiSensoryEnabled || false);
        setCommunityFeaturesEnabled(settings.communityFeaturesEnabled || false);
        setAccessibilityPassportEnabled(settings.accessibilityPassportEnabled || false);
        setEmotionalSupportEnabled(settings.emotionalSupportEnabled || false);
        
        setHighContrastMode(settings.highContrastMode || false);
        setFontSizeMultiplier(settings.fontSizeMultiplier || 1);
        setAnimationReduced(settings.animationReduced || false);
        setReadingLevel(settings.readingLevel || 'standard');
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    }
  }, []);
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      voiceCommandsEnabled,
      signLanguageEnabled,
      screenReaderOptimized,
      cognitiveAssistEnabled,
      smartKeyboardEnabled,
      caregiverModeEnabled,
      multiSensoryEnabled,
      communityFeaturesEnabled,
      accessibilityPassportEnabled,
      emotionalSupportEnabled,
      
      highContrastMode,
      fontSizeMultiplier,
      animationReduced,
      readingLevel,
    };
    
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [
    voiceCommandsEnabled,
    signLanguageEnabled,
    screenReaderOptimized,
    cognitiveAssistEnabled,
    smartKeyboardEnabled,
    caregiverModeEnabled,
    multiSensoryEnabled,
    communityFeaturesEnabled,
    accessibilityPassportEnabled,
    emotionalSupportEnabled,
    
    highContrastMode,
    fontSizeMultiplier,
    animationReduced,
    readingLevel,
  ]);
  
  const value = {
    // Feature toggles
    voiceCommandsEnabled,
    setVoiceCommandsEnabled,
    signLanguageEnabled,
    setSignLanguageEnabled,
    screenReaderOptimized,
    setScreenReaderOptimized,
    cognitiveAssistEnabled,
    setCognitiveAssistEnabled,
    smartKeyboardEnabled,
    setSmartKeyboardEnabled,
    caregiverModeEnabled,
    setCaregiverModeEnabled,
    multiSensoryEnabled,
    setMultiSensoryEnabled,
    communityFeaturesEnabled,
    setCommunityFeaturesEnabled,
    accessibilityPassportEnabled,
    setAccessibilityPassportEnabled,
    emotionalSupportEnabled,
    setEmotionalSupportEnabled,
    
    // Additional settings
    highContrastMode,
    setHighContrastMode,
    fontSizeMultiplier,
    setFontSizeMultiplier,
    animationReduced,
    setAnimationReduced,
    readingLevel, 
    setReadingLevel,
  };
  
  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider; 