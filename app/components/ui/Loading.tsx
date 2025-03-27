"use client";

import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
}

export default function Loading({ size = 'medium' }: LoadingProps) {
  const sizeClass = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClass[size]} animate-spin rounded-full border-2 border-inputBg border-t-accent`}></div>
    </div>
  );
}
