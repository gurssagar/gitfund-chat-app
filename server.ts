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

// Add CORS middleware before other routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const port = parseInt(process.env.PORT || "4000", 10);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingInterval: 25000, // default is 25000ms
  pingTimeout: 100000,
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
  
  // Return the username and a token (in production, use JWT or similar)
  res.status(200).json({ 
    status: 'success',
    username,
    token: username, // Simplified for demo - use proper auth tokens in production
    message: `Username ${username} is available`
  });
});

io.on("connection", (socket: Socket) => {
  console.log(`[Connection] Client connected: ${socket.id}`);
  
  socket.on('hello', (arg) => {
      console.log(`[Hello] SocketID: ${socket.id}, Arg: ${arg}`); // 'world'
  });

  // Register user with token from POST response
  socket.on('authenticate', ({ username, token }: { username: string, token: string }) => { // Changed any to string
    console.log(`[AuthAttempt] User: ${username}, Token: ${token}, SocketID: ${socket.id}`);
    // Verify token matches username (in production, verify properly)
    if (token !== username) {
      console.log(`[AuthReject] Invalid token for User: ${username}, SocketID: ${socket.id}`);
      socket.emit('auth_error', 'Invalid token');
      return;
    }

    if (activeConnections.has(username)) {
      const existingConnection = activeConnections.get(username);
      console.log(`[AuthReject] User ${username} already connected with SocketID: ${existingConnection?.socket.id}. New attempt from SocketID: ${socket.id}`);
      socket.emit('auth_error', 'User already connected');
      return;
    }

    activeConnections.set(username, { socket, username });
    console.log(`[AuthSuccess] User: ${username} added with SocketID: ${socket.id}. Active connections: ${Array.from(activeConnections.keys())}`);
    socket.emit('authenticated', { username });
  });

  // Private message handler with validation
  socket.on('privateMessage', (msg: ChatMessage) => {
    console.log(`[PrivateMessage] From: ${msg.from} To: ${msg.to} SocketID: ${socket.id}`);
    const sender = activeConnections.get(msg.from);
    if (!sender || sender.socket.id !== socket.id) {
      console.log(`[PrivateMessageError] Unauthorized attempt from SocketID: ${socket.id} as User: ${msg.from}`);
      socket.emit('error', 'Unauthorized message attempt');
      return;
    }

    const recipient = activeConnections.get(msg.to);
    if (!recipient) {
      console.log(`[PrivateMessageError] Recipient ${msg.to} not available for message from ${msg.from}`);
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

  socket.on('connect', () => {
    console.log(`[SocketConnectEvent] SocketID: ${socket.id} fired 'connect' event (this is unusual for server-side).`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`[Disconnect] SocketID: ${socket.id}, Reason: ${reason}`);
    let disconnectedUser: string | null = null;
    // Find user by socket.id to remove from activeConnections
    activeConnections.forEach((value, key) => {
      if (value.socket.id === socket.id) {
        disconnectedUser = key;
      }
    });

    if (disconnectedUser) {
      activeConnections.delete(disconnectedUser);
      console.log(`[UserRemoved] User: ${disconnectedUser} (SocketID: ${socket.id}) removed due to disconnect. Active connections: ${Array.from(activeConnections.keys())}`);
    } else {
      console.log(`[DisconnectNoUser] SocketID: ${socket.id} disconnected, but was not found in activeConnections (might not have authenticated).`);
    }
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