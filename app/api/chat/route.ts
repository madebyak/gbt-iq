import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
// Firebase admin will be imported conditionally
import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
// Note: authOptions removed - using getToken for auth checks

// Gemini API will be initialized in the request handler

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Configure demo mode settings
const DEMO_MESSAGE_LIMIT = 3;

// Helper function to get or create a chat history
async function getOrCreateChatHistory(sessionId: string, userId: string | null) {
  try {
    // For authenticated users, store in Firestore
    if (userId) {
      const { adminDb } = await import('../../lib/firebase-admin');
      const userChatsRef = adminDb.collection('users').doc(userId).collection('chats');
      const chatDocRef = userChatsRef.doc(sessionId);
      const chatDoc = await chatDocRef.get();
      
      if (!chatDoc.exists) {
        // Create a new chat document
        await chatDocRef.set({
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: []
        });
        console.log(`Created new chat document for user ${userId}, session ${sessionId}`);
        return { messages: [] };
      }
      
      return chatDoc.data();
    } else {
      // For demo mode, we'll use a simple in-memory store
      // In a real app, you might use a temporary storage solution
      return { messages: [] };
    }
  } catch (error) {
    console.error('Error getting or creating chat history:', error);
    throw error;
  }
}

// Helper function to save a message to the chat history
async function saveMessageToHistory(
  sessionId: string, 
  userId: string | null, 
  userMessage: string, 
  aiResponse: string
) {
  try {
    if (userId) {
      const { adminDb } = await import('../../lib/firebase-admin');
      const userChatsRef = adminDb.collection('users').doc(userId).collection('chats');
      const chatDocRef = userChatsRef.doc(sessionId);
      
      // Add the messages as separate objects
      const userMessageObj = {
        role: 'user',
        content: userMessage,
        timestamp: Date.now()
      };
      
      const aiMessageObj = {
        role: 'model',
        content: aiResponse,
        timestamp: Date.now()
      };
      
      // Use update with array union operation  
      const { FieldValue } = await import('firebase-admin/firestore');
      await chatDocRef.update({
        updatedAt: new Date(),
        messages: FieldValue.arrayUnion(userMessageObj, aiMessageObj)
      });
      
      console.log(`Saved messages to chat history for user ${userId}, session ${sessionId}`);
    }
    // For demo mode, we don't save the messages
    return true;
  } catch (error) {
    console.error('Error saving messages to history:', error);
    throw error;
  }
}

// Helper function to count demo messages for a session
const demoSessionCounts = new Map<string, number>();

function trackDemoSession(sessionId: string): number {
  const currentCount = demoSessionCounts.get(sessionId) || 0;
  const newCount = currentCount + 1;
  demoSessionCounts.set(sessionId, newCount);
  return newCount;
}

// Check if a user is authenticated by looking for session token
async function isAuthenticated(req: NextRequest) {
  try {
    const token = await getToken({ req });
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req: request });
    const userId = token?.sub || null;
    const isAuth = !!userId;
    
    // Parse the request body
    const { message, sessionId } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // If no sessionId provided, create a new one
    const chatSessionId = sessionId || `chat_${Date.now()}`;
    
    // Check if this is a demo session and track message count
    let demoMode = false;
    let messageCount = 0;
    let requireAuth = false;
    
    if (!isAuth) {
      demoMode = true;
      messageCount = trackDemoSession(chatSessionId);
      
      // Check if the user has exceeded the demo message limit
      if (messageCount > DEMO_MESSAGE_LIMIT) {
        requireAuth = true;
        return NextResponse.json({
          requireAuth: true,
          demoMode: true,
          messageCount,
          messageLimit: DEMO_MESSAGE_LIMIT,
          response: "You've reached the demo message limit. Please sign in to continue chatting and save your conversation history."
        });
      }
    }
    
    // If no sessionId was provided, return the newly created one
    if (!sessionId) {
      return NextResponse.json({
        message: "Session created",
        sessionId: chatSessionId,
        demoMode,
        messageCount,
        messageLimit: DEMO_MESSAGE_LIMIT
      });
    }
    
    // Get chat history for the user's session
    const chatHistory = await getOrCreateChatHistory(chatSessionId, userId);
    const chatMessages = chatHistory?.messages || [];
    
    // Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('Using Gemini model: gemini-pro');
    
    // Create a chat model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      safetySettings 
    });
    
    // Start a chat session
    const chat = model.startChat({
      history: chatMessages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });
    
    // Send the message to the model
    const result = await chat.sendMessage(message);
    const response = result.response;
    const responseText = response.text();
    
    // Save the message and response to the chat history
    if (userId) {
      await saveMessageToHistory(chatSessionId, userId, message, responseText);
    }
    
    // Return the response
    return NextResponse.json({
      response: responseText,
      sessionId: chatSessionId,
      demoMode,
      messageCount,
      messageLimit: DEMO_MESSAGE_LIMIT
    });
    
  } catch (error) {
    console.error('Error in chat API:', error);
    let errorMessage = 'An error occurred during API request';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error details:', error.stack);
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
