"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Settings, Moon, Sun, Globe, Bell, Shield } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'en',
    notifications: true,
    privacy: {
      saveHistory: true,
      shareData: false,
    }
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.email) {
      // Fetch user settings from Firestore
      const fetchSettings = async () => {
        try {
          const email = session.user?.email;
          if (!email) return;
          
          const userDocRef = doc(db, 'users', email);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists() && userDoc.data().settings) {
            setSettings(userDoc.data().settings);
          }
        } catch (error) {
          console.error('Error fetching settings:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchSettings();
    }
  }, [session, status, router]);

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handlePrivacyToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key as keyof typeof prev.privacy],
      }
    }));
  };

  const handleThemeChange = (theme: string) => {
    setSettings(prev => ({
      ...prev,
      theme,
    }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({
      ...prev,
      language: e.target.value,
    }));
  };

  const saveSettings = async () => {
    const email = session?.user?.email;
    if (!email) return;
    
    setSaving(true);
    try {
      const userDocRef = doc(db, 'users', email);
      await updateDoc(userDocRef, {
        settings,
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-accent text-xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-8">
        <Settings className="h-6 w-6 mr-2 text-accent" />
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      </div>
      
      <div className="space-y-8">
        {/* Appearance */}
        <div className="bg-sidebar rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Appearance</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Theme</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex items-center justify-center p-3 rounded-md ${
                    settings.theme === 'light' 
                      ? 'bg-accent text-white' 
                      : 'bg-gray-700 text-text-primary'
                  }`}
                >
                  <Sun className="h-5 w-5 mr-2" />
                  Light
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex items-center justify-center p-3 rounded-md ${
                    settings.theme === 'dark' 
                      ? 'bg-accent text-white' 
                      : 'bg-gray-700 text-text-primary'
                  }`}
                >
                  <Moon className="h-5 w-5 mr-2" />
                  Dark
                </button>
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`flex items-center justify-center p-3 rounded-md ${
                    settings.theme === 'system' 
                      ? 'bg-accent text-white' 
                      : 'bg-gray-700 text-text-primary'
                  }`}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M14 15v4M10 15v4M6 19h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  System
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-text-primary mb-2">
                Language
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="language"
                  value={settings.language}
                  onChange={handleLanguageChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-700 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notifications */}
        <div className="bg-sidebar rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Notifications</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-3 text-gray-400" />
              <span className="text-text-primary">Enable notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.notifications}
                onChange={() => handleToggle('notifications')}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
        
        {/* Privacy & Security */}
        <div className="bg-sidebar rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 mr-2 text-gray-400" />
            <h2 className="text-xl font-semibold text-text-primary">Privacy & Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-primary">Save chat history</p>
                <p className="text-sm text-gray-400">Store your conversations for future reference</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.privacy.saveHistory}
                  onChange={() => handlePrivacyToggle('saveHistory')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-primary">Share anonymous usage data</p>
                <p className="text-sm text-gray-400">Help us improve by sharing anonymous usage statistics</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.privacy.shareData}
                  onChange={() => handlePrivacyToggle('shareData')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="py-2 px-6 bg-accent text-white rounded-md hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
