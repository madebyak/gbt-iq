"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Camera } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    image: '',
    bio: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user) {
      setUserData({
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        image: session.user.image ?? '',
        bio: '',
      });
      
      // Fetch additional user data from Firestore
      const fetchUserData = async () => {
        try {
          const email = session.user?.email;
          if (!email) {
            setLoading(false);
            return;
          }
          
          const userDocRef = doc(db, 'users', email);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(prev => ({
              ...prev,
              bio: data.bio ?? '',
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserData();
    }
  }, [session, status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const email = session?.user?.email;
      if (!email) return;
      
      // Update in Firestore
      const userDocRef = doc(db, 'users', email);
      await updateDoc(userDocRef, {
        name: userData.name,
        bio: userData.bio,
      });
      
      // Update session
      await update({
        ...session,
        user: {
          ...session.user,
          name: userData.name,
        },
      });
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-accent text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8 text-text-primary">Your Profile</h1>
      
      <div className="bg-sidebar rounded-lg p-6 shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 mb-4">
              {userData.image ? (
                <img 
                  src={userData.image} 
                  alt={userData.name || 'Profile'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-accent text-white text-3xl">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <button 
              className="absolute bottom-4 right-0 bg-accent rounded-full p-2 text-white hover:bg-opacity-90 transition-colors"
              title="Change profile picture"
              disabled
            >
              <Camera size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-400">Profile picture is managed by your authentication provider</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-text-primary">
              Display Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-700 text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Your name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-text-primary">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                disabled
                className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-700 text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent opacity-70"
                placeholder="Your email"
              />
            </div>
            <p className="text-sm text-gray-400">Email is managed by your authentication provider</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-medium text-text-primary">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={userData.bio}
              onChange={handleChange}
              rows={4}
              className="block w-full px-3 py-2 rounded-md bg-gray-700 text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Tell us about yourself"
            />
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 px-4 bg-accent text-white rounded-md hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
