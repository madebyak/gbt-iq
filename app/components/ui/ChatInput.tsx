"use client";

import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { buttonHoverVariants, inputAnimationVariants } from '@/app/lib/utils/animations';

interface ChatInputProps {
  onSendMessage?: (content: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Focus input on '/' key press when not already focused on an input
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && 
          document.activeElement !== inputRef.current &&
          !(document.activeElement instanceof HTMLInputElement) && 
          !(document.activeElement instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown as any);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown as any);
  }, []);

  return (
    <div className="w-full max-w-[55.3125rem] mx-auto relative">
      <div className="relative w-full flex items-center">
        <motion.div 
          className="w-full"
          variants={inputAnimationVariants}
          animate={isFocused ? "focus" : "idle"}
        >
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="اكتبلي، سولفلي، اسألني أي شئ"
            dir="rtl"
            className="w-full h-[3.8125rem] rounded-[1.25rem] border border-gray-accent bg-input-bg pl-16 pr-4 text-white focus:outline-none focus:border-accent text-right font-arabic text-base transition-all duration-300"
            aria-label="Message input"
          />
        </motion.div>
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <motion.button
            onClick={handleSubmit}
            disabled={!message.trim()}
            className="w-[3rem] h-[3rem] rounded-[1rem] bg-[#282A2C] flex items-center justify-center disabled:opacity-50 transition-all"
            aria-label="Send message"
            variants={buttonHoverVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
          >
            <Send className="w-[1.5rem] h-[1.5rem] text-accent" />
          </motion.button>
        </div>
      </div>
      
      {/* Footer attribution */}
      <div className="mt-2 text-xs text-gray-accent text-center hidden sm:block">
        Developed by <a href="https://www.moonswhale.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">MoonWhale Team</a>
      </div>
    </div>
  );
}
