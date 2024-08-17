"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

const SuccessPage = () => {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const updateSubscriptionStatus = async () => {
      if (user) {
        try {
          const userDoc = doc(db, 'users', user.id); // Use Clerk user ID
          await updateDoc(userDoc, { isSubscribed: true });
          console.log('User subscription status updated to true');
        } catch (error) {
          console.error('Error updating subscription status:', error);
        }
      }

      // Redirect to the landing page after 3 seconds
      setTimeout(() => {
        router.push('/landing');
      }, 3000);
    };

    updateSubscriptionStatus();
  }, [user, db]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 bg-sage-green">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mt-4 mb-6 text-white">Payment Successful!</h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-lg text-center mb-12 text-white"
      >
        Thank you for your purchase! You will be redirected shortly.
      </motion.p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 1.5, duration: 3.5 }}
        className="h-2 bg-white rounded-full mt-8"
      />
    </div>
  );
};

export default SuccessPage;