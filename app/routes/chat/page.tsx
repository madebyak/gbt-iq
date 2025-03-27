import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../components/layout/Sidebar';
import ChatContainer from '../../components/ui/ChatContainer';

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar isOpen={true} onClose={() => {}} />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      <div className="md:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-background">
        {/* Chat Header */}
        <header className="flex items-center justify-between border-b border-gray-800 p-4">
          <h2 className="text-lg font-medium">محادثة جديدة</h2>
          <div className="flex items-center gap-2">
            <button 
              className="md:hidden rounded-full p-2 hover:bg-gray-800 transition"
              onClick={() => setSidebarOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <button className="rounded-full p-2 hover:bg-gray-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </header>

        {/* Chat Container */}
        <ChatContainer />
      </main>
    </div>
  );
}
