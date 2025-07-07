
import './globals.css';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Your Portfolio', 
  description: 'A dynamic portfolio with an interactive neural network background.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="portfolio-main-content min-h-screen overflow-y-auto">
          {children} 
        </div>
      </body>
    </html>
  );
}