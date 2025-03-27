"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
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
      <div>
        <Link 
          href="/auth" 
          className="rounded-md bg-accent px-4 py-2 text-text-primary hover:bg-opacity-90 transition-colors font-medium"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
