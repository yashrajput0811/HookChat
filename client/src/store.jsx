import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Context for application-wide state management
 */
const StoreContext = createContext(null);

/**
 * StoreProvider - Global state management for the application
 * Manages user data, premium status, and accessibility settings
 * 
 * @param {Object} children - Child components that will have access to the store
 */
export const StoreProvider = ({ children }) => {
  // User state
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  
  // Accessibility settings with localStorage persistence
  const [accessibility, setAccessibility] = useState(() => {
    // Load saved accessibility settings from localStorage or use defaults
    try {
      const savedSettings = localStorage.getItem('accessibilitySettings');
      return savedSettings ? JSON.parse(savedSettings) : {
        fontSize: 'medium',
        highContrast: false,
        animations: true,
        dyslexicFont: false,
        textToSpeech: false,
        darkMode: true
      };
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
      return {
        fontSize: 'medium',
        highContrast: false,
        animations: true,
        dyslexicFont: false,
        textToSpeech: false,
        darkMode: true
      };
    }
  });

  // Automatically save and apply accessibility settings when they change
  useEffect(() => {
    try {
      // Save to localStorage
      localStorage.setItem('accessibilitySettings', JSON.stringify(accessibility));
      
      // Apply settings to document through data attributes
      document.documentElement.dataset.fontSize = accessibility.fontSize;
      document.documentElement.dataset.highContrast = accessibility.highContrast;
      document.documentElement.dataset.reducedAnimations = !accessibility.animations;
      document.documentElement.dataset.dyslexicFont = accessibility.dyslexicFont;
      
      // Apply special font for dyslexia if enabled
      if (accessibility.dyslexicFont) {
        document.documentElement.classList.add('font-dyslexic');
      } else {
        document.documentElement.classList.remove('font-dyslexic');
      }
      
      // Apply high contrast mode if enabled
      if (accessibility.highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
    }
  }, [accessibility]);

  // Expose state and state updaters to components
  const value = {
    user,
    setUser,
    isPremium,
    setIsPremium,
    accessibility,
    setAccessibility
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

/**
 * Custom hook to access the global store
 * @returns {Object} Store context with state and updater functions
 * @throws {Error} If used outside of StoreProvider
 */
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}; 