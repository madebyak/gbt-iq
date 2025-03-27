"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { MessageRole } from '@/app/lib/types/chat';
import { messageAnimationVariants } from '@/app/lib/utils/animations';

interface ChatMessageProps {
  role: MessageRole;
  content: string;
  timestamp?: number;
  index?: number;
}

// Define proper types for markdown components
type MarkdownComponentProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Function to detect if text is primarily Arabic
const isArabicText = (text: string): boolean => {
  // Arabic Unicode range
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  
  // Count Arabic characters
  let arabicCount = 0;
  let totalCount = 0;
  
  for (let i = 0; i < text.length; i++) {
    if (text[i].trim() === '') continue; // Skip whitespace
    totalCount++;
    if (arabicPattern.test(text[i])) {
      arabicCount++;
    }
  }
  
  // If more than 40% of characters are Arabic, consider it Arabic text
  return totalCount > 0 && (arabicCount / totalCount) > 0.4;
};

export default function ChatMessage({ role, content, timestamp, index = 0 }: ChatMessageProps) {
  const isUser = role === 'user';
  const isArabic = isArabicText(content);
  
  // Format timestamp if provided
  const formattedTime = timestamp 
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  
  return (
    <motion.div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 px-4 w-full`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={messageAnimationVariants}
      transition={{ delay: 0.1 + (index * 0.05) }} // Stagger effect
      layout
    >
      <div 
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-4 ${
          isUser 
            ? 'bg-accent-secondary text-white' 
            : 'bg-[#2A2B32] text-white'
        }`}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="text-base markdown-content break-words overflow-hidden">
          {isUser ? (
            <p dir={isArabic ? "rtl" : "ltr"} className="whitespace-pre-wrap break-words">
              {content}
            </p>
          ) : (
            <ReactMarkdown
              rehypePlugins={[rehypeSanitize, rehypeHighlight]}
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom components for better RTL support
                p: ({ node, ...props }: MarkdownComponentProps) => {
                  const text = String(props.children || '');
                  const dir = isArabicText(text) ? "rtl" : "ltr";
                  return <p dir={dir} className="whitespace-pre-wrap break-words text-right rtl:text-right ltr:text-left" {...props} />;
                },
                h1: ({ node, ...props }: MarkdownComponentProps) => {
                  const text = String(props.children || '');
                  const dir = isArabicText(text) ? "rtl" : "ltr";
                  return <h1 dir={dir} className="text-xl font-bold my-4 break-words rtl:text-right ltr:text-left" {...props} />;
                },
                h2: ({ node, ...props }: MarkdownComponentProps) => {
                  const text = String(props.children || '');
                  const dir = isArabicText(text) ? "rtl" : "ltr";
                  return <h2 dir={dir} className="text-lg font-bold my-3 break-words rtl:text-right ltr:text-left" {...props} />;
                },
                h3: ({ node, ...props }: MarkdownComponentProps) => {
                  const text = String(props.children || '');
                  const dir = isArabicText(text) ? "rtl" : "ltr";
                  return <h3 dir={dir} className="text-md font-bold my-2 break-words rtl:text-right ltr:text-left" {...props} />;
                },
                ul: ({ node, ...props }: MarkdownComponentProps) => {
                  return <ul dir={isArabic ? "rtl" : "ltr"} className="list-disc pl-5 pr-5 my-2 break-words rtl:pr-0 rtl:pl-5" {...props} />;
                },
                ol: ({ node, ...props }: MarkdownComponentProps) => {
                  return <ol dir={isArabic ? "rtl" : "ltr"} className="list-decimal pl-5 pr-5 my-2 break-words rtl:pr-0 rtl:pl-5" {...props} />;
                },
                li: ({ node, ...props }: MarkdownComponentProps) => {
                  const text = String(props.children || '');
                  const dir = isArabicText(text) ? "rtl" : "ltr";
                  return <li dir={dir} className="my-1 break-words rtl:text-right ltr:text-left" {...props} />;
                },
                a: ({ node, ...props }: MarkdownComponentProps) => {
                  const text = String(props.children || '');
                  const dir = isArabicText(text) ? "rtl" : "ltr";
                  return <a dir={dir} className="text-accent underline break-words" {...props} />;
                },
                code: ({ node, inline, className, children, ...props }: MarkdownComponentProps) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative my-4 rounded-md overflow-hidden">
                      <div className="bg-gray-800 text-xs px-3 py-1 text-gray-400">
                        {match[1]}
                      </div>
                      <code
                        className={`${className} block p-3 overflow-x-auto bg-gray-900 text-sm`}
                        dir="ltr" // Force LTR for code blocks
                        {...props}
                      >
                        {children}
                      </code>
                    </div>
                  ) : (
                    <code
                      className="bg-gray-800 text-sm px-1 py-0.5 rounded mx-1 break-words"
                      dir="ltr" // Force LTR for inline code
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                blockquote: ({ node, ...props }: MarkdownComponentProps) => {
                  const text = String(props.children || '');
                  const dir = isArabicText(text) ? "rtl" : "ltr";
                  return (
                    <blockquote 
                      dir={dir}
                      className={`${dir === 'rtl' ? 'border-r-4 pr-4 border-l-0' : 'border-l-4 pl-4 border-r-0'} border-accent italic my-4 break-words rtl:text-right ltr:text-left`}
                      {...props} 
                    />
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
        {timestamp && (
          <div className={`mt-1 text-xs opacity-70 ${isArabic ? 'text-left' : 'text-right'}`}>
            {formattedTime}
          </div>
        )}
      </div>
    </motion.div>
  );
}
