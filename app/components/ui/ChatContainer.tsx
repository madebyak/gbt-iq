"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import LoadingDots from './LoadingDots';
import useChatStore from '@/app/lib/hooks/useChatStore';
import { loadingAnimationVariants } from '@/app/lib/utils/animations';

export default function ChatContainer() {
  const { 
    currentSession, 
    loading, 
    sendMessage, 
    createSession,
    error 
  } = useChatStore();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create a new session if none exists
  useEffect(() => {
    if (!currentSession) {
      createSession();
    }
  }, [currentSession, createSession]);

  // Auto-scroll to latest message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, scrollToBottom]);

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  // Keyboard navigation - press 'j' to scroll down, 'k' to scroll up
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      switch (e.key) {
        case 'j': // Scroll down
          container.scrollBy({ top: 100, behavior: 'smooth' });
          break;
        case 'k': // Scroll up
          container.scrollBy({ top: -100, behavior: 'smooth' });
          break;
        case 'g': // Scroll to top
          container.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'G': // Scroll to bottom
          scrollToBottom();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToBottom]);

  return (
    <div className="flex flex-col justify-between h-full">
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="py-4 px-2 md:px-4">
          <AnimatePresence>
            {currentSession && currentSession.messages.length === 0 && (
              <motion.div 
                className="text-center py-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 0, 0.36, 1] }}
              >
                {/* Empty state - no prompt text */}
              </motion.div>
            )}

            {currentSession?.messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
                index={index}
              />
            ))}
          </AnimatePresence>
          
          <AnimatePresence>
            {loading && (
              <motion.div 
                className="flex mx-4 my-2"
                variants={loadingAnimationVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="bg-[#2A2B32] rounded-2xl p-4 max-w-[80%] md:max-w-[70%]">
                  <LoadingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div 
                className="text-red-500 text-center p-2 mx-4 my-2 bg-red-100/10 rounded-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 0, 0.36, 1] }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} tabIndex={-1} />
        </div>
      </div>
      
      <div className="py-4 px-2 sm:py-6 sm:px-4 mt-auto">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
