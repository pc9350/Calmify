import { SignInButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <div
      className="hero-background"
      style={{ backgroundImage: `url('./calmify-background.webp')` }}
    >
      <div className="overlay"></div>
      <div className="hero-content">
        <h1 className="text-5xl font-bold mb-4">Welcome to Your Calm Space</h1>
        <p className="text-lg mb-8">
          A place where you can relax, reflect, and rejuvenate.
        </p>
        <SignInButton mode="modal">
          <a className="px-8 py-3 bg-sage-green text-white rounded-md hover:bg-sage-green-dark transition-all duration-300 ease-in-out transform hover:scale-105 hover:animate-pulse hover:cursor-pointer">
            Get Started
          </a>
        </SignInButton>
      </div>
    </div>
  );
}
