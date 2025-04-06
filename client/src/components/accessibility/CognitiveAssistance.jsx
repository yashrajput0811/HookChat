import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../providers/AccessibilityProvider';
import { IoBook, IoClose, IoInformationCircle } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

// Mock function to simplify text - in a real app this would use an NLP service or AI model
const mockSimplifyText = (text, level) => {
  // This is just a demo
  if (level === 'simple') {
    return text
      .replace(/utilize/g, 'use')
      .replace(/inquire/g, 'ask')
      .replace(/commence/g, 'start')
      .replace(/terminate/g, 'end')
      .replace(/sufficient/g, 'enough')
      .replace(/demonstrate/g, 'show')
      .replace(/modification/g, 'change')
      .replace(/attempt/g, 'try')
      .replace(/comprehend/g, 'understand')
      .replace(/assistance/g, 'help');
  }
  return text;
};

// Mock function to summarize conversation
const mockSummarizeConversation = (messages) => {
  if (!messages || messages.length === 0) {
    return "No messages yet.";
  }
  
  const topics = [
    "Discussing interests",
    "Sharing personal experiences",
    "Talking about hobbies",
    "Making plans",
    "Asking questions about each other",
    "Sharing opinions"
  ];
  
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const messageCount = messages.length;
  
  return `This conversation has ${messageCount} messages. Main topics: ${randomTopic}.`;
};

const CognitiveAssistance = ({ messages = [], onSendMessage }) => {
  const { cognitiveAssistEnabled, readingLevel } = useAccessibility();
  const [simplifiedMessages, setSimplifiedMessages] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [conversationSummary, setConversationSummary] = useState('');
  const [lastProcessedCount, setLastProcessedCount] = useState(0);

  // Process messages for simplified text
  useEffect(() => {
    if (!cognitiveAssistEnabled) return;
    
    if (messages && messages.length > 0 && messages.length !== lastProcessedCount) {
      const processed = messages.map(msg => ({
        ...msg,
        simplifiedContent: mockSimplifyText(msg.content, readingLevel)
      }));
      
      setSimplifiedMessages(processed);
      setLastProcessedCount(messages.length);
      
      // Generate a new summary if more than 5 new messages since last summary
      if (messages.length - lastProcessedCount >= 5 || lastProcessedCount === 0) {
        setConversationSummary(mockSummarizeConversation(messages));
      }
    }
  }, [cognitiveAssistEnabled, messages, readingLevel, lastProcessedCount]);

  // Don't render anything if feature is disabled
  if (!cognitiveAssistEnabled) {
    return null;
  }

  return (
    <>
      {/* Message Simplification - this would be applied to the chat messages in the actual implementation */}
      <div className="fixed bottom-20 right-20 z-50">
        <button
          onClick={() => setShowSummary(true)}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg bg-blue-500 hover:bg-blue-600"
          aria-label="Show conversation summary"
        >
          <IoBook className="w-6 h-6" />
        </button>
      </div>
      
      {/* Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-white">Conversation Summary</h3>
                <button
                  onClick={() => setShowSummary(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white bg-white/10 hover:bg-white/20"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <p className="text-white/90">{conversationSummary}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="min-w-[24px] mt-0.5">
                    <IoInformationCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-sm text-white/70">
                    We've analyzed your conversation to provide this summary. This helps you keep track of the main topics.
                  </p>
                </div>
                
                {simplifiedMessages.length > 0 && (
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-lg font-medium text-white mb-2">Recent Messages</h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                      {simplifiedMessages.slice(-3).map((msg, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-3">
                          <p className="text-sm font-medium text-white/60 mb-1">
                            {msg.sender === 'me' ? 'You' : 'Partner'}:
                          </p>
                          <p className="text-white/90">
                            {readingLevel === 'simple' ? msg.simplifiedContent : msg.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowSummary(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CognitiveAssistance; 