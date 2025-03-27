"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { loadingAnimationVariants } from '@/app/lib/utils/animations';

interface LoadingDotsProps {
  color?: string;
  size?: number;
  className?: string;
}

export default function LoadingDots({ 
  color = 'bg-gray-accent', 
  size = 2, 
  className = ''
}: LoadingDotsProps) {
  return (
    <motion.div 
      className={`flex space-x-2 rtl:space-x-reverse ${className}`}
      variants={loadingAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      aria-label="Loading"
    >
      <div 
        className={`w-${size} h-${size} ${color} rounded-full animate-bounce`}
        style={{ animationDelay: '0s' }}
      />
      <div 
        className={`w-${size} h-${size} ${color} rounded-full animate-bounce`}
        style={{ animationDelay: '0.2s' }}
      />
      <div 
        className={`w-${size} h-${size} ${color} rounded-full animate-bounce`}
        style={{ animationDelay: '0.4s' }}
      />
    </motion.div>
  );
}
