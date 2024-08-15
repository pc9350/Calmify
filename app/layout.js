"use client";

import {
  ClerkProvider,
} from '@clerk/nextjs';
import './globals.css';
import Navbar from './components/Navbar';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
