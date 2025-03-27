"use client";

import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, ChatSession } from '../types/chat';

const useChatStore = () => {
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

  // Create new session
  const createSession = useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    console.log('Creating new session:', newSession);
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);

    return newSession;
  }, []);

  // Send message to API
  const sendMessage = useCallback(async (content: string) => {
    console.log(`Sending message: "${content}"`);
    
    if (!currentSessionId) {
      console.log('No current session, creating one...');
      const newSession = createSession();
      setCurrentSessionId(newSession.id);
    }

    setLoading(true);
    setError(null);

    try {
      // Add user message to state first
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: Date.now()
      };

      console.log('Adding user message to state:', userMessage);
      // Update session with user message
      setSessions(prev => 
        prev.map(session => {
          if (session.id === currentSessionId) {
            return {
              ...session,
              messages: [...session.messages, userMessage],
              updatedAt: Date.now()
            };
          }
          return session;
        })
      );

      // Call the API
      console.log(`Calling API with sessionId: ${currentSessionId}, message: ${content}`);
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

      console.log('API response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(`API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      if (!data.response && !data.message) {
        console.error('No response or message in API response:', data);
        throw new Error('Invalid response from API');
      }
      
      // If this is just a session creation response, don't add an AI message
      if (data.message === "Session created") {
        console.log('Session created, not adding AI message');
        // Update our session ID 
        if (data.sessionId && data.sessionId !== currentSessionId) {
          console.log(`Updating session ID from ${currentSessionId} to ${data.sessionId}`);
          setCurrentSessionId(data.sessionId);
          
          // Now immediately send the message again with the new session ID
          const retryResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId: data.sessionId,
              message: content
            })
          });
          
          if (!retryResponse.ok) {
            const retryErrorData = await retryResponse.json();
            console.error('Retry API error response:', retryErrorData);
            throw new Error(`Retry API error: ${retryErrorData.error || retryResponse.statusText}`);
          }
          
          const retryData = await retryResponse.json();
          console.log('Retry API response data:', retryData);
          
          if (!retryData.response) {
            console.error('No response in retry API response:', retryData);
            throw new Error('Invalid response from retry API');
          }
          
          // Add AI response from retry request
          const aiMessage: ChatMessage = {
            id: generateId(),
            role: 'model',
            content: retryData.response,
            timestamp: Date.now()
          };
          
          console.log('Adding AI message from retry to state:', aiMessage);
          setSessions(prev => 
            prev.map(session => {
              if (session.id === data.sessionId) {
                return {
                  ...session,
                  messages: [...session.messages, aiMessage],
                  updatedAt: Date.now()
                };
              }
              return session;
            })
          );
        }
      } else if (data.response) {
        // Add AI response to session
        const aiMessage: ChatMessage = {
          id: generateId(),
          role: 'model',
          content: data.response,
          timestamp: Date.now()
        };

        console.log('Adding AI message to state:', aiMessage);
        setSessions(prev => 
          prev.map(session => {
            if (session.id === currentSessionId) {
              return {
                ...session,
                messages: [...session.messages, aiMessage],
                updatedAt: Date.now()
              };
            }
            return session;
          })
        );
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }, [currentSessionId, createSession, generateId]);

  // Load sessions from localStorage on initial render
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      try {
        console.log('Loading sessions from localStorage');
        setSessions(JSON.parse(savedSessions));
      } catch (err) {
        console.error('Error loading sessions from localStorage:', err);
      }
    }
  }, []);

  // Save sessions to localStorage when they change
  useEffect(() => {
    if (sessions.length > 0) {
      console.log('Saving sessions to localStorage:', sessions);
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

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
