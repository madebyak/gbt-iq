"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import useChatStore from '@/app/lib/hooks/useChatStore';
import { buttonHoverVariants, sidebarAnimationVariants } from '@/app/lib/utils/animations';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { 
    sessions, 
    currentSessionId, 
    createSession, 
    setCurrentSessionId 
  } = useChatStore();
  
  // Sort sessions by updatedAt (most recent first)
  const sortedSessions = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);
  
  // Get the most recent 10 sessions
  const recentSessions = sortedSessions.slice(0, 10);
  
  // Handle new chat creation
  const handleNewChat = () => {
    createSession();
  };
  
  // Handle selecting a session
  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };
  
  // Get a truncated title for a session based on the first message
  const getSessionTitle = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session || session.messages.length === 0) {
      return "New Chat";
    }
    
    // Use the first user message as the title
    const firstUserMessage = session.messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      // Truncate to 25 characters
      return firstUserMessage.content.length > 25 
        ? `${firstUserMessage.content.substring(0, 25)}...` 
        : firstUserMessage.content;
    }
    
    return "New Chat";
  };

  return (
    <motion.aside 
      className={`
        h-full w-[22.4375rem] flex flex-col bg-[#282A2C]
        fixed md:static inset-y-0 left-0 z-30
        ${!isOpen && 'md:w-0 md:opacity-0'}
      `}
      variants={sidebarAnimationVariants}
      initial={false}
      animate={isOpen ? "open" : "closed"}
      aria-hidden={!isOpen}
      aria-label="Sidebar navigation"
    >
      <div className="p-5 mt-5">
        <motion.button
          className="flex h-[3.8125rem] w-[11.625rem] items-center justify-center gap-3 rounded-[62.4375rem] bg-[#202123]"
          onClick={handleNewChat}
          variants={buttonHoverVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          aria-label="Create new chat"
        >
          <Plus className="h-[1.5rem] w-[1.5rem] text-white" />
          <span className="text-white font-['Inter'] text-base font-normal">NEW CHAT</span>
        </motion.button>
      </div>

      {/* Recent Chats */}
      <div className="mt-4 px-5 overflow-y-auto flex-grow">
        <h2 className="text-white font-['Inter'] text-base font-normal mb-4" id="recent-chats-heading">Recent</h2>
        <div className="space-y-4" role="list" aria-labelledby="recent-chats-heading">
          {recentSessions.map((session) => (
            <motion.button
              key={session.id}
              className={`flex w-full items-center gap-3 px-3 py-3 text-white hover:bg-[#202123] rounded-md ${
                currentSessionId === session.id ? 'bg-[#202123]' : ''
              }`}
              onClick={() => handleSelectSession(session.id)}
              variants={buttonHoverVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              aria-current={currentSessionId === session.id ? 'page' : undefined}
              dir="auto"
            >
              <MessageSquare className="h-5 w-5 text-white flex-shrink-0" />
              <span className="truncate text-base text-left">
                {getSessionTitle(session.id)}
              </span>
              <span className="ml-auto text-xs text-gray-accent flex-shrink-0">
                {new Date(session.updatedAt).toLocaleDateString()}
              </span>
            </motion.button>
          ))}
          
          {recentSessions.length === 0 && (
            <div className="text-gray-accent text-center py-4">
              No recent chats
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-sidebar p-4 text-center text-xs text-gray-accent">
        Designed & Developed by MoonWhale. All right reserved
      </div>
    </motion.aside>
  );
}
