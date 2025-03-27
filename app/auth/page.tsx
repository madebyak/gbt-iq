"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthForm from '../components/auth/AuthForm';

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <Link href="/" className="flex">
            <Image src="/images/logo.svg" alt="GPT-IQ" width={120} height={28} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-textGray">
        <p>Designed & Developed by MicroWhale. All right reserved</p>
      </footer>
    </div>
  );
}
