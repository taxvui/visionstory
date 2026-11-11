import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { VisionStoryProvider } from '@/components/VisionStoryProvider';
import { Navbar } from '@/components/Navbar';
import { GlobalModals } from '@/components/GlobalModals';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'VisionStory - AI Video Generator for Avatars, Agents and Creators',
  description:
    'Write a prompt, upload a photo, or bring your slides. VisionStory directs the scene, voice, motion, and captions — V-Character 4.0 talking avatars, AI Video Agent, Music Video, Podcast, Face Swap & OpenAPI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body>
        <VisionStoryProvider>
          <Navbar />
          <GlobalModals />
          {children}
        </VisionStoryProvider>
      </body>
    </html>
  );
}
