"use client";

import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatContainer from '../components/ui/ChatContainer';

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar isOpen={true} onClose={() => {}} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      <div className="md:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-background">
        {/* Chat Header - Mobile only */}
        <header className="flex items-center md:hidden border-b border-[#444654] p-4">
          <button 
            className="rounded-full p-2 hover:bg-inputBg transition"
            onClick={() => setSidebarOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>
          <div className="mx-auto">
            <span className="text-lg font-medium">GPT-IQ</span>
          </div>
        </header>

        {/* Chat Container */}
        <ChatContainer />
      </main>
    </div>
  );
}
