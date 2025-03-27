"use client";

import React, { useState } from 'react';
import Link from 'next/link';

type AuthMode = 'login' | 'register';

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would connect to a backend in a real implementation
    console.log({ mode, email, password });
  };

  return (
    <div className="rounded-lg bg-sidebar p-6 shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white">
          {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </h2>
        <p className="mt-2 text-textSecondary" dir="rtl">
          {mode === 'login' 
            ? 'قم بتسجيل الدخول للوصول إلى محادثاتك' 
            : 'قم بإنشاء حساب للبدء في استخدام GPT-IQ'}
        </p>
      </div>

      <form onSubmit={handleSubmit} dir="rtl">
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-[#444654] bg-inputBg p-2 text-white focus:border-accent focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-white">
            كلمة المرور
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-[#444654] bg-inputBg p-2 text-white focus:border-accent focus:outline-none"
            required
          />
        </div>

        {mode === 'register' && (
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-white">
              تأكيد كلمة المرور
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-[#444654] bg-inputBg p-2 text-white focus:border-accent focus:outline-none"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-accent py-2 px-4 font-medium text-white hover:bg-opacity-90 transition"
        >
          {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-textGray" dir="rtl">
          {mode === 'login' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="mr-2 text-accent hover:underline"
          >
            {mode === 'login' ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </button>
        </p>
      </div>
    </div>
  );
}
