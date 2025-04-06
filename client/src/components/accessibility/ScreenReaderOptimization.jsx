import React, { useEffect } from 'react';
import { useAccessibility } from '../../providers/AccessibilityProvider';

const ScreenReaderOptimization = ({ messages, isTyping, isConnected }) => {
  const { screenReaderOptimized } = useAccessibility();
  
  // Apply optimizations for screen readers
  useEffect(() => {
    if (!screenReaderOptimized) return;
    
    // Add ARIA roles and labels to improve screen reader navigation
    const enhanceAccessibility = () => {
      // Enhance chat area
      const chatArea = document.querySelector('[data-testid="chat-messages"]');
      if (chatArea) {
        chatArea.setAttribute('role', 'log');
        chatArea.setAttribute('aria-live', 'polite');
        chatArea.setAttribute('aria-relevant', 'additions');
        chatArea.setAttribute('aria-label', 'Chat messages');
      }
      
      // Enhance message input
      const messageInput = document.querySelector('[data-testid="message-input"]');
      if (messageInput) {
        messageInput.setAttribute('aria-label', 'Type your message here');
      }
      
      // Add labels to buttons
      const buttons = document.querySelectorAll('button:not([aria-label])');
      buttons.forEach(button => {
        const iconEl = button.querySelector('svg');
        if (iconEl && !button.textContent.trim()) {
          // Try to infer button purpose from icon or context
          if (button.classList.contains('send-button')) {
            button.setAttribute('aria-label', 'Send message');
          } else if (button.classList.contains('emoji-button')) {
            button.setAttribute('aria-label', 'Choose emoji');
          } else if (button.classList.contains('image-upload')) {
            button.setAttribute('aria-label', 'Upload image');
          } else {
            button.setAttribute('aria-label', 'Button');
          }
        }
      });
      
      // Add descriptions to images
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach(img => {
        img.setAttribute('alt', 'Image in chat');
      });
    };
    
    // Run immediately and on DOM changes
    enhanceAccessibility();
    
    // Set up a mutation observer to detect DOM changes
    const observer = new MutationObserver((mutations) => {
      enhanceAccessibility();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });
    
    return () => {
      observer.disconnect();
    };
  }, [screenReaderOptimized]);
  
  // Announce new messages and status changes to screen readers
  useEffect(() => {
    if (!screenReaderOptimized || !messages || !messages.length) return;
    
    // Create an invisible element for announcements
    let announcer = document.getElementById('screen-reader-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'screen-reader-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(announcer);
    }
    
    // Announce new message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      const sender = lastMessage.sender === 'me' ? 'You' : 'Partner';
      const messageType = lastMessage.type === 'text' ? '' : `${lastMessage.type}`;
      const content = lastMessage.type === 'text' ? lastMessage.content : `${lastMessage.type} message`;
      
      announcer.textContent = `${sender} sent ${messageType} ${content}`;
    }
  }, [screenReaderOptimized, messages]);
  
  // Announce typing status
  useEffect(() => {
    if (!screenReaderOptimized) return;
    
    let announcer = document.getElementById('typing-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'typing-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('aria-live', 'polite');
      document.body.appendChild(announcer);
    }
    
    if (isTyping) {
      announcer.textContent = 'Your partner is typing';
    } else {
      announcer.textContent = '';
    }
  }, [screenReaderOptimized, isTyping]);
  
  // Announce connection status
  useEffect(() => {
    if (!screenReaderOptimized) return;
    
    let announcer = document.getElementById('connection-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'connection-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('aria-live', 'assertive');
      document.body.appendChild(announcer);
    }
    
    if (isConnected) {
      announcer.textContent = 'Connected to chat partner';
    } else {
      announcer.textContent = 'Looking for a chat partner';
    }
  }, [screenReaderOptimized, isConnected]);
  
  // Apply CSS for high contrast when needed
  useEffect(() => {
    if (screenReaderOptimized) {
      // Add screen-reader specific CSS
      const style = document.createElement('style');
      style.id = 'screen-reader-styles';
      style.textContent = `
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        
        /* Improve focus indicators */
        :focus {
          outline: 3px solid #fff !important;
          outline-offset: 2px !important;
        }
      `;
      
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('screen-reader-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [screenReaderOptimized]);
  
  // This component doesn't render anything visible
  return null;
};

export default ScreenReaderOptimization; 