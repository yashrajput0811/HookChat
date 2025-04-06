import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../providers/AccessibilityProvider';
import { IoMic, IoMicOff } from 'react-icons/io5';

const VoiceCommands = ({ onSendMessage, onNavigate }) => {
  const navigate = useNavigate();
  const { voiceCommandsEnabled } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [recognition, setRecognition] = useState(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!voiceCommandsEnabled) return;

    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US'; // Default language
      
      recognitionInstance.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setTranscript(currentTranscript);
        
        // Process commands for final results
        if (event.results[event.results.length - 1].isFinal) {
          processCommand(currentTranscript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setFeedback(`Error: ${event.error}`);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        if (isListening) {
          recognitionInstance.start();
        }
      };
      
      setRecognition(recognitionInstance);
    } else {
      setFeedback('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [voiceCommandsEnabled]);

  // Start/stop listening
  const toggleListening = useCallback(() => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setFeedback('Voice commands paused');
    } else {
      recognition.start();
      setFeedback('Listening for commands...');
    }
    
    setIsListening(!isListening);
  }, [isListening, recognition]);

  // Process voice commands
  const processCommand = useCallback((command) => {
    const lowercaseCommand = command.toLowerCase().trim();
    
    // Navigation commands
    if (lowercaseCommand.includes('go to home') || lowercaseCommand.includes('go home')) {
      setFeedback('Navigating to home page');
      navigate('/');
      return;
    }
    
    if (lowercaseCommand.includes('go to setup') || lowercaseCommand.includes('go to chat setup')) {
      setFeedback('Navigating to chat setup');
      navigate('/setup');
      return;
    }
    
    if (lowercaseCommand.includes('go to accessibility') || lowercaseCommand.includes('open accessibility settings')) {
      setFeedback('Opening accessibility settings');
      navigate('/accessibility');
      return;
    }
    
    if (lowercaseCommand.includes('go back')) {
      setFeedback('Going back');
      navigate(-1);
      return;
    }
    
    // Chat commands
    if (lowercaseCommand.includes('send message') || lowercaseCommand.includes('send')) {
      const messageMatch = lowercaseCommand.match(/send(?:\s+message)?\s+(.*)/i);
      if (messageMatch && messageMatch[1] && onSendMessage) {
        const messageContent = messageMatch[1].trim();
        setFeedback(`Sending message: "${messageContent}"`);
        onSendMessage(messageContent);
        return;
      }
    }
    
    // User preferences commands
    if (lowercaseCommand.includes('increase font size')) {
      setFeedback('Increasing font size');
      // This would be handled by the Accessibility Provider
      return;
    }
    
    if (lowercaseCommand.includes('decrease font size')) {
      setFeedback('Decreasing font size');
      // This would be handled by the Accessibility Provider
      return;
    }
    
    if (lowercaseCommand.includes('enable high contrast')) {
      setFeedback('Enabling high contrast mode');
      // This would be handled by the Accessibility Provider
      return;
    }
    
    if (lowercaseCommand.includes('disable high contrast')) {
      setFeedback('Disabling high contrast mode');
      // This would be handled by the Accessibility Provider
      return;
    }
    
    // If no command matched
    setFeedback('Command not recognized');
    
  }, [navigate, onSendMessage]);

  // Don't render if voice commands are disabled
  if (!voiceCommandsEnabled) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-5 z-50">
      <div 
        className={`absolute bottom-full right-0 mb-2 p-3 rounded-lg ${
          isListening ? 'bg-purple-600' : 'bg-gray-800'
        } text-white min-w-[200px] max-w-xs shadow-lg transform transition-all duration-200 ${
          feedback ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <p className="text-sm font-medium">{feedback}</p>
        {isListening && transcript && (
          <p className="text-xs mt-1 text-white/70 italic">"{transcript}"</p>
        )}
      </div>
      
      <button
        onClick={toggleListening}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${
          isListening 
            ? 'bg-purple-600 animate-pulse' 
            : 'bg-gray-800 hover:bg-gray-700'
        }`}
        aria-label={isListening ? 'Stop voice commands' : 'Start voice commands'}
      >
        {isListening ? <IoMic className="w-6 h-6" /> : <IoMicOff className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default VoiceCommands; 