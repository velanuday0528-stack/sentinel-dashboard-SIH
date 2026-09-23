import type { Metadata, Viewport } from 'next';
import { Orbitron, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SentinelProvider } from '@/context/sentinel-context';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'SENTINEL – AI-Powered Antenna Anti-Icing & Environmental Protection System',
  description:
    'Aerospace & defense-tech prototype dashboard for high-altitude antenna infrastructure in Ladakh. Closed-loop environmental monitoring, icing risk estimation, and automated anti-icing control by Team ELECTRONAUTS.',
  keywords: [
    'SENTINEL',
    'Antenna Anti-Icing',
    'High Altitude Defense',
    'Ladakh Antenna Protection',
    'Team ELECTRONAUTS',
    'Environmental Intelligence',
    'Icing Risk Estimation',
    'IoT Control Dashboard',
  ],
  authors: [{ name: 'Team ELECTRONAUTS' }],
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#030712',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} ${jetbrainsMono.variable} dark bg-slate-950`}>
      <body className="font-sans antialiased text-slate-100 bg-slate-950 min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
        <SentinelProvider>
          {children}
        </SentinelProvider>
      </body>
    </html>
  );
}
