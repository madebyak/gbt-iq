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

  // We're removing the redirect to login for unauthenticated users
  // This allows visitors to see the homepage and chat interface
  // They'll only be prompted to log in when they try to send a message

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Use swipe gestures on mobile
  useSwipeGesture(mainRef, {
    onSwipeRight: () => {
      // Only open sidebar on swipe right if it's closed
      if (!sidebarOpen) {
        setSidebarOpen(true);
      }
    },
    onSwipeLeft: () => {
      // Only close sidebar on swipe left if it's open
      if (sidebarOpen) {
        setSidebarOpen(false);
      }
    }
  });

  // Add keyboard shortcut for toggling sidebar (Ctrl+\)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl+\ to toggle sidebar
      if (e.key === '\\' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleSidebar();
      }

      // Ctrl+N for new chat
      if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // This will be handled by the Sidebar component
        const newChatButton = document.querySelector('[aria-label="Create new chat"]') as HTMLButtonElement;
        if (newChatButton) {
          newChatButton.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-accent text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - only show for authenticated users */}
      {status === 'authenticated' && <Sidebar isOpen={sidebarOpen} />}
      
      {/* Main content area - synchronized with sidebar animation */}
      <motion.div 
        ref={mainRef}
        className="flex flex-1 flex-col w-full"
        initial={false}
        animate={{
          marginLeft: sidebarOpen && status === 'authenticated' ? '0' : '0',
          filter: sidebarOpen && status === 'authenticated' ? 'brightness(0.9)' : 'brightness(1)'
        }}
        transition={{ duration: 0.3, ease: "linear" }}
      >
        <Header onMenuClick={status === 'authenticated' ? toggleSidebar : undefined} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </motion.div>
      
      {/* Overlay for mobile only - shown when sidebar is open */}
      <AnimatePresence>
        {sidebarOpen && status === 'authenticated' && (
          <motion.div 
            className="fixed inset-0 z-20 bg-black transition-opacity md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "linear" }}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
