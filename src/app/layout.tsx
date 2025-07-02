// FRONTEND/src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground'; // Ensure this path is correct

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Your Portfolio', // Customize your title
  description: 'A dynamic portfolio with an interactive neural network background.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <NeuralNetworkBackground /> */}
      <body className={inter.className}>
        {/* This div wraps all your page content */}
        <div className="portfolio-main-content min-h-screen overflow-y-auto">
          {children} {/* Renders your page content */}
        </div>
      </body>
    </html>
  );
}