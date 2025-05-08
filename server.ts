import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

interface ChatMessage {
  text: string;
  timestamp: string;
  to: string;
  from: string;
}

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST","DELETE"]
  }
});

// Add middleware for parsing JSON
app.use(bodyParser.json());



// Store connected users with their active connections
const activeConnections = new Map<string, { socket: Socket, username: string }>();

// Add POST endpoint for username registration
app.post('/register', (req, res) => {
  const { username } = req.body;
  console.log(`Received registration request for ${username}`);
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  if (activeConnections.has(username)) {
    return res.status(409).json({ error: 'Username already taken' });
  }
  
  // In production, you would verify the token here
  res.status(200).json({ 
    status: 'success',
    username,
    message: `Username ${username} is available`
  });
});

io.on("connection", (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Register user with authentication token
  socket.on('authenticate', ({ username }: { username: string }) => {
    if (activeConnections.has(username)) {
      socket.emit('auth_error', 'User already connected');
      return;
    }

    // In production, verify token against your auth system
    activeConnections.set(username, { socket, username });
    socket.emit('authenticated', { username });
  });

  // Private message handler with validation
  socket.on('privateMessage', (msg: ChatMessage) => {
    const sender = activeConnections.get(msg.from);
    if (!sender || sender.socket.id !== socket.id) {
      socket.emit('error', 'Unauthorized message attempt');
      return;
    }

    const recipient = activeConnections.get(msg.to);
    if (!recipient) {
      socket.emit('error', 'Recipient not available');
      return;
    }

    // Verify both users are allowed to communicate
    if (shouldUsersCommunicate(msg.from, msg.to)) {
      recipient.socket.emit('privateMessage', msg);
      socket.emit('messageDelivered', { 
        to: msg.to,
        timestamp: new Date().toISOString()
      });
    } else {
      socket.emit('error', 'Communication not allowed');
    }
  });

  socket.on("disconnect", () => {
    // Clean up connection
    activeConnections.forEach((value, key) => {
      if (value.socket.id === socket.id) {
        activeConnections.delete(key);
        console.log(`User disconnected: ${key}`);
      }
    });
  });
});

// Helper function to validate communication permissions
function shouldUsersCommunicate(user1: string, user2: string): boolean {
  // Implement your business logic here
  // Example: Check if users are friends, in same group, etc.
  return true; // For now allowing all communications
}

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;