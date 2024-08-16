import { useState, useEffect, useRef } from "react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const [navbarVisible, setNavbarVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setNavbarVisible(true);

      // Clear the previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Hide the navbar after 10 seconds of inactivity
      timeoutRef.current = setTimeout(() => {
        setNavbarVisible(false);
      }, 5000); // Adjust delay as needed
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
    setMenuOpen(!menuOpen); // Toggle the menu state
  };

  return (
    <nav
      style={{
        transform: navbarVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease-in-out",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(255, 255, 255, 0)",
        zIndex: 1000,
      }}
    >
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <img
            src="./calmify-logo.png"
            alt="App Logo"
            className="h-10 w-10 object-contain"
          />
          <a href="#" className="text-2xl font-bold text-white">
            Calmify
          </a>
        </div>

        {/* Links for Desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          <a href="#" className="text-white">
            Home
          </a>
          <a href="#" className="text-white">
            Features
          </a>
          <a href="#" className="text-white">
            Contact
          </a>
          <SignedOut>
            <SignInButton className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        {/* Hamburger Menu for Mobile  */}
        <div className="md:hidden flex items-center space-x-4">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <button
              onClick={toggleMenu} // Toggle the menu on click
            className="text-gray-800 focus:outline-none"
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
          <a
            href="#"
            className="block text-white hover:text-gray-800 transition duration-300 py-2"
          >
            Pricing
          </a>
          <a
            href="#"
            className="block text-white hover:text-gray-800 transition duration-300 py-2"
          >
            Features
          </a>
          <a
            href="#"
            className="block text-white hover:text-gray-800 transition duration-300 py-2"
          >
            Contact
          </a>
          {/* <SignedOut>
            <SignInButton className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-400" />
          </SignedOut> */}
        </div>
      </div>
    </nav>
  );
}