"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import Hero from './components/Hero'; // Adjust the path based on your structure
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase'; // Adjust the path to your firebase config

export default function HomePage() {
  const { userId, isSignedIn, isLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser(); // Fetch detailed user information
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (isLoaded && isUserLoaded && isSignedIn && user) {
      // Sync user with Firebase
      const syncUserWithFirebase = async () => {
        try {
          const userRef = doc(db, 'users', userId);

          // Check if the user exists in Firebase
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            // If user exists, check the subscription status
            const userData = userDoc.data();
            setIsSubscribed(userData.isSubscribed || false);
          } else {
            // If user does not exist, set default subscription status
            await setDoc(userRef, {
              id: userId,
              email: user.emailAddresses[0].emailAddress,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              isSubscribed: false, // Default to false if not subscribed
              syncedAt: new Date().toISOString(),
            }, { merge: true });
          }

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
