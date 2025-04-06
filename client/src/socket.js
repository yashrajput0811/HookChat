import io from 'socket.io-client';

/**
 * Backend server URL for socket connection
 * Can be configured through environment variables or defaults to localhost:3001
 */
const SOCKET_URL = 'http://localhost:3001';

/**
 * Configured socket.io client instance
 * - Uses both websocket and polling transports for maximum compatibility
 * - Includes credentials for potential auth requirements
 */
export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true
});

// Connection status event handlers
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
