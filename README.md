# HookChat - Anonymous Chat Application

HookChat is a real-time anonymous chat application that matches users based on their interests. Built with React, Node.js, and Socket.IO, it features a premium Apple-inspired UI with real-time translation capabilities.

## Features

- 🌐 **Interest-Based Matching**: Connect with users who share your interests
- 🔄 **Real-Time Translation**: Automatic message translation for cross-language communication
- 🎨 **Premium Design**: 
  - Apple-inspired minimalist aesthetics
  - Dark mode UI with sleek glassmorphism effects
  - Smooth animations and transitions
  - Responsive and adaptive layouts
- 💬 **Rich Chat Features**:
  - Real-time messaging
  - Typing indicators
  - Message timestamps
  - Image sharing
  - Emoji picker
  - Online/Offline status
- 🛡️ **Anonymous**: No registration required, just pick your preferences and start chatting
- 📱 **Responsive Design**: Works seamlessly on both desktop and mobile devices
- ♿ **Accessibility Features**: Font size adjustments, high contrast mode, text-to-speech

## Design Philosophy

HookChat's UI follows a minimalist, Apple-inspired design philosophy:
- Clean, distraction-free interfaces
- Purposeful animations and micro-interactions
- High-contrast typography with careful spacing
- Subtle depth through shadows and glassmorphism
- Focus on content and user experience

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashrajput0811/HookChat.git
   cd HookChat
   ```

2. **Install all dependencies at once**
   ```bash
   npm run install:all
   ```
   This will install dependencies for:
   - Root project
   - Client application
   - Server application

3. **Create a `.env` file in the root directory**
   ```env
   # Server Configuration
   PORT=3001
   CLIENT_URL=http://localhost:5173

   # Feature Flags
   ENABLE_PREMIUM_FEATURES=false
   ENABLE_GHOST_MODE=false
   ENABLE_CUSTOM_AVATARS=false
   ```

## Running the Application

### Start Both Client and Server
Run the following command in the root directory:
```bash
npm run dev
```

This will launch:
- Client: http://localhost:5173
- Server: http://localhost:3001

### Running Components Separately

If needed, you can run the client and server separately:

For the client:
```bash
cd client
npm run dev
```

For the server:
```bash
cd server
npm start
```

## Application Structure

- `client/`: React frontend application (Vite)
  - `src/components/`: Reusable UI components
  - `src/pages/`: Main application pages
  - `src/providers/`: Context providers
  - `src/store/`: State management
  - `src/services/`: API services
- `server/`: Node.js backend server (Express + Socket.IO)
  - `index.js`: Main server file with Socket.IO logic

## Testing the Application

1. **Basic Setup Test**
   - Open two different browser windows to `http://localhost:5173`
   - This allows you to test the chat as two different users

2. **User Matching Test**
   In the first window:
   - Select your gender
   - Choose your country
   - Add at least one interest (e.g., "movies")
   - Click "Start Chatting"

   In the second window:
   - Select different or same preferences
   - Add at least one matching interest
   - Click "Start Chatting"
   - Users should be matched if they share at least one common interest

3. **Feature Testing**
   - **Real-time Chat**: Send messages between the two windows
   - **Translation**: Enable Auto-Translate and send messages in different languages
   - **Image Sharing**: Click the image icon and upload an image
   - **Emojis**: Click the emoji icon to open the emoji picker
   - **Typing Indicator**: Start typing to see the "Partner is typing..." indicator
   - **Accessibility**: Test the accessibility features from the floating button

## Dependencies

### Server Dependencies
- express - Web server framework
- socket.io - Real-time communication
- cors - Cross-origin resource sharing
- @vitalets/google-translate-api - Message translation
- dotenv - Environment variable management
- uuid - Unique ID generation

### Client Dependencies
- react - UI library
- react-router-dom - Routing
- socket.io-client - Real-time communication client
- framer-motion - Animations
- react-icons - Icon library
- emoji-picker-react - Emoji selection
- axios - HTTP requests
- tailwindcss - Styling

## Troubleshooting

1. **Port Already in Use**
   ```bash
   # Windows
   taskkill /F /IM node.exe
   
   # Linux/Mac
   killall node
   ```

2. **Connection Issues**
   - Ensure both server and client are running
   - Check if the ports 3001 and 5173 are available
   - Verify the CLIENT_URL in server's .env matches the client's URL
   - Clear browser cache or try incognito mode

3. **Windows PowerShell Issues**
   - If you encounter command chaining issues with PowerShell, use the start.bat file
   ```bash
   .\start.bat
   ```

## Key Features in Detail

### Interest-Based Matching
The application uses a simple but effective algorithm to match users based on common interests. When a user joins, their interests are compared against other waiting users, and a match is made when at least one interest overlaps.

### Real-Time Translation
Messages can be automatically translated to the receiver's language by toggling the translation icon in the chat header. This feature uses Google's translation API via the @vitalets/google-translate-api package.

### Accessibility Features
The application includes several accessibility enhancements:
- Font size adjustments (small, medium, large)
- High contrast mode
- Reduced animations option
- Dyslexia-friendly font
- Text-to-speech for incoming messages

## Contributing

Feel free to submit issues and enhancement requests! The codebase uses comprehensive JSDoc comments to make contribution easier. 