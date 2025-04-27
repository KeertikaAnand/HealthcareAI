import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import cors from "cors";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure CORS for better cross-origin support
  app.use(cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  // Health check endpoint for API status
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy",
      timestamp: new Date().toISOString(), 
      message: "Healthcare API is operating normally"
    });
  });

  // Example API endpoint for the healthcare chatbot
  // In a real implementation, this would connect to AWS services
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }
      
      // In a production environment, this would integrate with AWS services
      // such as Amazon Lex for natural language processing and 
      // Lambda for business logic processing
      
      // For demo purposes, we're responding with a simple message
      const response = {
        message: `Thank you for your health query about "${message}". This is a placeholder response as the server would typically forward this to AWS Lex and Lambda.`,
        sessionId: sessionId || Date.now().toString(36),
      };
      
      return res.json(response);
    } catch (error) {
      console.error("Error processing chat message:", error);
      return res.status(500).json({ error: "Failed to process message" });
    }
  });

  // Add API documentation endpoint
  app.get("/api/docs", (req, res) => {
    res.json({
      name: "Healthcare Chatbot API",
      version: "1.0.0",
      endpoints: [
        {
          path: "/api/health",
          method: "GET",
          description: "Check API health status"
        },
        {
          path: "/api/chat",
          method: "POST",
          description: "Send a message to the healthcare chatbot",
          body: {
            message: "string (required) - The user's health-related question",
            sessionId: "string (optional) - A unique session identifier"
          }
        }
      ]
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
