"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import Image from "next/image";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn("email", { email, callbackUrl: "/" });
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-sidebar rounded-xl">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image src="/images/logo.svg" alt="GPT-IQ" width={150} height={40} priority />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to GPT-IQ</h1>
          <p className="mt-2 text-gray-accent">Sign in to continue</p>
        </div>
        
        <div className="mt-8 space-y-6">
          <Button 
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full bg-white text-black hover:bg-gray-200 flex items-center justify-center"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-sidebar px-2 text-gray-accent">
                Or continue with email
              </span>
            </div>
          </div>
          
          <form onSubmit={handleEmailSignIn} className="mt-6 space-y-6">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="bg-input-bg border-gray-accent"
            />
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Sending verification..." : "Continue with Email"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
