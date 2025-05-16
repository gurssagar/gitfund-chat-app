import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";

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
// Update the Server initialization to include auth middleware
const io = new Server(httpServer, {
  pingInterval: 25000, // default is 25000ms
  pingTimeout: 100000,
  cors: {
    origin: "*",
    methods: ["GET", "POST","DELETE"]
  }
});

// Add middleware for Socket.io authentication
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("Invalid username"));
  }
  
  // Attach the username to the socket for later use
  socket.data.username = username;
  next();
});



// Store connected users with their active connections
const activeConnections = new Map<string, { socket: Socket, username: string, connectionTime: number }>();



io.on("connection", (socket: Socket) => {
  console.log(`[Connection] Client connected: ${socket.id}`);
  
  // Get the username from socket data (set in middleware)
  const username = socket.data.username;
  
  // If username exists, handle the connection
  if (username) {
    console.log(`[Auth] User ${username} connected with SocketID: ${socket.id}`);
    
    // Check if user already exists in activeConnections
    if (activeConnections.has(username)) {
      const existingConnection = activeConnections.get(username);
      
      // If this is a reconnection from the same user
      if (existingConnection) {
        console.log(`[Reconnection] User ${username} reconnecting. Old SocketID: ${existingConnection.socket.id}, New SocketID: ${socket.id}`);
        
        // Clean up the old socket
        try {
          existingConnection.socket.disconnect(true);
        } catch (err) {
          console.log(`[DisconnectError] Error disconnecting old socket: ${err}`);
        }
      }
    }
    
    // Store the new connection
    activeConnections.set(username, { 
      socket, 
      username, 
      connectionTime: Date.now() 
    });
    
    console.log(`[AuthSuccess] User: ${username} added with SocketID: ${socket.id}. Active connections: ${Array.from(activeConnections.keys())}`);
    socket.emit('authenticated', { username });
  }
  
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
      
      // If this is a reconnection from the same user (like a page refresh)
      if (existingConnection) {
        console.log(`[Reconnection] User ${username} reconnecting. Old SocketID: ${existingConnection.socket.id}, New SocketID: ${socket.id}`);
        
        // Clean up the old socket
        try {
          existingConnection.socket.disconnect(true);
        } catch (err) {
          console.log(`[DisconnectError] Error disconnecting old socket: ${err}`);
        }
        
        // Update with new socket
        activeConnections.set(username, { 
          socket, 
          username, 
          connectionTime: Date.now() 
        });
        
        console.log(`[ReconnectSuccess] User: ${username} reconnected with SocketID: ${socket.id}`);
        socket.emit('authenticated', { username });
        return;
      }
    }

    activeConnections.set(username, { 
      socket, 
      username, 
      connectionTime: Date.now() 
    });
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
      // For intentional disconnects or long disconnections, remove the user
      if (reason === 'client namespace disconnect' || reason === 'transport close') {
        // Keep the connection for a short time to allow for page refreshes
        setTimeout(() => {
          // Check if the user hasn't reconnected in the meantime
          const currentConnection = activeConnections.get(disconnectedUser as string);
          if (currentConnection && currentConnection.socket.id === socket.id) {
            activeConnections.delete(disconnectedUser as string);
            console.log(`[UserRemoved] User: ${disconnectedUser} (SocketID: ${socket.id}) removed after timeout. Active connections: ${Array.from(activeConnections.keys())}`);
          }
        }, 5000); // 5 seconds grace period for reconnection
        
        console.log(`[UserDisconnectTimeout] User: ${disconnectedUser} (SocketID: ${socket.id}) will be removed in 5 seconds if no reconnection occurs.`);
      }
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