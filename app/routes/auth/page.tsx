import React from 'react';
import Link from 'next/link';
import AuthForm from '../../components/auth/AuthForm';

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            GPT-IRAQ
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
      <footer className="border-t border-gray-800 p-6 text-center text-sm text-gray-text">
        <p>© {new Date().getFullYear()} GPT-IRAQ. جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
