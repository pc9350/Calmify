"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import Hero from './components/Hero'; // Adjust the path based on your structure
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase'; // Adjust the path to your firebase config

export default function HomePage() {
  const { userId, isSignedIn, isLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser(); // Fetch detailed user information
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isUserLoaded && isSignedIn && user) {
      // Sync user with Firebase
      const syncUserWithFirebase = async () => {
        try {
          const userRef = doc(db, 'users', userId);
          await setDoc(userRef, {
            id: userId,
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            syncedAt: new Date().toISOString(),
          }, { merge: true });
          console.log('User data synced with Firebase');
        } catch (error) {
          console.error('Error syncing user with Firebase:', error);
        }
      };

      syncUserWithFirebase();
      router.push('/landing');
    }
  }, [isLoaded, isUserLoaded, isSignedIn, user, userId, router]);

  return (
    <div>
      {!isSignedIn && <Hero />}
    </div>
  );
}
