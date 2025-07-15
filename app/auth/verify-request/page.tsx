"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";

export default function VerifyRequest() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-sidebar rounded-xl text-center">
        <div className="flex justify-center mb-6">
          <Image src="/images/logo.svg" alt="GPT-IQ" width={150} height={40} priority />
        </div>
        
        <h1 className="text-2xl font-bold text-white">Check your email</h1>
        <p className="mt-2 text-gray-accent">
          A sign in link has been sent to your email address.
        </p>
        <p className="mt-4 text-gray-accent">
          Please check your email (including spam folder) for a link to sign in.
        </p>
        
        <div className="mt-8">
          <Link href="/auth/signin" passHref>
            <Button className="w-full bg-accent hover:bg-opacity-90">
              Back to sign in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
