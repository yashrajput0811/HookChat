import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../../providers/AccessibilityProvider';
import { IoKeypad, IoSend, IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

// Mock word prediction - in a real implementation, this would use a language model
const mockPredictWords = (text) => {
  if (!text) return [];
  
  const lastWord = text.split(' ').pop().toLowerCase();
  
  // Common word completions
  const commonWords = {
    'h': ['hello', 'hi', 'how', 'happy', 'help'],
    'th': ['the', 'this', 'that', 'thanks', 'they'],
    'wh': ['what', 'when', 'where', 'why', 'which'],
    'a': ['and', 'are', 'about', 'all', 'also'],
    'i': ['in', 'is', 'it', 'if', 'interesting'],
    'y': ['you', 'your', 'yes', 'year', 'yesterday'],
    'n': ['no', 'not', 'new', 'nice', 'now'],
    'w': ['with', 'was', 'will', 'we', 'would'],
    's': ['so', 'see', 'some', 'such', 'same'],
    'b': ['be', 'but', 'by', 'been', 'because'],
    'c': ['can', 'could', 'come', 'chat', 'cool'],
    'm': ['my', 'me', 'more', 'much', 'many'],
    't': ['to', 'the', 'that', 'this', 'time'],
    'd': ['do', 'did', 'day', 'don\'t', 'during'],
    'ha': ['have', 'had', 'happy', 'happen', 'habits'],
    'ho': ['how', 'hope', 'home', 'hour', 'hobby'],
    'lo': ['look', 'love', 'long', 'lost', 'local'],
    'g': ['good', 'great', 'go', 'get', 'give'],
    'ni': ['nice', 'night', 'nine', 'nimble', 'niche'],
    'gr': ['great', 'group', 'grand', 'grade', 'grow'],
    'int': ['interesting', 'into', 'internet', 'interview', 'intend'],
    'tha': ['thank', 'thanks', 'that', 'than', 'thank you'],
    'pl': ['please', 'place', 'plan', 'plus', 'pleasure'],
    'fi': ['find', 'fine', 'first', 'fill', 'finish']
  };
  
  // Context-based predictions based on common phrases
  const contextPredictions = {
    'how are': ['you', 'things', 'your day', 'we', 'they'],
    'nice to': ['meet you', 'hear that', 'see you', 'know', 'talk'],
    'i am': ['good', 'fine', 'happy', 'not sure', 'trying'],
    'do you': ['like', 'have', 'want', 'think', 'know'],
    'i like': ['your', 'to', 'that', 'how', 'when'],
    'thank': ['you', 'you so much', 'you for', 'goodness', 'god'],
    'what is': ['your name', 'that', 'it', 'happening', 'going on'],
    'i think': ['that', 'we', 'it\'s', 'you', 'about'],
    'i would': ['like to', 'love to', 'prefer', 'rather', 'say']
  };
  
  // Check for context-based predictions
  const lastTwoWords = text.trim().split(' ').slice(-2).join(' ').toLowerCase();
  if (contextPredictions[lastTwoWords]) {
    return contextPredictions[lastTwoWords];
  }
  
  // Check for single word completions
  for (const prefix in commonWords) {
    if (lastWord.startsWith(prefix)) {
      return commonWords[prefix];
    }
  }
  
  // Default suggestions
  return ['the', 'and', 'for', 'you', 'with'];
};

const SmartKeyboard = ({ onSendMessage, currentMessage = '', onUpdateMessage }) => {
  const { smartKeyboardEnabled } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  
  // Set initial value from props
  useEffect(() => {
    setInputValue(currentMessage);
  }, [currentMessage]);
  
  // Update predictions whenever input changes
  useEffect(() => {
    if (!smartKeyboardEnabled || !isOpen) return;
    
    const predictedWords = mockPredictWords(inputValue);
    setPredictions(predictedWords);
  }, [inputValue, smartKeyboardEnabled, isOpen]);

  // Keyboard rows
  const keyboardRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '?']
  ];
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  
  const handleKeyPress = (key) => {
    const newValue = inputValue + key;
    setInputValue(newValue);
    onUpdateMessage && onUpdateMessage(newValue);
  };
  
  const handleBackspace = () => {
    const newValue = inputValue.slice(0, -1);
    setInputValue(newValue);
    onUpdateMessage && onUpdateMessage(newValue);
  };
  
  const handleSpace = () => {
    const newValue = inputValue + ' ';
    setInputValue(newValue);
    onUpdateMessage && onUpdateMessage(newValue);
  };
  
  const handleSuggestionClick = (word) => {
    // Replace the last word with the suggested word
    const words = inputValue.split(' ');
    words.pop(); // Remove the last incomplete word
    
    const newValue = words.length > 0 
      ? words.join(' ') + ' ' + word + ' '
      : word + ' ';
      
    setInputValue(newValue);
    onUpdateMessage && onUpdateMessage(newValue);
  };
  
  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage && onSendMessage(inputValue);
      setInputValue('');
      onUpdateMessage && onUpdateMessage('');
    }
  };

  // Don't render if the feature is disabled
  if (!smartKeyboardEnabled) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={handleToggle}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${
          isOpen ? 'bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700'
        }`}
        aria-label="Toggle accessible keyboard"
      >
        <IoKeypad className="w-6 h-6" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 right-0 bg-gray-900 rounded-xl shadow-xl border border-gray-700 w-full max-w-md"
          >
            <div className="p-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Smart Keyboard</h3>
              <button
                onClick={handleToggle}
                className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center"
              >
                <IoClose className="w-4 h-4 text-white/70" />
              </button>
            </div>
            
            {/* Input field */}
            <div className="p-3 bg-gray-800">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    onUpdateMessage && onUpdateMessage(e.target.value);
                  }}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                >
                  <IoSend className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Word predictions */}
            <div className="px-2 py-1 flex flex-wrap gap-1">
              {predictions.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(word)}
                  className="bg-gray-800 text-white/90 px-3 py-1 rounded-lg text-sm hover:bg-indigo-600 transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>
            
            {/* Virtual keyboard */}
            <div className="p-2">
              {keyboardRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center mb-1 space-x-1">
                  {row.map((key, keyIndex) => (
                    <button
                      key={keyIndex}
                      onClick={() => handleKeyPress(key)}
                      className="w-8 h-8 bg-gray-800 text-white rounded flex items-center justify-center hover:bg-gray-700"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              ))}
              
              <div className="flex justify-center space-x-1 mt-1">
                <button
                  onClick={handleBackspace}
                  className="px-2 h-8 bg-gray-800 text-white rounded flex items-center justify-center hover:bg-gray-700"
                >
                  ⌫
                </button>
                <button
                  onClick={handleSpace}
                  className="w-40 h-8 bg-gray-800 text-white rounded flex items-center justify-center hover:bg-gray-700"
                >
                  Space
                </button>
                <button
                  onClick={handleSend}
                  className="px-3 h-8 bg-indigo-600 text-white rounded flex items-center justify-center hover:bg-indigo-700"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartKeyboard; 