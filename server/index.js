import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import { v4 as uuidv4 } from 'uuid'
import dotenv from "dotenv"
import { translate } from '@vitalets/google-translate-api'

/**
 * Load environment variables from .env file
 */
dotenv.config()

/**
 * Initialize Express application
 * Set up CORS with proper configuration for websocket connections
 */
const app = express()
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}))
app.use(express.json())

/**
 * Translation endpoint for client messages
 * 
 * @route POST /translate
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'en', 'es', 'fr')
 * @returns {Object} JSON containing translated text
 */
app.post('/translate', async (req, res) => {
  try {
    const { text, targetLang } = req.body
    const result = await translate(text, { to: targetLang })
    res.json({ translatedText: result.text })
  } catch (error) {
    console.error('Translation error:', error)
    res.status(500).json({ error: 'Translation failed' })
  }
})

/**
 * Create HTTP server and Socket.io instance
 */
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
})

/**
 * In-memory data stores
 * - users: Map of user socket IDs to user data
 * - rooms: Map of room IDs to participant socket IDs
 */
const users = new Map()
const rooms = new Map()

/**
 * Find a matching chat partner based on common interests
 * 
 * @param {Object} socket - Socket of the user looking for a match
 * @param {Object} userData - User data including interests
 * @returns {string|null} Socket ID of the matched user or null if no match found
 */
function findMatch(socket, userData) {
  for (const [userId, user] of users) {
    // Don't match with self or already matched users
    if (userId !== socket.id && !user.matched) {
      // Check if they have at least one common interest
      const hasCommonInterests = userData.interests.some(interest => 
        user.interests.includes(interest)
      )
      
      if (hasCommonInterests) {
        return userId
      }
    }
  }
  return null
}

/**
 * Socket.io event handlers for real-time communication
 */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  /**
   * Handle user information and matching
   */
  socket.on("user_info", (userData) => {
    console.log("Received user info:", userData)
    users.set(socket.id, { ...userData, matched: false })
    
    // Try to find a match based on interests
    const matchId = findMatch(socket, userData)
    if (matchId) {
      const roomId = uuidv4()
      const matchedUser = users.get(matchId)
      
      // Update matched status for both users
      users.set(socket.id, { ...userData, matched: true })
      users.set(matchId, { ...matchedUser, matched: true })
      
      // Create and store room with both participants
      rooms.set(roomId, [socket.id, matchId])
      
      // Join both users to the room
      socket.join(roomId)
      io.sockets.sockets.get(matchId)?.join(roomId)
      
      // Notify both users with room ID and combined interests
      io.to(roomId).emit("chat_started", { 
        roomId,
        interests: [...new Set([...userData.interests, ...matchedUser.interests])]
      })
      console.log("Match found! Room created:", roomId)
    } else {
      console.log("No match found for user:", socket.id)
    }
  })

  /**
   * Handle sending messages within a room
   */
  socket.on("send_message", ({ roomId, message, type = 'text', imageUrl }) => {
    console.log("Message received:", { roomId, message, type })
    io.to(roomId).emit("receive_message", {
      sender: socket.id,
      message,
      type,
      imageUrl,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * Handle typing indicators
   */
  socket.on("typing", ({ roomId, isTyping }) => {
    socket.to(roomId).emit("partner_typing", { isTyping })
  })

  /**
   * Handle user disconnections
   * - Notify the partner
   * - Clean up room and user data
   */
  socket.on("disconnect", () => {
    // Find and clean up user's room
    for (const [roomId, participants] of rooms) {
      if (participants.includes(socket.id)) {
        // Notify other participant
        const otherUser = participants.find(id => id !== socket.id)
        if (otherUser) {
          io.to(otherUser).emit("partner_disconnected")
          users.set(otherUser, { ...users.get(otherUser), matched: false })
        }
        rooms.delete(roomId)
        break
      }
    }
    users.delete(socket.id)
    console.log("User disconnected:", socket.id)
  })
})

/**
 * Start the server
 */
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
