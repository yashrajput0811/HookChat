import React, { useState, useEffect, useRef } from 'react';
import { IoAccessibility, IoClose, IoMicOutline, IoVolumeHigh } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';

/**
 * AccessibilityFeatures - Floating button with accessibility tools
 * Provides quick access to accessibility functions like voice input,
 * text-to-speech, and settings navigation.
 * 
 * @param {Array} messages - Chat messages for text-to-speech functionality
 * @param {boolean} isTyping - Whether the partner is currently typing
 * @param {boolean} isConnected - Whether the user is connected to a chat
 * @param {Function} onSendMessage - Callback to send a message
 * @param {Function} onSignDetected - Callback when sign language is detected
 * @param {string} currentMessage - Current message input value
 * @param {Function} onUpdateMessage - Callback to update the message input
 */
const AccessibilityFeatures = ({ 
  messages = [], 
  isTyping, 
  isConnected, 
  onSendMessage, 
  onSignDetected,
  currentMessage,
  onUpdateMessage
}) => {
  const navigate = useNavigate();
  const { accessibility } = useStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const speechSynthesisRef = useRef(null);
  
  // Automatically read partner messages aloud when text-to-speech is enabled
  useEffect(() => {
    if (accessibility?.textToSpeech && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Only read partner messages of type text
      if (lastMessage.sender === 'partner' && lastMessage.type === 'text') {
        // Use browser's native speech synthesis API
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(lastMessage.content);
          window.speechSynthesis.speak(utterance);
          speechSynthesisRef.current = utterance;
        }
      }
    }
    
    // Cleanup speech synthesis on unmount
    return () => {
      if (speechSynthesisRef.current && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [messages, accessibility]);
  
  /**
   * Start voice recognition to input messages by voice
   * Note: This is a simulated implementation for demo purposes
   */
  const startVoiceRecognition = () => {
    setIsListening(true);
    
    // Simulate voice recognition with a timeout
    // In a production app, this would use the Web Speech API
    setTimeout(() => {
      if (onUpdateMessage && typeof onUpdateMessage === 'function') {
        onUpdateMessage(prev => prev + " Hi there! ");
      }
      setIsListening(false);
    }, 3000);
  };
  
  /**
   * Stop voice recognition
   */
  const stopVoiceRecognition = () => {
    setIsListening(false);
  };

  return (
    <div className="fixed bottom-5 left-5 z-40">
      {/* Main accessibility button */}
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-12 h-12 rounded-full flex items-center justify-center text-white bg-purple-600 shadow-lg"
        aria-label="Accessibility settings"
      >
        {showMenu ? <IoClose className="w-6 h-6" /> : <IoAccessibility className="w-6 h-6" />}
      </motion.button>
      
      {/* Dropdown menu with accessibility options */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 left-0 bg-[rgba(30,30,30,0.95)] backdrop-blur-xl rounded-lg shadow-xl border border-white/10 p-3 w-64"
          >
            <div className="space-y-3">
              {/* Navigate to accessibility settings page */}
              <button
                onClick={() => navigate('/accessibility')}
                className="w-full text-left px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white flex items-center"
              >
                <span className="flex-1">Accessibility Settings</span>
              </button>
              
              {/* Show chat-specific accessibility tools when connected */}
              {isConnected && (
                <>
                  {/* Voice input toggle button */}
                  <button
                    onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                    className={`w-full text-left px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white flex items-center ${isListening ? 'bg-purple-600/30' : ''}`}
                  >
                    <span className="flex-1">{isListening ? 'Stop Voice Input' : 'Start Voice Input'}</span>
                    <IoMicOutline className={`w-5 h-5 ${isListening ? 'text-purple-400 animate-pulse' : ''}`} />
                  </button>
                  
                  {/* Text-to-speech controls */}
                  <button
                    onClick={() => {
                      if (accessibility?.textToSpeech) {
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                        }
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white flex items-center ${accessibility?.textToSpeech ? 'bg-purple-600/30' : ''}`}
                  >
                    <span className="flex-1">Read Aloud Controls</span>
                    <IoVolumeHigh className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccessibilityFeatures;