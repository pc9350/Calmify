"use client";

import React, { useState, useEffect } from "react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

const PricingCard = ({ title, price, features, isPopular }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.id); // Reference to the user's document in Firestore
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsSubscribed(userData.isSubscribed || false); // Set the isSubscribed state
          }
        } catch (error) {
          console.error("Error fetching subscription status:", error);
        }
      }
    };

    fetchSubscriptionStatus();
  }, [user]);

  const handleCheckout = async () => {
    if (isPopular && !isSubscribed) {
      try {
        const response = await fetch("/api/checkout_sessions", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const session = await response.json();

        if (session.id) {
          const stripe = await loadStripe(
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
          );
          const { error } = await stripe.redirectToCheckout({
            sessionId: session.id,
          });
          if (error) {
            console.error("Stripe Checkout error:", error);
          }
        }
      } catch (error) {
        console.error("Error creating checkout session:", error);
      }
    }
  };

  return (
    <div
      className={`
        rounded-lg shadow-lg p-6 
        ${isPopular ? "bg-sage-green text-white" : "bg-white"} 
        ${isPopular ? "transform scale-105" : ""} 
        w-full md:w-80 mb-8 md:mb-0
        transition-all duration-300 ease-in-out
      `}
      style={{
        boxShadow: isPopular
          ? "0 10px 30px rgba(0, 0, 0, 0.2)"
          : "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        className={`text-2xl font-bold mb-4 text-center ${
          isPopular ? "text-white" : "text-sage-green"
        }`}
      >
        {title}
      </h2>
      <p className="text-4xl font-bold mb-6 text-center">{price}</p>
      <ul className="mb-6">
        {features.map((feature, index) => (
          <li key={index} className="mb-2 flex items-center">
            <svg
              className={`w-4 h-4 mr-2 ${
                isPopular ? "text-white" : "text-sage-green"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      {isPopular ? (
        isSubscribed ? (
          <button
            className="block w-full text-center px-4 py-2 rounded-md 
              bg-white text-sage-green border 2px-solid-green cursor-not-allowed"
            disabled
          >
            Subscribed
          </button>
        ) : (
          <button
            onClick={handleCheckout}
            className="block w-full text-center px-4 py-2 rounded-md 
              transition-all duration-300 ease-in-out transform hover:scale-105 hover:cursor-pointer
              bg-white text-sage-green hover:bg-gray-100"
          >
            Buy Now
          </button>
        )
      ) : (
        <>
          <SignedIn>
            <SignInButton mode="modal">
              <a
                className="block w-full text-center px-4 py-2 rounded-md 
            transition-all duration-300 ease-in-out cursor-not-allowed
            bg-sage-green text-white hover:bg-sage-green-dark"
              >
                Signed in
              </a>
            </SignInButton>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <a
                className="block w-full text-center px-4 py-2 rounded-md 
            transition-all duration-300 ease-in-out transform hover:scale-105 hover:cursor-pointer
            bg-sage-green text-white hover:bg-sage-green-dark"
              >
                Sign Up
              </a>
            </SignInButton>
          </SignedOut>
        </>
      )}
    </div>
  );
};

export default function PricingPage() {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center py-12 px-4"
      style={{
        background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
      }}
    >
      <h1 className="text-4xl font-bold text-center mt-4 mb-6 text-sage-green">
        Choose Your Plan
      </h1>
      <h2 className="text-xl text-neutral-700 italic text-center mb-12">
        Simple, flexible pricing for everyone.
      </h2>
      <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-0">
        <PricingCard
          title="Free"
          price="$0/month"
          features={[
            "Flashcards based on emotions or mood",
            "Ability to like or dislike flashcards",
            "Basic flashcards",
            "Standard support",
          ]}
        />
        <PricingCard
          title="Platinum"
          price="$4.99/month"
          features={[
            "Advanced flashcards",
            "Unlimited storage",
            "Mood detection with live photos",
            "Share flashcards on social media",
            "Priority support",
          ]}
          isPopular={true}
        />
      </div>
    </div>
  );
}
