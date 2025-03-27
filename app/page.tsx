"use client";

import MainLayout from './components/layout/MainLayout';
import ChatContainer from './components/ui/ChatContainer';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-1 flex-col items-center p-6 overflow-hidden">
        <h1 className="mt-4 mb-6 text-center font-bold text-[1.9375rem] font-arabic bg-gradient-text inline-block text-transparent bg-clip-text">
          الله بالخير.. خل نسولف
        </h1>
        <div className="flex-1 w-full max-w-[55.3125rem] mx-auto flex flex-col justify-end">
          <ChatContainer />
        </div>
      </div>
    </MainLayout>
  );
}
