"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LimitModal({ isOpen, onClose }: LimitModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 0, 0.36, 1] }}
          >
            <div className="bg-[#1A1B23] border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Service Temporarily Unavailable</h3>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  We apologize, but our messaging service has reached capacity and is currently unavailable. 
                  We&apos;re working to restore full functionality as quickly as possible.
                </p>
                
                <div className="bg-[#2A2B32] rounded-lg p-4 space-y-3">
                  <p className="text-sm text-gray-400 font-medium">Need immediate assistance?</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-gray-300">Contact us at:</span>
                    <a 
                      href="mailto:hello@moonswhale.com" 
                      className="text-accent hover:text-accent/80 transition-colors font-medium"
                    >
                      hello@moonswhale.com
                    </a>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  Thank you for your patience and understanding.
                </p>
              </div>
              
              {/* Footer */}
              <div className="p-6 pt-0 flex justify-end">
                <Button
                  onClick={onClose}
                  className="px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
                >
                  Understood
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 