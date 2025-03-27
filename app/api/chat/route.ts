import { NextResponse } from 'next/server';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { getGeminiConfig } from '@/app/lib/utils/gemini';

// Initialize the Google Generative AI client
const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCHa6Z_YXIa1eSTbVD6kLAVKa2STDyNDm4';
const genAI = new GoogleGenerativeAI(apiKey);

// Store chat sessions in memory (in a real app, this would be a database)
const chatSessions = new Map();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);
    const { sessionId, message } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log(`Processing request with sessionId: ${sessionId}, message: ${message}`);

    // Get or create chat session
    let chatSession;
    let newSessionId = sessionId;

    if (sessionId && chatSessions.has(sessionId)) {
      console.log(`Using existing session: ${sessionId}`);
      chatSession = chatSessions.get(sessionId);
    } else {
      // Get configuration for the model
      const config = getGeminiConfig();
      console.log('Creating new session with config:', JSON.stringify(config));
      
      // Initialize model with system instructions
      const model = genAI.getGenerativeModel({
        model: config.model,
        systemInstruction: config.systemInstruction,
      });
      
      // Start a new chat with history
      chatSession = model.startChat({
        generationConfig: config.generationConfig,
        history: config.history,
      });
      
      newSessionId = Date.now().toString();
      chatSessions.set(newSessionId, chatSession);
      console.log(`Created new session with ID: ${newSessionId}`);
      
      // Return without sending message for first request (just create the session)
      if (!sessionId) {
        return NextResponse.json({
          sessionId: newSessionId,
          message: "Session created",
        });
      }
    }

    // Send the message to the model
    console.log(`Sending message to Gemini: ${message}`);
    try {
      const result = await chatSession.sendMessage(message);
      console.log('Gemini raw response:', result);
      const response = result.response.text();
      console.log(`Received response from Gemini: ${response}`);
      
      return NextResponse.json({
        sessionId: newSessionId,
        response,
      });
    } catch (error: any) {
      console.error('Error from Gemini API:', error);
      return NextResponse.json(
        { error: 'Failed to get response from Gemini API', details: error?.message || String(error) },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
