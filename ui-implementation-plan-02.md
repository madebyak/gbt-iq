# IRAQI-GPT Enhancement Implementation Plan

## Overview
This document outlines the plan for implementing authentication, conversation memory, Firebase integration, and additional Gemini API features to the IRAQI-GPT application.

## Table of Contents
1. Authentication System 
2. Conversation Memory Implementation 
3. Firebase Database Integration 
4. Gemini API Feature Enhancements 
5. UI Updates 
6. Implementation Timeline

## 1. Authentication System 

### 1.1. Package Installation 
```bash
npm install next-auth@beta @auth/firebase-adapter firebase
```

### 1.2. Auth.js Implementation 
Create API route for authentication:
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { FirebaseAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 15 * 60, // 15 minutes
    }),
  ],
  adapter: FirebaseAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  }),
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 1.3. Auth Provider Component 
```typescript
// app/providers/AuthProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### 1.4. Login Page UI 
```typescript
// app/auth/signin/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn("email", { email, callbackUrl: "/" });
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-sidebar rounded-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Welcome to GPT-IQ</h1>
          <p className="mt-2 text-text-secondary">Sign in to continue</p>
        </div>
        
        <div className="mt-8 space-y-6">
          <Button 
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full bg-white text-black hover:bg-gray-200"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              {/* Google logo SVG */}
            </svg>
            Continue with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-sidebar px-2 text-text-secondary">
                Or continue with email
              </span>
            </div>
          </div>
          
          <form onSubmit={handleEmailSignIn} className="mt-6 space-y-6">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="bg-input-bg border-gray-accent"
            />
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Sending verification..." : "Continue with Email"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### 1.5. Protected Route Middleware 
```typescript
// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/chat/:path*"],
};
```

## 2. Conversation Memory Implementation 

### 2.1. Update Gemini API Integration 
Modify the chat API route to properly maintain conversation context:

```typescript
// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { getGeminiConfig } from '@/app/lib/utils/gemini';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from '@/app/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  collection, 
  addDoc 
} from 'firebase/firestore';

// Initialize the Google Generative AI client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Store chat sessions in memory temporarily (will be backed by Firestore)
const chatSessions = new Map();

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const body = await request.json();
    const { sessionId, message } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get or create chat session
    let chatSession;
    let newSessionId = sessionId;

    if (sessionId && chatSessions.has(sessionId)) {
      chatSession = chatSessions.get(sessionId);
    } else {
      // Get configuration for the model
      const config = getGeminiConfig();
      
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
      
      // Create session in Firestore
      const sessionRef = doc(collection(db, 'users', userId, 'sessions'), newSessionId);
      await setDoc(sessionRef, {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // Return without sending message for first request
      if (!sessionId) {
        return NextResponse.json({
          sessionId: newSessionId,
          message: "Session created",
        });
      }
    }

    // Add user message to Firestore
    const messagesRef = collection(db, 'users', userId, 'sessions', newSessionId, 'messages');
    await addDoc(messagesRef, {
      role: 'user',
      content: message,
      timestamp: serverTimestamp(),
    });

    // Send the message to the model
    const result = await chatSession.sendMessage(message);
    const response = result.response.text();
    
    // Add AI response to Firestore
    await addDoc(messagesRef, {
      role: 'model',
      content: response,
      timestamp: serverTimestamp(),
    });
    
    // Update session timestamp
    const sessionRef = doc(db, 'users', userId, 'sessions', newSessionId);
    await updateDoc(sessionRef, {
      updatedAt: serverTimestamp(),
    });
    
    return NextResponse.json({
      sessionId: newSessionId,
      response,
    });
  } catch (error: any) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

```

## 3. Firebase Database Integration 

### 3.1. Firebase Setup 

```typescript
// app/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
```

### 3.2. Updated Chat Store Hook 

```typescript
// app/lib/hooks/useChatStore.ts
"use client";

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ChatMessage, ChatSession } from '../types/chat';
import { 
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  where,
  limit 
} from 'firebase/firestore';
import { db } from '../firebase';

const useChatStore = () => {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current session
  const currentSession = currentSessionId 
    ? sessions.find(session => session.id === currentSessionId) 
    : null;

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Load sessions from Firestore
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const userId = session.user.id;
    const sessionsRef = collection(db, 'users', userId, 'sessions');
    const q = query(sessionsRef, orderBy('updatedAt', 'desc'), limit(20));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const sessionPromises = snapshot.docs.map(async (doc) => {
        const sessionData = doc.data();
        const messagesRef = collection(db, 'users', userId, 'sessions', doc.id, 'messages');
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
        const messagesSnapshot = await getDocs(messagesQuery);
        
        const messages = messagesSnapshot.docs.map(msgDoc => ({
          id: msgDoc.id,
          role: msgDoc.data().role,
          content: msgDoc.data().content,
          timestamp: msgDoc.data().timestamp?.toMillis() || Date.now(),
        }));
        
        return {
          id: doc.id,
          messages: messages,
          createdAt: sessionData.createdAt?.toMillis() || Date.now(),
          updatedAt: sessionData.updatedAt?.toMillis() || Date.now(),
        };
      });
      
      const loadedSessions = await Promise.all(sessionPromises);
      setSessions(loadedSessions);
      
      // Set current session if none is selected
      if (!currentSessionId && loadedSessions.length > 0) {
        setCurrentSessionId(loadedSessions[0].id);
      }
    });
    
    return () => unsubscribe();
  }, [session?.user?.id, currentSessionId]);

  // Create new session
  const createSession = useCallback(async () => {
    if (!session?.user?.id) return null;
    
    const userId = session.user.id;
    const newSessionId = generateId();
    
    // Create in Firestore
    await setDoc(doc(db, 'users', userId, 'sessions', newSessionId), {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    setCurrentSessionId(newSessionId);
    
    // Return optimistic session object
    return {
      id: newSessionId,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }, [session?.user?.id, generateId]);

  // Send message to API
  const sendMessage = useCallback(async (content: string) => {
    if (!session?.user?.id) return;
    
    if (!currentSessionId) {
      const newSession = await createSession();
      if (!newSession) return;
      setCurrentSessionId(newSession.id);
    }

    setLoading(true);
    setError(null);

    try {
      // Call the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: currentSessionId,
          message: content
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      
      // Messages will be updated via the Firestore listener
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }, [currentSessionId, createSession, session?.user?.id]);

  return {
    sessions,
    currentSession,
    currentSessionId,
    loading,
    error,
    sendMessage,
    createSession,
    setCurrentSessionId
  };
};

export default useChatStore;

```

