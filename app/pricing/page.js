import React from 'react';
import { SignInButton } from '@clerk/nextjs';

const PricingCard = ({ title, price, features, isPopular }) => (
    <div className={`bg-gray-100 rounded-lg shadow-md p-6 ${isPopular ? 'border-2 border-sage-green' : ''}`}>
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        <p className="text-4xl font-bold mb-6 text-center">{price}</p>
        <ul className="mb-6">
            {features.map((feature, index) => (
                <li key={index} className="mb-2 flex items-center justify-center text-center">
                    <svg className="w-4 h-4 mr-2 text-sage-green" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                </li>
            ))}
        </ul>
        <SignInButton mode="modal">
            <a className="block mx-auto w-1/2 text-center px-4 py-2 bg-sage-green text-white rounded-md hover:bg-sage-green-dark transition-all duration-300 ease-in-out transform hover:scale-105 hover:cursor-pointer">
                {isPopular ? 'Buy Now' : 'Sign Up'}
            </a>
        </SignInButton>
    </div>
);

export default function PricingPage() {
    return (
        <div className="container mx-auto px-4 py-16" >
            <h1 className="text-4xl font-bold text-center mt-4 mb-6 text-sage-green">Choose Your Plan</h1>
            <h2 className="text-xl from-neutral-700 italic text-center mb-12">Simple, flexible pricing for everyone.</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <PricingCard
                    title="Free"
                    price="$0/month"
                    features={[
                        "Flashcards based on emotions or mood",
                        "Ability to like or dislike flashcards",
                        "Basic flashcards",
                        "Limited storage",
                        "Standard support",
                    ]}
                />
                <PricingCard
                    title="Platinum"
                    price="$9.99/month"
                    features={[
                        "Advanced flashcards",
                        "Unlimited storage",
                        "Mood detection with live photos",
                        "Share flashcards on social media",
                        "Priority support"
                    ]}
                    isPopular={true}
                />
            </div>
        </div>
    );
}
