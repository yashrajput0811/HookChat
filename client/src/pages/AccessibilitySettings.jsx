import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoChevronBack, IoCheckmark } from 'react-icons/io5';
import { useStore } from '../store';

/**
 * AccessibilitySettings - Page for customizing accessibility preferences
 * Provides options for font size, contrast, animations, and assistive features
 */
const AccessibilitySettings = () => {
  const navigate = useNavigate();
  const { accessibility, setAccessibility } = useStore();
  
  // Local state for settings before they're applied to the global store
  const [settings, setSettings] = useState({
    fontSize: accessibility?.fontSize || 'medium',
    highContrast: accessibility?.highContrast || false,
    animations: accessibility?.animations !== false, // default true
    dyslexicFont: accessibility?.dyslexicFont || false,
    textToSpeech: accessibility?.textToSpeech || false,
    darkMode: accessibility?.darkMode !== false, // default true
  });
  
  // Apply settings to global store whenever they change locally
  useEffect(() => {
    setAccessibility(settings);
  }, [settings, setAccessibility]);
  
  /**
   * Handle font size selection
   * @param {string} size - Size option (small, medium, large)
   */
  const handleChangeFontSize = (size) => {
    setSettings(prev => ({ ...prev, fontSize: size }));
  };
  
  /**
   * Toggle a boolean setting
   * @param {string} setting - The setting key to toggle
   */
  const handleToggle = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };
  
  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col">
      {/* Page Header */}
      <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl px-4 py-3 flex items-center z-10 border-b border-white/5">
        <motion.button 
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-white/5"
        >
          <IoChevronBack className="text-white" />
        </motion.button>
        <h1 className="text-xl font-medium text-white">Accessibility Settings</h1>
      </div>
      
      {/* Settings Container */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Text Size Settings */}
        <div className="space-y-4">
          <h2 className="text-white/90 font-medium text-lg">Text Size</h2>
          <div className="grid grid-cols-3 gap-3">
            {['small', 'medium', 'large'].map(size => (
              <button
                key={size}
                onClick={() => handleChangeFontSize(size)}
                className={`px-4 py-2 rounded-lg ${
                  settings.fontSize === size 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Display Settings */}
        <div className="space-y-4">
          <h2 className="text-white/90 font-medium text-lg">Display</h2>
          <div className="space-y-3">
            <ToggleOption 
              label="High Contrast Mode" 
              description="Increases contrast for better readability"
              isActive={settings.highContrast}
              onToggle={() => handleToggle('highContrast')}
            />
            <ToggleOption 
              label="Reduce Animations" 
              description="Minimizes motion effects throughout the app"
              isActive={!settings.animations}
              onToggle={() => handleToggle('animations')}
            />
            <ToggleOption 
              label="Dyslexia-friendly Font" 
              description="Uses a font designed to help with dyslexia"
              isActive={settings.dyslexicFont}
              onToggle={() => handleToggle('dyslexicFont')}
            />
          </div>
        </div>
        
        {/* Reading & Input Settings */}
        <div className="space-y-4">
          <h2 className="text-white/90 font-medium text-lg">Reading & Input</h2>
          <div className="space-y-3">
            <ToggleOption 
              label="Text-to-Speech" 
              description="Reads messages aloud"
              isActive={settings.textToSpeech}
              onToggle={() => handleToggle('textToSpeech')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ToggleOption - Reusable toggle setting component
 * 
 * @param {string} label - Name of the setting
 * @param {string} description - Explanation of what the setting does
 * @param {boolean} isActive - Current toggle state
 * @param {Function} onToggle - Callback when toggled
 */
const ToggleOption = ({ label, description, isActive, onToggle }) => (
  <div 
    onClick={onToggle}
    className="flex items-center justify-between bg-white/5 rounded-lg p-3 cursor-pointer hover:bg-white/8"
  >
    <div>
      <h3 className="text-white font-medium">{label}</h3>
      <p className="text-white/60 text-sm">{description}</p>
    </div>
    <div className={`w-12 h-6 rounded-full flex items-center px-1 ${isActive ? 'bg-purple-600 justify-end' : 'bg-white/10 justify-start'}`}>
      <div className="w-4 h-4 rounded-full bg-white"></div>
    </div>
  </div>
);

export default AccessibilitySettings; 