## 4. Gemini API Feature Enhancements 

### 4.1. Streaming Implementation 

Add streaming support to the chat API:

```typescript
// app/api/chat/stream/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiConfig } from '@/app/lib/utils/gemini';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

// Initialize the Google Generative AI client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Store chat sessions in memory
const chatSessions = new Map();

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const userId = session.user.id;
    const body = await request.json();
    const { sessionId, message } = body;
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get or create chat session
    let chatSession;
    let newSessionId = sessionId;

    if (sessionId && chatSessions.has(sessionId)) {
      chatSession = chatSessions.get(sessionId);
    } else {
      // Get configuration for the model
      const config = getGeminiConfig();
      
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
      
      // Return without sending message for first request
      if (!sessionId) {
        return new Response(
          JSON.stringify({ sessionId: newSessionId, message: "Session created" }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Send the message to the model
    const stream = await chatSession.sendMessageStream(message);
    
    // Create a readable stream for the response
    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          // Send the sessionId first
          controller.enqueue(JSON.stringify({ sessionId: newSessionId }) + '\n');
          
          // Send each chunk as it arrives
          for await (const chunk of stream) {
            const text = chunk.text;
            controller.enqueue(JSON.stringify({ text }) + '\n');
          }
          
          controller.enqueue(JSON.stringify({ done: true }) + '\n');
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });
    
    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request', details: error?.message || String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

### 4.2. Enhanced Safety Settings 

Update the Gemini configuration to include safety settings:

```typescript
// app/lib/utils/gemini.ts (updated)
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Configuration for the Gemini model
export const getGeminiConfig = () => {
  return {
    model: "gemini-2.0-flash",
    systemInstruction: "You are an Iraqi Ai assistant and chatbot, your job is to answer anything in an IRAQI accent and language, never ever switch your accent to different arabic accent or language. if the user asks you who you are , how do you function, who made you, who created you. you should answer with : I have been developed and made by an Iraqi company called MoonWhale ",
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
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
    ],
    history: [
      // Existing history array
    ],
  };
};
```

## 5. UI Updates 

### 5.1. User Auth State Integration 

Update the MainLayout to respect authentication:

```typescript
// app/components/layout/MainLayout.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import useSwipeGesture from '@/app/lib/hooks/useSwipeGesture';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Rest of component remains the same
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Main content area */}
      <motion.div 
        ref={mainRef}
        className="flex flex-1 flex-col w-full"
        animate={{
          marginLeft: sidebarOpen ? '0' : '0',
          filter: sidebarOpen ? 'brightness(0.9)' : 'brightness(1)'
        }}
      >
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </motion.div>
    </div>
  );
}
```

### 5.2. Updated Header with User Menu 

```typescript
// app/components/layout/Header.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();
  
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-sidebar">
      <div className="flex items-center">
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-text-primary hover:bg-sidebar transition-colors mr-4"
          aria-label="Menu"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link href="/" className="flex items-center">
          <Image src="/images/logo.svg" alt="GPT-IQ" width={120} height={25} priority />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <a 
          href="https://www.instagram.com/moonwhale.iq" 
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-accent px-4 py-2 text-text-primary hover:bg-opacity-90 transition-colors font-medium"
        >
          Developers
        </a>
        
        {session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full overflow-hidden">
                <Avatar>
                  <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                  <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-sidebar text-text-primary border-gray-accent">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-accent" />
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-accent" />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-gray-700" 
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
```

## 6. Implementation Timeline

### Week 1: Authentication & Firebase Setup 

- Day 1-2: Set up Firebase project and Auth.js 
- Day 3-4: Create login UI and protected routes 
- Day 5: Test authentication flow end-to-end 

### Week 2: Conversation Memory & Firestore Integration 

- Day 1-2: Update chat API to use Gemini chat sessions 
- Day 3-4: Implement Firestore database schema and adapters 
- Day 5: Test conversation memory with follow-up questions 

### Week 3: Streaming & UI Enhancements 

- Day 1-2: Implement streaming API endpoint 
- Day 3-4: Update frontend to handle streaming responses 
- Day 5: Test, optimize, and polish UI 

### Week 4: Testing & Deployment 

- Day 1-2: Write tests for critical paths 
- Day 3-4: Optimize for performance 
- Day 5: Deploy to production 
