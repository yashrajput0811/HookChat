import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../../providers/AccessibilityProvider';
import { IoVideocam, IoVideocamOff, IoHand } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

// Mock sign language detection service
// In a real implementation, this would use machine learning models
const mockDetectSign = (videoFrame) => {
  // This is a simulated function
  // In a real app, we would use something like TensorFlow.js or a 3rd party API
  
  // For demo purposes, we'll just return random predefined signs every few seconds
  const signs = [
    "hello", "how are you", "thank you", "yes", "no", 
    "help", "please", "good", "bad", "understand",
    "name", "meet", "nice", "friend", "chat"
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomSign = signs[Math.floor(Math.random() * signs.length)];
      resolve(randomSign);
    }, 2000); // Simulate processing delay
  });
};

const SignLanguageTranslator = ({ onSignDetected }) => {
  const { signLanguageEnabled } = useAccessibility();
  const [isActive, setIsActive] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [processingSign, setProcessingSign] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  // Start/stop webcam and sign detection
  useEffect(() => {
    if (!signLanguageEnabled) return;

    if (isActive) {
      // Start webcam
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
          
          // Start sign detection at intervals
          detectionIntervalRef.current = setInterval(async () => {
            if (!processingSign && videoRef.current) {
              setProcessingSign(true);
              
              try {
                // In a real implementation, we would capture the current video frame
                // and process it with a machine learning model
                const signText = await mockDetectSign();
                
                if (signText) {
                  setDetectedText(signText);
                  if (onSignDetected) {
                    onSignDetected(signText);
                  }
                }
              } catch (error) {
                console.error('Sign language detection error:', error);
              } finally {
                setProcessingSign(false);
              }
            }
          }, 3000); // Process every 3 seconds
        })
        .catch(err => {
          console.error('Error accessing webcam:', err);
          setIsActive(false);
        });
    } else {
      // Stop webcam
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // Stop detection interval
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    }
    
    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isActive, signLanguageEnabled, onSignDetected, processingSign]);

  const toggleTranslator = () => {
    setIsActive(prev => !prev);
  };
  
  const toggleVideoVisibility = () => {
    setShowVideo(prev => !prev);
  };

  // Don't render if feature is disabled
  if (!signLanguageEnabled) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-5 z-50">
      {/* Video preview */}
      <AnimatePresence>
        {isActive && showVideo && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-3 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl"
          >
            <div className="relative">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                className="w-48 h-36 object-cover"
              />
              
              {processingSign && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            
            {detectedText && (
              <div className="p-2 text-center border-t border-gray-700">
                <p className="text-sm font-medium text-white">
                  Detected: <span className="text-purple-400">{detectedText}</span>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex space-x-2">
        <button
          onClick={toggleTranslator}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${
            isActive 
              ? 'bg-purple-600' 
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
          aria-label={isActive ? 'Stop sign language translator' : 'Start sign language translator'}
        >
          <IoHand className="w-6 h-6" />
        </button>
        
        {isActive && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={toggleVideoVisibility}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg bg-gray-800 hover:bg-gray-700"
            aria-label={showVideo ? 'Hide video preview' : 'Show video preview'}
          >
            {showVideo ? <IoVideocamOff className="w-6 h-6" /> : <IoVideocam className="w-6 h-6" />}
          </motion.button>
        )}
      </div>
      
      {/* Status indicator */}
      {isActive && (
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-green-500 border-2 border-gray-800">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        </div>
      )}
    </div>
  );
};

export default SignLanguageTranslator; 