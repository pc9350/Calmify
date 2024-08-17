"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const CancelPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the landing page after 5 seconds
    const timer = setTimeout(() => {
      router.push('/pricing');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 bg-gradient-to-r from-rose-400 to-rose-300">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mt-4 mb-6 text-white">Payment Canceled</h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-lg text-center mb-12 text-white"
      >
        Your payment was canceled. If you have any questions, please contact support.
      </motion.p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 1.5, duration: 3.5 }}
        className="h-2 bg-white rounded-full mt-8"
      />
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="mt-8 px-6 py-2 bg-white text-rose-500 rounded-full font-semibold hover:bg-rose-100 transition-colors duration-300"
        onClick={() => router.push('/landing')}
      >
        Return to Home
      </motion.button>
    </div>
  );
};

export default CancelPage;