"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the help dialog when pressing '?' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Help button in the corner */}
      <button
        className="fixed bottom-4 right-4 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background z-50"
        onClick={() => setIsOpen(true)}
        aria-label="Keyboard shortcuts"
      >
        ?
      </button>

      {/* Keyboard shortcuts modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-x-4 top-1/2 max-w-lg mx-auto bg-[#282A2C] rounded-lg shadow-xl z-50 p-6 max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, y: 50, translateY: '-50%' }}
              animate={{ opacity: 1, y: 0, translateY: '-50%' }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: [0.22, 0, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="keyboard-shortcuts-title"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 id="keyboard-shortcuts-title" className="text-xl font-bold text-white">
                  لوحة المفاتيح الاختصارات
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-accent hover:text-white transition-colors"
                  aria-label="Close dialog"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">التنقل</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-accent">التمرير لأسفل</span>
                      <kbd className="px-2 py-1 bg-[#202123] rounded text-white font-mono">j</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-accent">التمرير لأعلى</span>
                      <kbd className="px-2 py-1 bg-[#202123] rounded text-white font-mono">k</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-accent">الانتقال إلى الأعلى</span>
                      <kbd className="px-2 py-1 bg-[#202123] rounded text-white font-mono">g</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-accent">الانتقال إلى الأسفل</span>
                      <kbd className="px-2 py-1 bg-[#202123] rounded text-white font-mono">G</kbd>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">الدردشة</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-accent">التركيز على حقل الإدخال</span>
                      <kbd className="px-2 py-1 bg-[#202123] rounded text-white font-mono">/</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-accent">إرسال الرسالة</span>
                      <kbd className="px-2 py-1 bg-[#202123] rounded text-white font-mono">Enter</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-accent">محادثة جديدة</span>
                      <div className="flex space-x-1 rtl:space-x-reverse">
                        <kbd className="px-2 py-1 bg-[#202123] rounded text-white font-mono">Ctrl</kbd>
                        <span className="text-gray-accent">+</span>
                        <kbd className="px-2 py-1 bg-[#202123] rounded text-white font-mono">N</kbd>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">واجهة المستخدم</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-accent">تبديل الشريط الجانبي</span>
                      <div className="flex space-x-1 rtl:space-x-reverse">
                        <kbd className="px-2 py-1 bg-[#202123] rounded text-white font-mono">Ctrl</kbd>
                        <span className="text-gray-accent">+</span>
                        <kbd className="px-2 py-1 bg-[#202123] rounded text-white font-mono">\</kbd>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-accent">إظهار اختصارات لوحة المفاتيح</span>
                      <kbd className="px-2 py-1 bg-[#202123] rounded text-white font-mono">?</kbd>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
