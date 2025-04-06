import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home.jsx';
import Chat from './pages/Chat.jsx';
import Landing from './pages/Landing.jsx';
import AccessibilityProvider from './providers/AccessibilityProvider.jsx';
import AccessibilitySettings from './pages/AccessibilitySettings.jsx';

function App() {
  // Apply some global effects (like overflow: hidden) for iOS devices
  useEffect(() => {
    document.documentElement.classList.add('h-full');
    document.body.classList.add('h-full', 'overflow-hidden');
    
    // Disable iOS scaling
    const metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport) {
      metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
    }
    
    return () => {
      document.documentElement.classList.remove('h-full');
      document.body.classList.remove('h-full', 'overflow-hidden');
    };
  }, []);

  return (
    <AccessibilityProvider>
      <Router>
        <div className="fixed inset-0 bg-black">
          {/* Background gradients */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -top-[30%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[100px]" />
            <div className="absolute top-[40%] -left-[20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[100px]" />
            <div className="absolute -bottom-[20%] left-[50%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[100px]" />
          </div>
          
          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 z-0 opacity-30 mix-blend-soft-light" 
            style={{ 
              backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')",
              backgroundRepeat: 'repeat'
            }} 
          />
          
          {/* Main content area */}
          <div className="relative z-10 h-full overflow-hidden">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/setup" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/accessibility" element={<AccessibilitySettings />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AccessibilityProvider>
  );
}

export default App;
