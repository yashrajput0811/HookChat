import React, { useEffect } from 'react';
import { useAccessibility } from '../../providers/AccessibilityProvider';

const HighContrastTheme = () => {
  const { highContrastMode, fontSizeMultiplier } = useAccessibility();
  
  useEffect(() => {
    const applyHighContrast = () => {
      const style = document.createElement('style');
      style.id = 'high-contrast-styles';
      
      // High contrast theme styles
      if (highContrastMode) {
        style.textContent = `
          :root {
            --high-contrast-bg: #000000;
            --high-contrast-text: #ffffff;
            --high-contrast-border: #ffffff;
            --high-contrast-focus: #ffff00;
            --high-contrast-button: #ffffff;
            --high-contrast-button-text: #000000;
            --high-contrast-link: #ffff00;
            --font-size-multiplier: ${fontSizeMultiplier};
          }
          
          /* Background colors */
          body, .bg-black, .bg-gray-900, .bg-gray-800, .bg-\[\#0c0c0c\], [class*="bg-gray-"] {
            background-color: var(--high-contrast-bg) !important;
          }
          
          /* Text colors */
          body, p, h1, h2, h3, h4, h5, h6, span, div, button, a, input, textarea, select, label {
            color: var(--high-contrast-text) !important;
          }
          
          /* Border colors */
          [class*="border-"], .border, *[style*="border"] {
            border-color: var(--high-contrast-border) !important;
          }
          
          /* Focus states */
          *:focus {
            outline: 3px solid var(--high-contrast-focus) !important;
            outline-offset: 2px !important;
          }
          
          /* Buttons */
          button:not([disabled]), .button, [role="button"], input[type="button"], input[type="submit"] {
            background-color: var(--high-contrast-button) !important;
            color: var(--high-contrast-button-text) !important;
            border: 2px solid var(--high-contrast-border) !important;
          }
          
          /* Links */
          a, .link {
            color: var(--high-contrast-link) !important;
            text-decoration: underline !important;
          }
          
          /* Increase font size globally based on multiplier */
          body {
            font-size: calc(16px * var(--font-size-multiplier)) !important;
          }
          
          h1 {
            font-size: calc(2rem * var(--font-size-multiplier)) !important;
          }
          
          h2 {
            font-size: calc(1.5rem * var(--font-size-multiplier)) !important;
          }
          
          h3 {
            font-size: calc(1.25rem * var(--font-size-multiplier)) !important;
          }
          
          p, span, div, button, a, input, textarea, select, label {
            font-size: calc(1rem * var(--font-size-multiplier)) !important;
          }
          
          /* Remove complex backgrounds and gradients */
          [class*="bg-gradient"], [style*="gradient"] {
            background: var(--high-contrast-bg) !important;
          }
          
          /* Improve input field contrast */
          input, textarea, select {
            background-color: var(--high-contrast-bg) !important;
            color: var(--high-contrast-text) !important;
            border: 2px solid var(--high-contrast-border) !important;
          }
          
          /* Remove opacity on elements */
          [class*="opacity-"], [style*="opacity"] {
            opacity: 1 !important;
          }
          
          /* Add strong border to message bubbles */
          .message-bubble {
            border: 2px solid var(--high-contrast-border) !important;
          }
          
          /* Maximize contrast between user and partner messages */
          .user-message {
            background-color: #000000 !important;
            color: #ffffff !important;
            border: 2px solid #ffffff !important;
          }
          
          .partner-message {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 2px solid #000000 !important;
          }
        `;
      } else {
        // Only apply font size adjustments if not in high contrast mode
        style.textContent = `
          :root {
            --font-size-multiplier: ${fontSizeMultiplier};
          }
          
          /* Increase font size globally based on multiplier */
          body {
            font-size: calc(16px * var(--font-size-multiplier)) !important;
          }
          
          h1 {
            font-size: calc(2rem * var(--font-size-multiplier)) !important;
          }
          
          h2 {
            font-size: calc(1.5rem * var(--font-size-multiplier)) !important;
          }
          
          h3 {
            font-size: calc(1.25rem * var(--font-size-multiplier)) !important;
          }
          
          p, span, div, button, a, input, textarea, select, label {
            font-size: calc(1rem * var(--font-size-multiplier)) !important;
          }
        `;
      }
      
      // Remove existing style if it exists
      const existingStyle = document.getElementById('high-contrast-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      // Add new style to head
      document.head.appendChild(style);
    };
    
    applyHighContrast();
    
    // Observe body for changes and reapply
    const observer = new MutationObserver((mutations) => {
      applyHighContrast();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    });
    
    return () => {
      observer.disconnect();
      const existingStyle = document.getElementById('high-contrast-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [highContrastMode, fontSizeMultiplier]);

  // This component doesn't render anything visible
  return null;
};

export default HighContrastTheme; 