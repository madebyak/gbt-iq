"use client";

import { useState, useCallback, useEffect } from 'react';

export type MessageType = 'user' | 'ai';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: string;
}

const useChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Generate a unique ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Get the current session
  const currentSession = currentSessionId 
    ? sessions.find(session => session.id === currentSessionId)
    : null;

  // Create a new chat session
  const createSession = useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      name: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString()
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    
    return newSession;
  }, []);

  // Switch to a different chat session
  const switchSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, []);

  // Delete a chat session
  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    if (currentSessionId === sessionId) {
      setCurrentSessionId(sessions.length > 1 ? sessions[0].id : null);
    }
  }, [currentSessionId, sessions]);

  // Rename a chat session
  const renameSession = useCallback((sessionId: string, newName: string) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, name: newName } 
          : session
      )
    );
  }, []);

  // Send a message in the current session
  const sendMessage = useCallback(async (content: string) => {
    if (!currentSessionId) {
      const newSession = createSession();
      setCurrentSessionId(newSession.id);
    }

    // Create user message
    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    // Add user message to the current session
    setSessions(prev => 
      prev.map(session => 
        session.id === currentSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, userMessage],
              name: session.messages.length === 0 ? content.substring(0, 30) : session.name
            } 
          : session
      )
    );

    // Simulate AI response
    setLoading(true);
    
    setTimeout(() => {
      // Create AI message
      const aiMessage: Message = {
        id: generateId(),
        type: 'ai',
        content: `This is a simulated response to: "${content}"`,
        timestamp: new Date().toISOString()
      };

      // Add AI message to the current session
      setSessions(prev => 
        prev.map(session => 
          session.id === currentSessionId 
            ? { ...session, messages: [...session.messages, aiMessage] } 
            : session
        )
      );

      setLoading(false);
    }, 1000);
  }, [createSession, currentSessionId]);

  // Load sessions from localStorage on initial render
  useEffect(() => {
    const savedSessions = localStorage.getItem('chat-sessions');
    
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        setSessions(parsedSessions);
        
        if (parsedSessions.length > 0) {
          setCurrentSessionId(parsedSessions[0].id);
        }
      } catch (error) {
        console.error('Failed to parse saved sessions:', error);
      }
    }
  }, []);

  // Save sessions to localStorage when they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chat-sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  return {
    sessions,
    currentSessionId,
    currentSession,
    loading,
    createSession,
    switchSession,
    deleteSession,
    renameSession,
    sendMessage
  };
};

export default useChat;
