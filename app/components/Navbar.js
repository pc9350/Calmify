import { useState, useEffect, useRef } from "react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const [navbarVisible, setNavbarVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);
  const timeoutRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsHomePage(pathname === '/');
  }, [pathname]);

  useEffect(() => {
    const handleMouseMove = () => {
      setNavbarVisible(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setNavbarVisible(false);
      }, 5000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navbarStyle = {
    transform: navbarVisible ? "translateY(0)" : "translateY(-100%)",
    transition: "transform 0.3s ease-in-out",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: isHomePage ? "rgba(0, 0, 0, 0)" : "white",
    zIndex: 1000,
  };

  const linkStyle = `transition-all duration-300 ease-in-out ${isHomePage ? 'text-white hover:text-gray-200' : 'text-black hover:text-gray-600'}`;

  return (
    <nav style={navbarStyle}>
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <Link href="/">
          <Image
              src="/calmify-logo.png"
              alt="App Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>
          <Link href="/" className={`text-2xl font-bold ${linkStyle}`}>
            Calmify
          </Link>
        </div>

        {/* Links for Desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/pricing" className={linkStyle}>
            Pricing
          </Link>
          <Link href="/features" className={linkStyle}>
            Features
          </Link>
          <Link href="/team" className={linkStyle}>
            Team
          </Link>
          <SignedOut>
            <SignInButton className={`px-4 py-2 bg-sage-green text-white rounded-md hover:bg-sage-green-dark transition-all duration-300 ease-in-out transform hover:scale-105`} />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden flex items-center space-x-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <button
            onClick={toggleMenu}
            className={`focus:outline-none ${isHomePage ? 'text-white' : 'text-black'}`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-[1200ms] ease-in-out ${
          menuOpen ? "max-h-50 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mt-2 space-y-2 text-center">
          <Link
            href="/pricing"
            className={`block transition duration-300 py-2 ${linkStyle}`}
          >
            Pricing
          </Link>
          <Link
            href="/features"
            className={`block transition duration-300 py-2 ${linkStyle}`}
          >
            Features
          </Link>
          <Link
            href="/team"
            className={`block transition duration-300 py-2 ${linkStyle}`}
          >
            Team
          </Link>
        </div>
      </div>
    </nav>
  );
}