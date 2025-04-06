import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { socket } from '../socket';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSend, IoImage, IoHappy, IoLanguage, IoEllipsisVertical, IoChevronBack, IoClose } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import LoadingAnimation from '../components/LoadingAnimation';
import AccessibilityFeatures from '../components/accessibility/AccessibilityFeatures';

/**
 * Chat - Main component for the real-time chat experience
 * Handles the connection with a matched user, messaging, typing indicators,
 * and various chat features (emojis, images, translation)
 */
const Chat = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  
  // UI state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [matchInfo, setMatchInfo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Get user info from localStorage or redirect to home
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/');
      return;
    }

    // Initialize connection and send user info to server
    socket.emit('user_info', userInfo);
    console.log('Emitting user info:', userInfo);

    // Handle chat start event when matched with a partner
    socket.on('chat_started', ({ roomId, interests }) => {
      console.log('Chat started:', roomId);
      setRoomId(roomId);
      setIsConnected(true);
      setMatchInfo({ interests });
    });

    // Handle incoming messages with translation if enabled
    socket.on('receive_message', async ({ sender, message, timestamp, type, imageUrl }) => {
      const newMsg = {
        id: Date.now() + Math.random().toString(36).substring(7),
        sender: sender === socket.id ? 'me' : 'partner',
        content: message,
        timestamp,
        type: type || 'text',
        imageUrl
      };

      // Apply translation for partner messages if auto-translate is enabled
      if (autoTranslate && sender !== socket.id && type !== 'image') {
        try {
          const response = await axios.post('http://localhost:3001/translate', {
            text: message,
            targetLang: navigator.language.split('-')[0]
          });
          newMsg.translation = response.data.translatedText;
        } catch (error) {
          console.error('Translation error:', error);
        }
      }

      setMessages(prev => [...prev, newMsg]);
    });

    // Handle typing indicator from partner
    socket.on('partner_typing', ({ isTyping }) => {
      setIsPartnerTyping(isTyping);
    });

    // Handle partner disconnection
    socket.on('partner_disconnected', () => {
      setMessages(prev => [...prev, { 
        id: Date.now() + Math.random().toString(36).substring(7),
        type: 'system', 
        content: 'Your chat partner has disconnected.' 
      }]);
      setIsConnected(false);
    });

    // Cleanup socket listeners on unmount
    return () => {
      socket.off('chat_started');
      socket.off('receive_message');
      socket.off('partner_typing');
      socket.off('partner_disconnected');
    };
  }, [user, navigate, autoTranslate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Send a message or image to the chat
   */
  const handleSend = async () => {
    if (!newMessage.trim() && !imagePreview) return;
    
    if (imagePreview) {
      // Send image message
      socket.emit('send_message', {
        roomId,
        message: 'Image',
        type: 'image',
        imageUrl: imagePreview
      });
      setImagePreview(null);
    }

    if (newMessage.trim()) {
      // Send text message
      socket.emit('send_message', {
        roomId,
        message: newMessage.trim()
      });
    }
    
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  /**
   * Handle input changes and send typing status to partner
   */
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing event
    socket.emit('typing', { roomId, isTyping: e.target.value.length > 0 });
    
    // Stop typing indication after 1.5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { roomId, isTyping: false });
    }, 1500);
  };

  /**
   * Handle image upload from device
   */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Add emoji to the current message input
   */
  const handleEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
  };

  /**
   * Send message on Enter key press (without shift)
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * Navigate back to home/setup page
   */
  const handleNewChat = () => {
    navigate('/');
  };
  
  /**
   * Add detected sign language text to message input
   */
  const handleSignDetected = (signText) => {
    if (signText) {
      setNewMessage(prev => prev ? `${prev} ${signText}` : signText);
    }
  };

  // Show loading/matching screen when not connected to a chat
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl rounded-xl p-8 text-center max-w-md w-full mx-4 border border-white/10 shadow-2xl"
        >
          <LoadingAnimation 
            type="pulse" 
            size="large" 
            text="Finding Your Match" 
            subText="We're looking for someone who shares your interests"
          />
          
          <motion.button 
            onClick={handleNewChat}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 bg-white/5 rounded-lg text-white/80 hover:text-white text-sm font-medium border border-white/10 transition-all duration-200 mt-6"
          >
            Cancel
          </motion.button>
        </motion.div>
        
        {/* Accessibility features available even during matching */}
        <AccessibilityFeatures
          isConnected={isConnected}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col">
      {/* Chat Header - Shows partner info and controls */}
      <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl px-4 py-3 flex items-center justify-between z-10 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <motion.button 
            onClick={handleNewChat}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5"
          >
            <IoChevronBack className="text-white" />
          </motion.button>
          <div>
            <p className="text-sm text-white/70">Chatting with</p>
            <h1 className="text-white font-medium">Anonymous</h1>
          </div>
        </div>
        
        <div className="flex items-center">
          <motion.button
            onClick={() => setAutoTranslate(!autoTranslate)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-8 h-8 mr-2 flex items-center justify-center rounded-full ${
              autoTranslate ? 'bg-purple-600' : 'bg-white/5'
            }`}
            aria-label={autoTranslate ? 'Disable auto-translate' : 'Enable auto-translate'}
          >
            <IoLanguage className="text-white" />
          </motion.button>
          
          <div className="relative">
            <motion.button
              onClick={() => setShowOptions(!showOptions)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5"
              aria-label="More options"
            >
              <IoEllipsisVertical className="text-white" />
            </motion.button>
            
            {/* Options Dropdown Menu */}
            <AnimatePresence>
              {showOptions && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-10 w-48 bg-[rgba(30,30,30,0.95)] backdrop-blur-xl rounded-lg shadow-xl border border-white/10 z-20"
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowOptions(false);
                        navigate('/accessibility');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      Accessibility Settings
                    </button>
                    <button
                      onClick={() => {
                        // Clear chat history
                        setMessages([]);
                        setShowOptions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      Clear Chat
                    </button>
                    <button
                      onClick={() => {
                        // End the chat
                        handleNewChat();
                        setShowOptions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white text-red-400 hover:text-red-300"
                    >
                      End Chat
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Chat Messages Area - Displays all messages and indicators */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10"
        data-testid="chat-messages"
      >
        {/* Common interests indicator */}
        {matchInfo && (
          <div className="bg-white/5 rounded-lg p-3 mb-4 text-center">
            <p className="text-sm text-white/70">
              You both like: <span className="text-purple-400 font-medium">{matchInfo.interests.join(', ')}</span>
            </p>
          </div>
        )}
        
        {/* Message bubbles */}
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl p-3 message-bubble ${
                message.type === 'system' 
                  ? 'bg-gray-800/80 text-center mx-auto'
                  : message.sender === 'me'
                    ? 'bg-purple-600 user-message'
                    : 'bg-white/5 partner-message'
              }`}
            >
              {message.type === 'image' ? (
                <img 
                  src={message.imageUrl} 
                  alt="Shared image" 
                  className="rounded-lg max-w-full h-auto"
                />
              ) : (
                <p className={`text-${message.sender === 'me' ? 'white' : 'white/90'}`}>
                  {message.content}
                </p>
              )}
              
              {/* Translation if available */}
              {message.translation && (
                <p className="text-sm text-white/70 mt-1 border-t border-white/10 pt-1 italic">
                  {message.translation}
                </p>
              )}
              
              <span className="text-xs text-white/50 block text-right mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isPartnerTyping && (
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input Area */}
      <div className="p-3 bg-[rgba(255,255,255,0.03)] backdrop-blur-md border-t border-white/5">
        {/* Image preview if an image is selected */}
        {imagePreview && (
          <div className="mb-2 relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="h-20 rounded-lg object-cover"
            />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-1 right-1 bg-black/50 rounded-full w-6 h-6 flex items-center justify-center"
            >
              <IoClose className="text-white text-sm" />
            </button>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          {/* Image upload button */}
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center bg-white/5 text-white/80 hover:text-white"
            aria-label="Upload image"
          >
            <IoImage className="text-lg" />
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*"
            />
          </motion.button>
          
          {/* Message text input */}
          <div className="relative flex-1">
            <textarea
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              className="w-full bg-white/5 text-white rounded-2xl px-4 py-2 outline-none resize-none"
              placeholder="Type a message..."
              rows="1"
              data-testid="message-input"
            />
          </div>
          
          {/* Emoji picker button */}
          <motion.button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center bg-white/5 text-white/80 hover:text-white emoji-button"
            aria-label="Choose emoji"
          >
            <IoHappy className="text-lg" />
          </motion.button>
          
          {/* Send button */}
          <motion.button
            onClick={handleSend}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center bg-purple-600 text-white send-button"
            aria-label="Send message"
          >
            <IoSend className="text-lg" />
          </motion.button>
        </div>
        
        {/* Emoji Picker Popup */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 right-4 z-10"
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} height={350} width={320} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Accessibility Features Component */}
      <AccessibilityFeatures
        messages={messages}
        isTyping={isPartnerTyping}
        isConnected={isConnected}
        onSendMessage={(text) => {
          setNewMessage(text);
          // Trigger send after updating the message
          setTimeout(() => {
            socket.emit('send_message', {
              roomId,
              message: text.trim()
            });
            setNewMessage('');
          }, 100);
        }}
        onSignDetected={handleSignDetected}
        currentMessage={newMessage}
        onUpdateMessage={setNewMessage}
      />
    </div>
  );
};

export default Chat; 