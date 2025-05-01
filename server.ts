import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { messages } from "./src/db/schema"; // Import the messages table

dotenv.config();

// Define message type
interface ChatMessage {
  text: string;
  timestamp: string;
}

const app = express();
const port = parseInt(process.env.PORT || "4000", 10);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

const db = drizzle(process.env.DATABASE_URL!); // Initialize the database connection

// Socket.io connection handler
io.on("connection", (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send welcome message
  socket.emit("message2", {
    text: "Welcome to the chat!",
    timestamp: new Date().toISOString(),
  });

  // Broadcast when a user connects
  socket.broadcast.emit("message2", {
    text: "A user has joined the chat",
    timestamp: new Date().toISOString(),
  });

  // Listen for chat messages
  socket.on("message", async (msg: ChatMessage) => {
    io.emit("message2", msg);
    console.log("Message received:", msg);

    // Insert the message into the database
    const message = {
      id: socket.id, // Ensure this matches the expected type in your schema
      fromId: socket.id, // Ensure this matches the expected type in your schema
      toId: "recipient_id", // Replace with actual recipient ID and ensure type matches
      date: new Date().toISOString(), // Ensure this matches the expected type in your schema
      chatData: [msg], // Ensure this matches the expected type in your schema
    };

    await db.insert(messages).values(message);
    console.log("Message stored in the database");
  });

  socket.on("disconnect", () => {
    io.emit("message2", {
      text: "A user has left the chat",
      timestamp: new Date().toISOString(),
    });
    console.log(`Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
