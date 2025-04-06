# HookChat - Modern Anonymous Chat Platform

HookChat is a sleek, real-time anonymous chat application that connects people based on shared interests. With its stunning Apple-inspired UI and powerful features, HookChat creates meaningful conversations without requiring user registration.

## 📱 See HookChat in Action

[Watch the HookChat Demo Video](./samplevideo/2025-04-06%2018-43-59.mkv)

## ✨ Why Choose HookChat?

### 🎯 Perfect For
- Meeting new people with similar interests
- Practicing languages with native speakers
- Casual anonymous conversations
- Cross-cultural communication without language barriers

### 🚀 Standout Features

#### 🔄 Smart Matching System
- **Interest-Based**: Automatically paired with users who share your interests
- **Anonymous**: No registration, no personal data stored
- **Quick**: Get chatting in seconds, not minutes

#### 💬 Modern Chat Experience
- **Real-time Messaging**: Instant message delivery
- **Typing Indicators**: See when your chat partner is typing
- **Image Sharing**: Share images during your conversation
- **Rich Emoji Support**: Express yourself with a full emoji picker
- **Message Timestamps**: Keep track of conversation flow

#### 🌐 Breakthrough Translation
- **Real-Time Translation**: Chat with anyone, regardless of language
- **Seamless Integration**: Toggle translation on/off with a single click
- **Multiple Languages**: Supports dozens of languages automatically

#### 🎨 Premium Design
- **Apple-Inspired UI**: Sleek, minimal, and intuitive
- **Glassmorphism Effects**: Modern frosted glass aesthetics
- **Smooth Animations**: Polished micro-interactions throughout
- **Responsive Design**: Works perfectly on any device - desktop, tablet, or phone

#### ♿ Accessibility First
- **Font Size Controls**: Adjust text to your comfort level
- **High Contrast Mode**: Enhanced readability
- **Screen Reader Support**: Compatible with assistive technologies
- **Reduced Motion Option**: Control animation intensity
- **Dyslexia-Friendly Font**: Optional typography for easier reading

## 🛠️ Tech Stack

- **Frontend**: React with Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.IO
- **Translation**: Google Translate API

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)

### Quick Start (5 Minutes)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/HookChat.git
   cd HookChat
   ```

2. **Install all dependencies at once**
   ```bash
   npm run install:all
   ```

3. **Create environment file**
   - Copy `.env.example` to a new file called `.env` in the root directory
   ```bash
   # Windows
   copy .env.example .env
   
   # Linux/Mac
   cp .env.example .env
   ```

4. **Start the application**
   ```bash
   # Using npm script (works on all platforms)
   npm run dev

5. **Access the application**
   - Open your browser and navigate to:
     - Frontend: http://localhost:5173
     - Backend API: http://localhost:3001

## 🧪 Testing the Application

1. **Open two browser windows**
   - Use a regular window and an incognito window to simulate two different users
   - Navigate to http://localhost:5173 in both

2. **Set up users with matching interests**
   - In Window 1: Select preferences and add interests (e.g., "movies", "music")
   - In Window 2: Add at least one matching interest (e.g., "movies")
   - Click "Start Chatting" in both windows

3. **Try these features:**
   - Send text messages between windows
   - Upload and share an image
   - Test the emoji picker
   - Try typing to see the "typing" indicator
   - Toggle auto-translation if chatting in different languages
   - Test accessibility options from the floating menu

## 🔍 Troubleshooting

- **Port already in use?**
  ```bash
  # Windows
  taskkill /F /IM node.exe
  
  # Linux/Mac
  killall node
  ```

- **Connection issues?**
  - Ensure both client and server are running
  - Check console for error messages
  - Verify the correct URLs in your `.env` file

## 💡 Pro Tips

- **Better Matches**: Add multiple specific interests rather than a few general ones
- **Translation**: For best results, write clear, simple sentences
- **Performance**: Close other resource-intensive applications for smoother animations
- **Mobile Experience**: Add to your home screen for an app-like experience

---

Built with ❤️ by Yash Rajput 
