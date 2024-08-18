"use client"

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Update this to your firebase config path
import LandingPage from "../components/LandingPage";

export default function Landing() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (user) {
        const userRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsSubscribed(userData.isSubscribed || false); // Assuming the subscription status is stored as `isSubscribed`
        }
      }
    };

    fetchSubscriptionStatus();
  }, [user]);

  return <LandingPage isSubscribed={isSubscribed} />;
}
