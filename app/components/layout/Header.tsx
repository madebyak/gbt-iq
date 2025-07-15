"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();
  
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
      <div className="flex items-center gap-4">
        <a 
          href="https://www.instagram.com/moonwhale.iq" 
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-accent px-4 py-2 text-text-primary hover:bg-opacity-90 transition-colors font-medium"
        >
          Developers
        </a>
        
        {session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full overflow-hidden">
                <Avatar>
                  <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                  <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-sidebar text-text-primary border-gray-accent">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-accent" />
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="bg-gray-accent" />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-gray-700" 
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
